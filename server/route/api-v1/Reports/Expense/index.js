const express = require('express');

const {
  Aggregate,
  findAll
  //   insertMany
} = require('@models/comanQuery');
const { MultiKeyJoinObj, GroupAggre } = require('@models/GenerateAggre');
const { ObjectID } = require('mongodb');
const router = express.Router();

// const ClientColl = 'Clients';
const AcountColl = 'Acounts';
const EntryColl = 'EntryBook';
// const StockCostsColl = 'StockCosts';
const FixedExpColl = 'FixedExpense';

const AccJoinKey = [{ locale: 'Account', foreignKey: '_id' }];

router.get('/', (req, res) => {
  try {
    const { AccessDB, branchID, CashBase } = req.headers.user;
    // console.log(req.query);

    const { from, to } = req.query;
    const AccKey = {
      $or: [{ AccountType: 8 }, { AccountType: 14 }],
      branch: branchID ? ObjectID(branchID) : 'company'
    };
    const groupObj = {
      Account: '$Account',
      AmountType: '$AmountType'
      //   branch: '$branch'
    };
    const ComputeGroup = {
      Amount: { $sum: '$Amount' }
    };
    const groupProj = {
      $project: {
        AmountType: '$_id.AmountType',
        Account: '$_id.Account',
        Amount: 1,
        _id: 0
      }
    };
    findAll(AccessDB, AcountColl, AccKey).then(expens => {
      const match = {
        $match: {
          branch: ObjectID(branchID),
          $or: expens.map(({ _id }) => {
            return { Account: _id };
          })
        }
      };

      if (from && !to) match.$match.date = { $gte: from };
      else if (from && to) match.$match.date = { $gte: from, $lte: to };
      else if (!from && to) match.$match.date = { $lt: to };

      const AggreArray = [
        match,
        ...GroupAggre(groupObj, ComputeGroup, groupProj),
        ...MultiKeyJoinObj({
          collection: AcountColl,
          joinkeys: AccJoinKey,
          project: { AccountName: 1, AccountType: 1 },
          marge: true
        }),
        { $sort: { Amount: -1 } },
        {
          $project: { [AcountColl]: 0 }
        }
      ];

      Aggregate(AccessDB, EntryColl, AggreArray).then(val => {
        let GroupBy = val.reduce(
          (group, exp) => {
            // let [fixed,Variable] = group;
            // console.log(exp.AccountType);
            if (exp.AccountType == 8) group[0].Amount += exp.Amount;
            else if (exp.AccountType == 14) group[1].Amount += exp.Amount;
            return group;
          },
          [
            {
              AccountName: 'Fixed',
              Amount: 0,
              AmountType: CashBase
            },
            {
              AccountName: 'Variable',
              Amount: 0,
              AmountType: CashBase
            }
          ]
        );
        // console.log(GroupBy);
        res.send({
          expense: val.map(item => ({
            ...item,
            type: item.AccountType == 8 ? 'Fixed Expense' : 'Daily Expense'
          })),
          Group: GroupBy
        });
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.get('/transactions', (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;
    // console.log(req.query);

    const { Account, from, to } = req.query;

    const match = {
      $match: {
        branch: branchID ? ObjectID(branchID) : 'company',
        Account: ObjectID(Account)
        //   $or: expens.map(({ _id }) => {
        //     return { Account: _id };
        //   })
      }
    };

    if (from && !to) match.$match.date = { $gte: from };
    else if (from && to) match.$match.date = { $gte: from, $lte: to };
    else if (!from && to) match.$match.date = { $lt: to };

    let ExpJoinkey = [{ locale: 'Description', foreignKey: '_id' }];

    const AggreArray = [
      match,
      // ...GroupAggre(groupObj, ComputeGroup, groupProj),
      ...MultiKeyJoinObj({
        collection: FixedExpColl,
        joinkeys: ExpJoinkey,
        project: { expensName: 1 },
        marge: true
      }),
      { $sort: { date: -1 } },
      {
        $project: { [FixedExpColl]: 0 }
      }
    ];

    Aggregate(AccessDB, EntryColl, AggreArray).then(val => {
      // console.log(val);
      res.send(
        val.map(item => {
          if (!item.expensName) item.expensName = item.Description;
          return item;
        })
      );
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.get('/daily', (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;
    // console.log(req.query);

    const { from, to } = req.query;
    const AccKey = {
      // $or: [{ AccountType: 8 }, { AccountType: 14 }],
      AccountType: 14,
      branch: branchID ? ObjectID(branchID) : 'company'
    };

    findAll(AccessDB, AcountColl, AccKey).then(acc => {
      // console.log
      const match = {
        $match: {
          branch: branchID ? ObjectID(branchID) : 'company',
          // Account: ObjectID(Account)
          $or: acc.map(({ _id }) => {
            return { Account: _id };
          })
        }
      };

      if (from && !to) match.$match.date = { $gte: from };
      else if (from && to) match.$match.date = { $gte: from, $lte: to };
      else if (!from && to) match.$match.date = { $lt: to };

      // let ExpJoinkey = [{ locale: 'Description', foreignKey: '_id' }];

      const AggreArray = [
        match,
        // ...GroupAggre(groupObj, ComputeGroup, groupProj),
        // ...MultiKeyJoinObj({
        //   collection: FixedExpColl,
        //   joinkeys: ExpJoinkey,
        //   project: { expensName: 1 },
        //   marge: true
        // }),
        { $sort: { date: -1 } }
        // {
        //   $project: { [FixedExpColl]: 0 }
        // }
      ];

      Aggregate(AccessDB, EntryColl, AggreArray).then(val => {
        // console.log(val);
        res.send(val);
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.get(`/balance`, (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  // console.log(req.query);
  let { Account, from, to } = req.query;

  //  console.log(cashes);
  let match = {
    Account: ObjectID(Account),
    branch: branchID ? ObjectID(branchID) : 'company'
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
      //   Account: '$_id.Account',
      Amount: 1,
      _id: 0
    }
  };

  let AggreArray = [
    {
      $match: match
    },
    ...GroupAggre(groupObj, ComputeGroup, groupProj)
  ];

  Aggregate(AccessDB, EntryColl, AggreArray)
    .then(tran => {
      //   console.log(tran);
      res.send(tran);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;

// [
//     { AccountName: 'Sales' },
//     { AccountName: 'Sales Receivable' },
//     { AccountName: 'Sales Discount' },
//     { AccountName: 'Goods Sold' },
//     { AccountName: 'Cost of Goods' },
//     { AccountName: cashType }
//   ]
