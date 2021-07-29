const express = require('express');
const { verifyToken } = require('../../../auth');
const router = express.Router();
const Joi = require('joi');
const { ObjectID } = require('mongodb');
const {
  insertOne,
  findAll,
  findOneAndUpdateData
} = require('../../../models/Query/comanQuery');

router.use(verifyToken);

//Collection Name
const AccessColl = 'Services';

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
  // console.log('data before post', req.body);
  let newData = {
    item: req.body.item,
    washing: req.body.washing,
    ExWashing: req.body.ExWashing,
    ironing: req.body.ironing,
    ExIroning: req.body.ExIroning
  };

  const { error } = ServicetSchema(newData);

  if (error) return res.status(400).send(error.details[0].message);

  const { AccessDB, branchID } = req.headers.user;

  try {
    const result = await insertOne(AccessDB, AccessColl, {
      ...newData,
      branch: branchID
    });
    const data = result.ops[0];
    // console.log('data after post', data);
    res.send(data);
  } catch (ex) {
    res.send(ex.message);
    console.log(ex);
  }
});

router.put('/', async (req, res) => {
  // console.log('data before put:', req.body);
  let UpdateInfo = {
    item: req.body.item,
    washing: req.body.washing,
    ExWashing: req.body.ExWashing,
    ironing: req.body.ironing,
    ExIroning: req.body.ExIroning
  };

  const { error } = ServicetSchema(UpdateInfo);
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
    // console.log('data after put:', result);
    res.send(result);
  } catch (error) {
    res.send('Data was not Updated!');
    console.log(error);
    throw error;
  }
});

function ServicetSchema(service) {
  try {
    const schema = Joi.object({
      item: Joi.string().required(),
      washing: Joi.number().required(),
      ExWashing: Joi.number().required(),
      ironing: Joi.number().required(),
      ExIroning: Joi.number().required()
    });
    return schema.validate(service);
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = router;
