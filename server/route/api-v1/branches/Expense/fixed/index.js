const express = require('express');
const Joi = require('@hapi/joi');

const { ObjectID } = require('mongodb');
const {
  findAll,
  Aggregate,
  insertOne,
  updateOne,
  insertMany
} = require('@models/comanQuery');

const { GroupAggre, MultiKeyJoinObj } = require('@models/GenerateAggre');

const { AccountBalance } = require('@models/qarashQuery');
const { Withdraw } = require('@models/Accountant');
const router = express.Router();

const CashKey = {
  $or: [{ AccountType: 1 }, { AccountType: 3 }],
  branch: 'company'
};

const FixedExpColl = 'FixedExpense';
const AccountColl = 'Acounts';
const EntryColl = 'EntryBook';

router.get(`/`, (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  const FixedJoinKey = [{ locale: 'expenseType', foreignKey: '_id' }];
  let AggreArray = [
    {
      $match: {
        Active: 1,
        branch: branchID ? ObjectID(branchID) : 'company'
      }
    },
    ...MultiKeyJoinObj({
      collection: AccountColl,
      joinkeys: FixedJoinKey,
      project: { _id: 0, expense: '$AccountName' },
      marge: true
    }),
    {
      $project: {
        [AccountColl]: 0
      }
    }
  ];
  // console.log(req.query);

  Aggregate(AccessDB, FixedExpColl, AggreArray)
    .then(doc => {
      // console.log(doc);
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

router.get(`/transactions`, (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  // console.log(req.query);
  let { _id, from, to } = req.query;

  if (branchID) CashKey.branch = ObjectID(branchID);

  findAll(AccessDB, AccountColl, CashKey)
    .then(cashes => {
      //  console.log(cashes);
      let match = {
        $or: cashes.map(({ _id }) => ({ Account: _id })),
        Description: ObjectID(_id),
        branch: CashKey.branch
      };
      if (from && !to) match.date = { $gte: from };
      else if (from && to) match.date = { $gte: from, $lte: to };
      else if (!from && to) match.date = { $lte: to };

      findAll(AccessDB, EntryColl, match).then(tran => {
        // console.log(tran)
        res.send(tran);
      });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

router.get(`/balance`, (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  // console.log(req.query);
  let { _id, from, to } = req.query;

  if (branchID) CashKey.branch = ObjectID(branchID);

  findAll(AccessDB, AccountColl, CashKey)
    .then(cashes => {
      //  console.log(cashes);
      let match = {
        $or: cashes.map(({ _id }) => ({ Account: _id })),
        Description: ObjectID(_id),
        branch: CashKey.branch
      };
      if (from && !to) match.date = { $gte: from };
      else if (from && to) match.date = { $gte: from, $lte: to };
      else if (!from && to) match.date = { $lte: to };

      const groupObj = {
        AmountType: '$AmountType'
        //   branch: '$branch'
      };
      const ComputeGroup = {
        Amount: { $sum: '$Amount' }
      };
      const groupProj = {
        $project: {
          AmountType: '$_id.AmountType',

          Amount: 1,
          _id: 0
        }
      };

      const AggreArray = [
        {
          $match: match
        },
        ...GroupAggre(groupObj, ComputeGroup, groupProj)
      ];

      Aggregate(AccessDB, EntryColl, AggreArray).then(tran => {
        // console.log(tran)
        res.send(tran);
      });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

router.post('/', (req, res) => {
  // console.log(req.body);
  const { error } = ExpenseSchema(req.body);
  if (error) {
    // console.log(error);

    res.status(400).send(error.details[0].message);
    return;
  }
  const { AccessDB, branchID, CashBase } = req.headers.user;
  const ExpenInfo = {
    ...req.body,
    CashBase,
    expenseType: ObjectID(req.body.expenseType),
    Active: 1,
    branch: branchID ? ObjectID(branchID) : 'company'
  };
  insertOne(AccessDB, FixedExpColl, ExpenInfo).then(() => {
    res.sendStatus(201);
  });

  // res.sendStatus(500);
});

router.put('/', (req, res) => {
  try {
    const { error } = UpdateExpenseSchema(req.body);
    if (error) {
      // console.log(error);

      res.status(400).send(error.details[0].message);
      return;
    }
    const { AccessDB, branchID } = req.headers.user;
    const { ID, ...updateInfo } = req.body;
    let Checkkey = {
      // CostName: new RegExp(`^${req.body.SuppName}$`, 'i'),
      _id: ObjectID(ID),
      branch: branchID ? ObjectID(branchID) : 'company'
    };

    updateOne(AccessDB, FixedExpColl, Checkkey, {
      ...updateInfo,
      expenseType: ObjectID(req.body.expenseType)
    }).then(() => {
      res.sendStatus(201);
      // console.log(v);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
  // console.log(req.body);

  // res.sendStatus(500);
});

router.post('/payment', (req, res) => {
  try {
    const { error } = PaymentSchema(req.body);
    if (error) {
      // console.log(error);

      res.status(400).send(error.details[0].message);
      return;
    }
    const { AccessDB, branchID, CashBase, UserName } = req.headers.user;
    const { Account, Description, Amount, Details, date, time } = req.body;
    // console.log(req.body);
    const AccKey = {
      $or: [
        { AccountName: 'Payable Expense' },
        { AccountName: 'Advanced Eexpense' }
      ],
      branch: branchID ? ObjectID(branchID) : 'company'
    };
    findAll(AccessDB, AccountColl, AccKey)
      .then(acc => {
        AccountBalance(
          AccessDB,
          acc.find(a => a.AccountName == 'Payable Expense')._id,
          ObjectID(Description),
          null,
          null,
          CashBase,
          branchID
        )
          .then(doc => {
            // res.send(doc);
            // console.log(doc);
            const TranRef = 'Exp-' + Date.now();
            Withdraw(
              UserName,
              doc,
              Amount,
              CashBase,
              ObjectID(Description),
              Details,
              date,
              time,
              ObjectID(Account),
              acc.find(a => a.AccountName == 'Payable Expense')._id,
              acc.find(a => a.AccountName == 'Advanced Eexpense')._id,
              AccKey.branch,
              TranRef
            )
              .then(tran => {
                // console.log(tran);
                // res.sendStatus(500);
                // return;
                insertMany(AccessDB, EntryColl, tran).then(() => {
                  res.sendStatus(201);
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).send(err);
              });
          })
          .catch(err => {
            console.log(err);
            res.status(500).send(err);
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });

    // res.sendStatus(500);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

function ExpenseSchema(customInfo) {
  const schema = Joi.object({
    expensName: Joi.string().required(),
    contact: Joi.string().required(),
    IDNomber: Joi.string().required(),
    date: Joi.string().required(),
    expenseType: Joi.string().required(),
    Amount: Joi.number().required()
  });

  return schema.validate(customInfo);
}
function UpdateExpenseSchema(customInfo) {
  const schema = Joi.object({
    ID: Joi.string().required(),
    expensName: Joi.string().required(),
    contact: Joi.string().required(),
    IDNomber: Joi.string().required(),
    expenseType: Joi.string().required(),
    Amount: Joi.number().required()
  });

  return schema.validate(customInfo);
}
function PaymentSchema(customInfo) {
  const schema = Joi.object({
    Account: Joi.string().required(),
    Description: Joi.string().required(),
    Details: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    Amount: Joi.number().required()
  });

  return schema.validate(customInfo);
}
module.exports = router;
