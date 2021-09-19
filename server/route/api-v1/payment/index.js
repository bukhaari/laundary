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
  findOneAndUpdateData,
  updateOne
} = require('../../../models/Query/comanQuery');

router.use(verifyToken);

//Collection Names
const CollOrder = 'OrdersList';
const CollClient = 'Client';
const CollPayment = 'Payment';

router.put('/', async (req, res) => {
  // console.log('req.body:', req.body);
  try {
    const { AccessDB, branchID } = req.headers.user;

    const { paidAmount, typePaid, discount, orderId } = req.body;

    const getOrder = await findOneData(AccessDB, CollOrder, {
      branch: branchID,
      _id: ObjectID(orderId)
    });

    if (paidAmount >= getOrder.balance && getOrder) {
      await updateOne(
        AccessDB,
        CollOrder,
        { branch: branchID, _id: getOrder._id },
        {
          balance: 0
        }
      );
    }

    if (paidAmount < getOrder.balance && getOrder) {
      await updateOne(
        AccessDB,
        CollOrder,
        { branch: branchID, _id: getOrder._id },
        {
          balance: getOrder.balance - paidAmount
        }
      );
    }

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

    // if pays all debts, balance will be equal to zero
    // if (
    //   paidAmount > getOrder.balance &&
    //   paidAmount < DbPayment.balance &&
    //   DbPayment
    // ) {
    //   await updateMany(
    //     AccessDB,
    //     CollPayment,
    //     { branch: branchID, clientId: DbPayment.clientId },
    //     {
    //       balance: DbPayment.balance - paidAmount,
    //       status: 'Payment'
    //     }
    //   );
    // }

    const NewPayment = {
      discount: discount,
      branch: branchID,
      balance: DbPayment.balance - paidAmount - discount,
      typePaid: typePaid,
      total: DbPayment.balance - discount,
      OrderId: getOrder._id,
      paidAmount: paidAmount,
      oldBalance: DbPayment.balance,
      orderAmount: 0,
      status: 'correct',
      Date: new Date().toString(),
      clientId: DbPayment.clientId
    };
    await insertOneData(AccessDB, CollPayment, NewPayment);
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
