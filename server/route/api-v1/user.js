const express = require('express');
const Joi = require('joi');
// const { objecID } = require("../../models/connection");
const query = require('../../models/Query/comanQuery');
const { maldah, MainDB: DBName } = require('../../config/keys');
const { verifyToken } = require('../../auth');
const router = express.Router();

// all route names
const collNameGrp = 'UserGroup';
const collNameUsr = 'Users';

router.post('/groups', verifyToken, (req, res) => {
  // res.sendStatus("<h1>Found a request</h1>");
  const { AccessDB, branchID } = req.headers.user;

  let group = {
    _id: req.body.GroupName.toUpperCase() + `-${branchID}`,
    GroupName: req.body.GroupName.toUpperCase(),
    route: req.body.route,
    branch: branchID
  };
  if (group.GroupName !== '' && group.route.length > 0) {
    if (group.route.indexOf('Home') === -1) {
      res.status(403).send('Home page is must');
      return;
    }
    query
      .findWithKey(AccessDB, collNameGrp, {
        _id: group._id
        // branch: branchID
      })
      .then(result => {
        if (
          !result &&
          (group.GroupName !== 'ADMIN' || group.GroupName !== 'HQ-ADMIN')
        ) {
          query.insertOne(AccessDB, collNameGrp, group).then(() => {
            res.sendStatus(201);
          });
        } else if (
          group.GroupName === 'ADMIN' ||
          group.GroupName == 'HQ-ADMIN'
        ) {
          res.status(409).send(`Name: ( ${req.body.GroupName} ) is Reserved`);
        } else
          res
            .status(409)
            .send(`Name: ( ${req.body.GroupName} ) already registered`);

        // console.log(result);
      });
  } else res.status(400).send(`please choose at least one link`);
  // res.sendStatus(201);
});

router.put('/groups', verifyToken, (req, res) => {
  // res.sendStatus("<h1>Found a request</h1>");
  try {
    const { AccessDB, branchID } = req.headers.user;

    // console.log(req.body);
    let group = {
      _id: `${req.body.GroupName}-${branchID}`,
      route: req.body.route
    };
    const UpdateKey = {
      // branch: branchID,
      _id: group._id
    };

    if (req.body.GroupName !== '' && group.route.length > 0) {
      if (group.route.indexOf('Home') === -1) {
        res.status(403).send('Home page is must');
        return;
      }
      query
        .updateOne(AccessDB, collNameGrp, UpdateKey, group)
        .then(() => {
          res.sendStatus(201);
        })
        .catch(error => {
          console.log(error);
          res.status(500).send('Editing Failed Try again');
        });
    } else res.status(400).send('Bad request');
    // res.sendStatus(201);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.get('/groups', verifyToken, (req, res) => {
  const { AccessDB, branchID } = req.headers.user;

  query.findAll(AccessDB, collNameGrp, { branch: branchID }).then(result => {
    res.send(result);
  });
});

router.get('/', verifyToken, (req, res) => {
  const { Company, branchID, UserBranch } = req.headers.user;
  // console.log(req.headers.user);

  query
    .findAll(DBName, collNameUsr, { Company, UserBranch: branchID })
    .then(result => {
      // console.log(result);
      res.send(result);
    });
});

router.post('/', verifyToken, (req, res) => {
  // res.sendStatus("<h1>Found a request</h1>");
  const { Company, branchID } = req.headers.user;

  // console.log(req.headers.user);

  // console.log(req.body);
  // res.sendStatus(500);
  // return;

  try {
    const { error } = UserSchema(req.body);
    let NewUser = { ...req.body, UserBranch: branchID, Company };

    // console.log(UserSchema(NewUser));

    if (!error) {
      query
        .findWithKey(DBName, collNameUsr, {
          _id: new RegExp(`^${NewUser._id}$`, 'i')
        })
        .then(async result => {
          // console.log(result);
          if (!result) {
            await maldah
              .CryptPassowrd(NewUser.Password)
              .then(hash => {
                NewUser.Password = hash;

                // console.log(hash);
                query.insertOne(DBName, collNameUsr, NewUser).then(() => {
                  res.sendStatus(201);
                });
              })
              .catch(err => {
                res.status(400).send('Internal Error happaned try again');
                throw err;
              });
          } else
            res.status(409).send(`User Name ${NewUser._id} is not Available`);

          // console.log(result);
          // });
        });
    } else {
      // console.log(error);
      res.status(400).send(error.details[0].message);
    }
    // res.sendStatus(201);
  } catch (error) {
    console.log(error);
    throw error;
  }
});
router.put('/', verifyToken, (req, res) => {
  // res.sendStatus("<h1>Found a request</h1>");
  try {
    // console.log(req.body);
    let UpdateUser = {
      UserType: req.body.UserType,
      FullName: req.body.FullName
    };
    const UpdateKey = {
      // branch: branchID,
      _id: req.body._id
    };

    query
      .updateOne(DBName, collNameUsr, UpdateKey, UpdateUser)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Editing Failed Try again');
      });

    // res.sendStatus(201);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.post('/changepass', verifyToken, (req, res) => {
  const { /* AccessDB */ /* branchID */ UserName } = req.headers.user;

  let Passords = req.body;

  try {
    query
      .findWithKey(DBName, collNameUsr, {
        _id: UserName
      })
      .then(result => {
        // console.log(result);
        maldah
          .DecryptPassword(Passords.OldPass, result.Password)
          .then(same => {
            // console.log(same);
            if (same) {
              maldah.CryptPassowrd(Passords.NewPass).then(hash => {
                query
                  .updateOne(
                    DBName,
                    collNameUsr,
                    { _id: UserName },
                    { Password: hash },
                    false
                  )
                  .then(() => {
                    res.sendStatus(201);
                  });
              });
            } else res.status(403).send(`Old Password is incorrect`);
          })
          .catch(err => {
            res.status(400).send('Internal Error happaned try again');
            throw err;
          });

        // console.log(result);
      });
    // res.sendStatus(201);
  } catch (error) {
    console.lq(error);
    throw error;
  }
});

router.post('/ForceChangepass', verifyToken, (req, res) => {
  // res.sendStatus("<h1>Found a request</h1>");
  // let userIn = _.pick(req.headers.user, ["HouseName", "UserName"]);

  // console.log(req.body);
  // res.sendStatus(500);

  let Passords = req.body;

  try {
    query
      .findWithKey(DBName, collNameUsr, {
        _id: Passords._id
      })
      .then(result => {
        // console.log(result);
        if (result)
          maldah.CryptPassowrd(Passords.Password).then(hash => {
            query
              .updateOne(
                DBName,
                collNameUsr,
                { _id: Passords._id },
                { Password: hash },
                false
              )
              .then(() => {
                res.sendStatus(201);
              });
          });
        else res.status(403).send(`User Name: ${Passords._id} not found`);

        // console.log(result);
      });
    // res.sendStatus(201);
  } catch (error) {
    console.lq(error);
    throw error;
  }
});

function UserSchema(NewUser) {
  const schema = Joi.object({
    FullName: Joi.string().required(),
    UserType: Joi.string().required(),
    _id: Joi.string().required(),
    Password: Joi.string().required()
  });

  return schema.validate(NewUser);
}
module.exports = router;
