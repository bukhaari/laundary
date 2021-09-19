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
  updateMany,
  findOneAndUpdateData,
  updateOne,
  FindDelete
} = require('../../../models/Query/comanQuery');

router.use(verifyToken);

//Collection Names
const CollOrder = 'OrdersList';
const CollClient = 'Client';
const CollPayment = 'Payment';

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

    const {
      orderAmount,
      oldBalance,
      totalAmount,
      paidAmount,
      balance,
      typePaid
    } = req.body;

    const typeService = req.body.serviceOrder.find(s => s);
    const NewOrder = {
      note: '',
      shelf: 0,
      balance: orderAmount - paidAmount,
      branch: branchID,
      type: typeService.type,
      Date: new Date().toString(),
      itemsOrders: req.body.serviceOrder,
      status: 'Queue',
      clientId: !newClient._id ? getClient._id : newClient._id
    };

    const [DbOrder] = await insertOneData(AccessDB, CollOrder, NewOrder);
    // console.log('DbOrder', DbOrder);

    // if pays all debts, balance will be equal to zero
    if (totalAmount === paidAmount && getClient) {
      await updateMany(
        AccessDB,
        CollOrder,
        { branch: branchID, clientId: getClient._id },
        {
          balance: 0,
          status: 'Payment'
        }
      );
    }

    // let remain =
    //   orderAmount + oldBalance < paidAmount
    //     ? paidAmount - orderAmount + oldBalance
    //     : 0;

    const NewPayment = {
      discount: 0,
      // remain: remain,
      branch: branchID,
      balance: balance,
      typePaid: typePaid,
      total: totalAmount,
      OrderId: DbOrder._id,
      paidAmount: paidAmount,
      oldBalance: oldBalance,
      orderAmount: orderAmount,
      Date: new Date().toString(),
      status: 'correct',
      clientId: !newClient._id ? getClient._id : newClient._id
    };
    const [DbPayment] = await insertOneData(AccessDB, CollPayment, NewPayment);
    // console.log('DbPayment', DbPayment);

    res.sendStatus(200);
  } catch (ex) {
    res.send(ex.message);
    console.log(ex);
  }
});

router.get('/list', async (req, res) => {
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
  const data = await findJoined_WithKey(OrderClient);
  const sortData = data.sort((a, b) => (b.Date > a.Date ? -1 : 1));

  res.send(sortData);
});

router.put('/ready', async (req, res) => {
  // console.log('req.body:', req.body);
  try {
    const { AccessDB, branchID } = req.headers.user;

    const { orderId, shelf } = req.body;

    const getOrder = await findOneData(AccessDB, CollOrder, {
      branch: branchID,
      _id: ObjectID(orderId)
    });

    if (getOrder) {
      await updateOne(
        AccessDB,
        CollOrder,
        { branch: branchID, _id: getOrder._id },
        {
          status: 'Ready',
          shelf: shelf
        }
      );
    }
    res.sendStatus(200);
  } catch (ex) {
    res.send(ex.message);
    console.log(ex);
  }
});

router.put('/taken', async (req, res) => {
  // console.log('req.body:', req.body);
  try {
    const { AccessDB, branchID } = req.headers.user;

    const { orderId } = req.body;

    const getOrder = await findOneData(AccessDB, CollOrder, {
      branch: branchID,
      _id: ObjectID(orderId)
    });

    if (getOrder) {
      await updateOne(
        AccessDB,
        CollOrder,
        { branch: branchID, _id: getOrder._id },
        {
          status: 'Taken'
        }
      );
    }
    res.sendStatus(200);
  } catch (ex) {
    res.send(ex.message);
    console.log(ex);
  }
});

router.put('/missed', async (req, res) => {
  // console.log('req.body:', req.body);
  try {
    const { AccessDB, branchID } = req.headers.user;

    const { orderId, note } = req.body;

    const getOrder = await findOneData(AccessDB, CollOrder, {
      branch: branchID,
      _id: ObjectID(orderId)
    });

    if (getOrder) {
      await updateOne(
        AccessDB,
        CollOrder,
        { branch: branchID, _id: getOrder._id },
        {
          status: 'Missed',
          note: note
        }
      );

      await updateOne(
        AccessDB,
        CollPayment,
        {
          branch: branchID,
          OrderId: getOrder._id
        },
        {
          status: 'Missed'
        }
      );

      const [DbPayment] = await findAll(
        AccessDB,
        CollPayment,
        {
          branch: branchID,
          clientId: getOrder.clientId
        },
        {},
        { _id: -1 }
      );

      const balanceCount =
        DbPayment.balance > getOrder.balance
          ? DbPayment.balance - getOrder.balance
          : getOrder.balance - DbPayment.balance;

      const NewPayment = {
        discount: 0,
        branch: branchID,
        balance: balanceCount,
        typePaid: 0,
        total: balanceCount,
        OrderId: getOrder._id,
        paidAmount: 0,
        oldBalance: 0,
        orderAmount: 0,
        status: 'Re-correct',
        Date: new Date().toString(),
        clientId: DbPayment.clientId
      };
      await insertOneData(AccessDB, CollPayment, NewPayment);
    }
    res.sendStatus(200);
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
