const express = require('express');
const { verifyToken } = require('../../../auth');
const router = express.Router();
const Joi = require('joi');
// const Joi = require('joi-oid');

const { ObjectID } = require('mongodb');
const {
  insertOne,
  findAll,
  findOneAndUpdateData,
  findWithKey
} = require('../../../models/Query/comanQuery');

router.use(verifyToken);

//Collection Name
const AccessColl = 'invoice';

router.post('/', async (req, res) => {
  console.log('req.body:', req.body);
  try {
    const { AccessDB, branchID } = req.headers.user;

    const client = {
      name: req.body.name,
      number: req.body.number
    };

    // const { _id: clientId } = req.body.client;

    // const getClient = await findWithKey(AccessDB, 'Client', client.number);

    // console.log('getClient:', getClient);

    let newClient = {};

    // if (getClient)
    // newClient = await insertOne(AccessDB, 'Client', {
    //   ...client,
    //   branch: branchID
    // });

    // console.log('newClient:', newClient);

    // const invoice = {
    //   customerId: getClient ? getClient._id : newClient._id,
    //   total: req.body.total,
    //   transaction: {
    //     date: new Date().toString(),
    //     paid: req.body.paid,
    //     balance: req.body.balance
    //   }
    // };

    // const result = await insertOne(AccessDB, AccessColl, {
    //   ...invoice,
    //   branch: branchID
    // });

    // const data = result.ops[0];
    // res.send(data);
    res.send('from server');
  } catch (ex) {
    res.send(ex.message);
    console.log(ex);
  }
});

function InvoiceSchema(data) {
  try {
    const TransactionSchema = Joi.object().keys({
      date: Joi.date().required(),
      paid: Joi.number().required(),
      balance: Joi.number().required()
    });

    const schema = Joi.object({
      total: Joi.number().required(),
      transaction: TransactionSchema
    });

    return schema.validate(data);
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = router;
