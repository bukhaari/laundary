const express = require('express');
const Joi = require('joi');
const { verifyToken } = require('../../../../auth');
const { ObjectID } = require('mongodb');
const {
  insertOne,
  findAll,
  updateOne,
  findOneAndUpdateData
} = require('../../../../models/Query/comanQuery');
const router = express.Router();

router.use(verifyToken);

//Collection Name
const AccessColl = 'Employees';

router.get('/', (req, res) => {
  const { AccessDB, branchID } = req.headers.user;

  findAll(AccessDB, AccessColl, { branch: branchID })
    .then(datas => {
      res.send(datas);
    })
    .catch(er => {
      res.send(er.message);
    });
});

router.post('/', async (req, res) => {
  const { error } = EmployeetSchema(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const { AccessDB, branchID } = req.headers.user;

  let newData = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    branch: branchID
  };

  try {
    const result = await insertOne(AccessDB, AccessColl, newData);
    const data = result.ops[0];
    res.send(data);
  } catch (ex) {
    res.send(ex.message);
    console(ex);
  }
});

router.put('/', async (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  try {
    let UpdateInfo = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      branch: branchID
    };
    const filterKey = {
      branch: branchID,
      _id: ObjectID(req.body._id)
    };

    const result = await findOneAndUpdateData(
      AccessDB,
      AccessColl,
      UpdateInfo,
      filterKey
    );
    res.send(result);
  } catch (error) {
    res.send('Data was not found!!');
    console.log(error);
    throw error;
  }
});

function EmployeetSchema(Client) {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.number().required(),
      address: Joi.string(),
      _id: Joi.number()
      // date: Joi.date().required(),
    });

    return schema.validate(Client);
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = router;
