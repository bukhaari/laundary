const express = require('express');
const Joi = require('joi');
const { verifyToken } = require('../../../../auth');
const { ObjectID } = require('mongodb');
const {
  insertOne,
  findAll,
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
  console.log('data before post', req.body);
  let newData = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address
  };
  const { error } = EmployeetSchema(newData);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const { AccessDB, branchID } = req.headers.user;

  try {
    const result = await insertOne(AccessDB, AccessColl, {
      ...newData,
      branch: branchID
    });
    const data = result.ops[0];
    console.log('data after post', data);
    res.send(data);
  } catch (ex) {
    res.send(ex.message);
    console(ex);
  }
});

router.put('/', async (req, res) => {
  console.log('data before put:', req.body);
  let UpdateInfo = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address
  };

  const { error } = EmployeetSchema(UpdateInfo);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const { AccessDB, branchID } = req.headers.user;
    const filterKey = {
      branch: branchID,
      _id: ObjectID(req.body._id)
    };

    const result = await findOneAndUpdateData(
      AccessDB,
      AccessColl,
      { ...UpdateInfo, branch: branchID },
      filterKey
    );
    console.log('data after put:', result);
    res.send(result);
  } catch (error) {
    res.send('Data was not Updated!');
    console.log(error);
    throw error;
  }
});

function EmployeetSchema(employee) {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.number().required(),
      address: Joi.string()
    });
    return schema.validate(employee);
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = router;
