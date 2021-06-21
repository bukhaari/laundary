const express = require('express');
const {
  findAll,
  findWithKey,
  insertMany,
  updateMany
} = require('@models/comanQuery');

const { AccountBalance } = require('@models/qarashQuery');

const fixedRoute = require('./fixed');
const { ObjectID } = require('mongodb');

const router = express.Router();

const { verifyToken } = require('@auth');
router.use(verifyToken);

const AccountColl = 'Acounts';
const EntryColl = 'EntryBook';

router.get(`/`, (req, res) => {
  const { AccessDB, branchID } = req.headers.user;

  //   console.log('req query', req.query);

  const { fixed } = req.query;

  const AccKey = {
    AccountType: fixed ? 8 : 14,
    branch: branchID ? ObjectID(branchID) : 'company'
  };
  findAll(AccessDB, AccountColl, AccKey)
    .then(doc => {
      res.send(doc);
      //   console.log(doc);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

router.post('/', (req, res) => {
  // console.log(req.body);
  // res.sendStatus(500);

  const { AccessDB, branchID, CashBase, UserName } = req.headers.user;
  const { expenseType, Amount, Details, date } = req.body;

  const AccKey = {
    AccountName: 'Cash',
    branch: branchID ? ObjectID(branchID) : 'company'
  };

  findWithKey(AccessDB, AccountColl, AccKey).then(({ _id }) => {
    AccountBalance(AccessDB, _id, null, null, null, CashBase, branchID).then(
      ([{ Amount: blce }]) => {
        // console.log(blce);
        if (!blce || blce < Amount) {
          res.status(403).send('your Cash Balance is not enough');
          return;
        }
        // res.status(500).send('passed');
        let Ref = 'Exp-' + Date.now();
        let tranArray = [
          {
            User: UserName,
            Account: _id,
            Amount: -Amount,
            AmountType: CashBase,
            Description: `${expenseType.AccountName}`,
            Details,
            date,
            time: null,
            Acc: 'Cr',
            Ref,
            branch: AccKey.branch
          },
          {
            User: UserName,
            Account: ObjectID(expenseType._id),
            Amount: Amount,
            AmountType: CashBase,
            Description: `${expenseType.AccountName}`,
            Details,
            date,
            time: null,
            Acc: 'Dr',
            Ref,
            branch: AccKey.branch
          }
        ];
        insertMany(AccessDB, EntryColl, tranArray).then(() => {
          res.sendStatus(201);
        });
      }
    );
  });
});

router.put('/Editedate', (req, res) => {
  // console.log(req.body);

  const { AccessDB, branchID } = req.headers.user;

  let { Ref, Details, date } = req.body;

  let UpdateKey = { Ref, branch: ObjectID(branchID) };
  updateMany(AccessDB, EntryColl, UpdateKey, { Details, date }).then(() => {
    res.sendStatus(200);
  });
  // res.sendStatus(500);
});

router.use('/fixed', fixedRoute);

module.exports = router;
