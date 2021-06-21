const express = require('express');
const {
  findWithKey,
  findJoined_WithKey
} = require('../models/Query/comanQuery');
// const { objecID } = require("../models/connection");
const router = express.Router();
var jwt = require('jsonwebtoken');

const {
  jsonSecret,
  maldah,
  MainDB: dbName,
  MainDB
} = require('../config/keys');
const { Links, AcessLinks } = require('../config/linksRoute');
const { verifyToken, isHQAdmin, isAdmin } = require('../auth');
const { Extract } = require('../models/util');
const { link } = require('joi');

const collName = 'Users';
const collName2 = 'Companies';
const BranchColl = 'Branches';
// const dbName = 'xisabhaye';

// login User
router.post(`/`, async (req, res) => {
  try {
    // console.log(req.body);
    // res.sendStatus(500);
    // return;
    let UserData = req.body;
    let key = {
      _id: new RegExp(`^${UserData.userName}$`, 'i')
    };

    const UserLogin = {
      DB_Name: dbName,
      Base_Coll: collName,
      Join_Coll: collName2,
      localField: 'Company',
      foreignField: '_id',
      as: 'comColl',
      project: { comColl: 0, compPhone: 0, Active: 0, created: 0, manager: 0 },
      key
    };

    findJoined_WithKey(UserLogin)
      .then(([data]) => {
        // console.log(data);
        let reqdomain = req.get('origin');
        let re;
        // console.log(data);
        if (data) re = new RegExp(`${data.domain}`);
        else {
          res.status(404).send('Incorrect User or Passwords');
          return;
        }
        // console.log(reqdomain);
        if (
          re.exec(reqdomain) !== null ||
          (reqdomain === 'http://localhost:5000/' &&
            process.env.NODE_ENV !== 'production')
        ) {
          // console.log(UserData);
          maldah
            .DecryptPassword(UserData.password, data.Password)
            .then(async same => {
              // console.log(same);

              if (same) {
                try {
                  let LoginUser = {
                    DB: data.DB_Name,
                    coll: BranchColl,
                    key: {
                      _id: data.UserBranch
                      // companyName: data.Company
                    }
                  };
                  let info = {
                    ...Extract(data, ['_id', 'UserType', 'Company']),
                    Access: data.DB_Name
                  };
                  let User = {
                    user: {
                      userName: data._id,
                      systemName: data.compName,
                      FullName: data.FullName,
                      UserType: data.UserType
                    },
                    settings: {
                      appParColor: data.appParColor,
                      textColor: data.textColor,
                      sideColor: data.sideColor,
                      title: data.compName,
                      duration: data.duration
                    }
                  };
                  let value = null;
                  let mycom = null;
                  if (
                    data.UserBranch !== 'SUPER ADMIN' &&
                    data.UserType !== 'HQ-Admin'
                  ) {
                    mycom = await findWithKey(
                      LoginUser.DB,
                      LoginUser.coll,
                      LoginUser.key
                    );
                    // console.log(mycom);
                    if (mycom) {
                      User.settings.appParColor = mycom.appParColor;
                      User.settings.sideColor = mycom.sideColor;
                      User.settings.textColor = mycom.textColor;
                      User.branchInfo = {
                        BranchName: mycom.BranchName,
                        CashBase: mycom.CashBase,
                        country: mycom.country,
                        City: mycom.city,
                        phone: mycom.phone
                      };
                    }
                    if (data.UserType.toUpperCase() != 'ADMIN')
                      value = await findWithKey(data.DB_Name, 'UserGroup', {
                        _id: `${data.UserType}-${mycom._id}`,
                        branch: mycom._id
                      });
                    info.branchID = mycom._id;
                  }

                  let rout = AcessLinks(
                    value ? value.route : Links(User.user.UserType)
                  );
                  User.links = rout;

                  jwt.sign(
                    info,
                    jsonSecret,
                    { expiresIn: '12h' },
                    (err, token) => {
                      if (!err) {
                        res.json({ token, User });
                      } else {
                        res
                          .status(400)
                          .send('internal Error Contact to devloper');
                        console.log(error);
                        throw error;
                      }
                    }
                  );
                } catch (error) {
                  res.status(400).send('internal Error Contact to devloper');
                  console.log(error);
                  return;
                }
                // });
              } else res.status(404).send('Incorrect User or PASSWORD');
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
        } else res.status(404).send('Incorrect USER or Password');
      })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  // res.sendStatus(500);
});

router.post('/SuperAdmin', verifyToken, isHQAdmin, async (req, res) => {
  // let { appParColor, sideColor, textColor } = await findWithKey(
  //   AccessDB,
  //   BranchColl,
  //   { _id }
  // );

  let { BranchName, _id, CashBase } = req.body;

  let { AccessDB, UserName, ...othes } = req.headers.user;

  let User = {
    user: {
      UserType: 'Admin',
      isWitch: true
    },

    branchInfo: {
      BranchName,
      CashBase,
      country: req.body.country,
      City: req.body.city,
      phone: req.body.phone
    },
    links: AcessLinks(Links('Admin'))
  };
  let newToken = {
    _id: UserName,
    UserType: 'Admin',
    Access: AccessDB,
    Company: othes.Company,
    branchID: _id,
    CashBase: CashBase
  };

  jwt.sign(newToken, jsonSecret, { expiresIn: '12h' }, (err, token) => {
    if (!err) {
      res.json({ token, User });
    } else {
      res.status(400).send('internal Error Contact to devloper');
      console.log(error);
      throw error;
    }
  });
});

router.get('/switchAccount', verifyToken, isAdmin, (req, res) => {
  // console.log(req.headers.user);
  // res.sendStatus(500);
  // return;
  const user = req.headers.user;
  // eslint-disable-next-line no-unused-vars
  let { branchID, AccessDB, ...others } = user;
  // othes.UserBranch = 'SUPER ADMIN';
  let newToken = {
    _id: others.UserName,
    UserType: 'HQ-Admin',
    Access: AccessDB,
    Company: others.Company
  };

  // othes.UserType = 'HQ-Admin';
  let User = {
    user: {
      UserType: 'HQ-Admin',
      isWitch: false
    },

    links: AcessLinks(Links('HQ-Admin'))
  };
  // othes.branchID = branch;
  jwt.sign(newToken, jsonSecret, { expiresIn: '12h' }, (err, token) => {
    if (!err) {
      // res.json({ token, rToken: [] });
      res.json({ token, User });
      // { ogol: Links(othes.UserType) },
    } else {
      console.log(err);
      throw err;
    }
  });

  // res.sendStatus(500);
});
module.exports = router;
