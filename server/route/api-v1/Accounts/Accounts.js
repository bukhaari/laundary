const express = require('express');
const {
  findAll,
  insertOne,
  findWithKey /* Aggregate */
} = require('@models/comanQuery');
const { AccountBalance } = require('@models/qarashQuery');

const { ObjectID } = require('mongodb');
const router = express.Router();

const AccountColl = 'Acounts';

const { verifyToken } = require('@auth');
router.use(verifyToken);

router.post(`/`, (req, res) => {
  // console.log(req.body);
  let { AccessDB, branchID } = req.headers.user;

  let key = {
    AccountName: new RegExp(`^${req.body.AccountName}$`, 'i'),
    branch: branchID ? ObjectID(branchID) : 'company'
  };
  findWithKey(AccessDB, AccountColl, key).then(val => {
    if (val) {
      res
        .status(409)
        .send(
          `Account <span class="error--text">${req.body.AccountName}</span> is already created`
        );
      return;
    }

    insertOne(AccessDB, AccountColl, {
      ...req.body,
      branch: ObjectID(branchID)
    })
      .then(() => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
  //   res.sendStatus(500);
  //   return;
});

router.get(`/`, (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;

    const AccKey = {
      $or: req.query.acc.map(item => JSON.parse(item)),
      branch: branchID ? ObjectID(branchID) : 'company'
    };
    findAll(AccessDB, AccountColl, AccKey)
      .then(doc => {
        res.send(doc);
        // console.log(doc);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.get(`/checkBalance`, (req, res) => {
  try {
    const { AccessDB, branchID, CashBase } = req.headers.user;
    const { Account, from, to, cashType } = req.query;
    let CashType = cashType || CashBase

    AccountBalance(
      AccessDB,
      ObjectID(Account),
      null,
      from,
      to,
      CashType,
      branchID
    )
      .then(doc => {
        res.send(doc);
        // console.log(doc);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

module.exports = router;
