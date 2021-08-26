const express = require('express');
const { verifyToken } = require('../../../auth');
const router = express.Router();
const Joi = require('joi');
const { ObjectID } = require('mongodb');
const {
  insertOneData,
  findAll,
  findOneData,
  findJoined_WithKey,
  findOneAndUpdateData
} = require('../../../models/Query/comanQuery');

router.use(verifyToken);

//Collection Names
const CollOrder = 'OrdersList';
const CollClient = 'Client';

router.post('/', async (req, res) => {
  // console.log('req.body:', req.body);
  try {
    const { AccessDB, branchID } = req.headers.user;

    const client = {
      name: req.body.name,
      number: parseInt(req.body.number),
      Date: new Date().toString()
    };

    const filterKey = {
      branch: branchID,
      number: req.body.number
    };

    const getClient = await findOneData(AccessDB, CollClient, filterKey);

    // console.log('getClient:', getClient);
    let newClient = {};
    if (!getClient)
      [newClient] = await insertOneData(AccessDB, CollClient, {
        ...client,
        branch: branchID
      });

    // console.log('newClient:', newClient);

    const typeService = req.body.serviceOrder.find(s => s);
    const OrderService = {
      note: '',
      shelf: 0,
      discount: 0,
      status: 'Queue',
      branch: branchID,
      type: typeService.type,
      balance: req.body.balance,
      Date: new Date().toString(),
      typePaid: req.body.typePaid,
      paidAmount: req.body.paidAmount,
      oldBalance: req.body.oldBalance,
      total: req.body.totalAmount,
      itemsOrders: req.body.serviceOrder,
      clientId: !newClient._id ? getClient._id : newClient._id
    };

    const [result] = await insertOneData(AccessDB, CollOrder, OrderService);
    // console.log('OrderService', result);

    res.send(result);
  } catch (ex) {
    res.send(ex.message);
    console.log(ex);
  }
});

router.get('/', async (req, res) => {
  // console.log('req.body', req.body);
  const { AccessDB, branchID } = req.headers.user;
  const OrderClient = {
    DB_Name: AccessDB,
    Base_Coll: CollOrder,
    Join_Coll: CollClient,
    localField: 'clientId',
    foreignField: '_id',
    as: 'Cleint',
    project: { clientId: 0 },
    key: {
      branch: branchID
    }
  };
  const datas = await findJoined_WithKey(OrderClient);
  res.send(datas);
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
