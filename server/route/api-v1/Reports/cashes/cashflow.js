const express = require('express');
const { ObjectID } = require('mongodb');
const { CaptalDeposit } = require('@models/Accountant');
const Joi = require('@hapi/joi');
const fs = require('fs');
const {
  Aggregate,
  findAll,
  findWithKey,
  insertMany
} = require('@models/comanQuery');
const { MultiKeyJoinObj, GroupAggre } = require('@models/GenerateAggre');
const router = express.Router();

// const Accounts = require('./Accounts')

const ClientColl = 'Clients';
const AcountColl = 'Acounts';
const EntryColl = 'EntryBook';
const StockCostsColl = 'StockCosts';
const FixedExpColl = 'FixedExpense';

const AccJoinKey = [{ locale: 'Account', foreignKey: '_id' }];

// Get All Inventory list
router.get(`/`, (req, res) => {
  try {
    const AccJoinKey2 = [{ locale: 'Description', foreignKey: '_id' }];
    const { from, to } = req.query;

    // console.log('called');
    const { AccessDB, branchID } = req.headers.user;

    // PayableExpense({ DB: AccessDB, BR: branchID, code: req.headers.user.code });

    // console.log(req.headers.user);
    // const { updateMany } = require('@models/comanQuery');
    // let UpdateKey = {
    //   // Ref: RegExp('^qas-'),
    //   Ref: 'TRN-1610882645091',
    //   date: '2021-01-02',
    //   branch: ObjectID(branchID)
    // };
    // updateMany(AccessDB, EntryColl, UpdateKey, { date: '2021-01-03' }).then(
    //   () => {
    //     console.log('Updated');
    //   }
    // );

    const clienKey = [{ locale: 'Description', foreignKey: '_id' }];

    const Acc_key = {
      branch: ObjectID(branchID),
      $or: [
        { AccountName: 'Mobile' },
        { AccountName: 'Cash' },
        { AccountName: 'Main Bank' }
      ]
    };

    findAll(AccessDB, AcountColl, Acc_key)
      .then(account => {
        const match = {
          $match: {
            $or: account.map(({ _id }) => {
              return { Account: _id };
            }),

            // Ref: RegExp('^CHR'),
            branch: ObjectID(branchID),
            Ref: { $not: new RegExp('^CHR') }
          }
        };
        if (from && !to) match.$match.date = { $gte: from };
        else if (from && to) match.$match.date = { $gte: from, $lte: to };
        else if (!from && to) match.$match.date = { $lt: to };

        // console.log(match.$match);

        const AggArray = [
          match,
          ...MultiKeyJoinObj({
            collection: ClientColl,
            joinkeys: clienKey,
            project: { Name: 1, phone: 1 },
            marge: true
          }),
          ...MultiKeyJoinObj({
            collection: AcountColl,
            joinkeys: AccJoinKey,
            project: { AccountName: 1 },
            marge: true
          }),
          ...MultiKeyJoinObj({
            collection: StockCostsColl,
            joinkeys: AccJoinKey2,
            project: { Name: '$CostName' },
            marge: true
          }),
          ...MultiKeyJoinObj({
            collection: FixedExpColl,
            joinkeys: clienKey,
            project: { Name: '$expensName' },
            marge: true
          }),
          { $sort: { date: -1 } },
          {
            $project: {
              _id: 0,
              Clients: 0,
              [AcountColl]: 0,
              [StockCostsColl]: 0
            }
          }
        ];
        // console.log(AggArray);
        Aggregate(AccessDB, EntryColl, AggArray)
          .then(val => {
            // console.log(val);
            res.send(
              val.map(tran => {
                // console.log(typeof tran.Description);
                if (!tran.Name && typeof tran.Description == 'string')
                  tran.Name = tran.Description;
                return tran;
              }) || []
            );
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  } catch (error) {
    console.log(error);
  }
});

router.get('/balance', (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;
    // console.log(req.query);
    const { from, to, Account } = req.query;

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

    const Acc_key = {
      branch: ObjectID(branchID),
      $or: [
        { AccountName: 'Mobile' },
        { AccountName: 'Cash' },
        { AccountName: 'Main Bank' }
      ]
    };

    if (Account) Acc_key.$or = [{ AccountName: Account }];

    findAll(AccessDB, AcountColl, Acc_key)
      .then(account => {
        // console.log(account);
        const match = {
          $match: {
            branch: ObjectID(branchID),
            $or: account.map(({ _id }) => {
              return { Account: _id };
            })
          }
        };

        if (from && !to) match.$match.date = { $gte: from };
        else if (from && to) match.$match.date = { $gte: from, $lte: to };
        else if (!from && to) match.$match.date = { $lte: to };
        // console.log(match.$match.date);
        const JornalAggArray = [
          match,
          ...GroupAggre(groupObj, ComputeGroup, groupProj),
          {
            $match: {
              Amount: { $ne: 0 }
            }
          },
          ...MultiKeyJoinObj({
            collection: AcountColl,
            joinkeys: AccJoinKey,
            project: { AccountName: 1 },
            marge: true
          }),
          { $sort: { Amount: -1 } },
          {
            $project: { [AcountColl]: 0 }
          }
        ];
        // console.log(AggArray);
        Aggregate(AccessDB, EntryColl, JornalAggArray)
          .then(Entry => {
            // console.log(Entry);
            res.send(Entry);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.post('/DhigidHanti', (req, res) => {
  let { AccessDB, branchID, UserName } = req.headers.user;

  // console.log(req.body);
  let CashDep = req.body.Dhigid;
  const { error } = MoneyDepositSchema(CashDep);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    // CaptalDeposit(
    //   UserName,
    //   AccessDB,
    //   CashDep.Amount,
    //   CashDep.amountType,
    //   CashDep.Details,
    //   CashDep.data,
    //   CashDep.time
    // ).then(val => {
    //   // console.log(val);
    //   insertMany(AccessDB, EntryColl, val)
    //     .then(() => {
    //       res.sendStatus(201);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // });
    let key = {
      branch: branchID ? ObjectID(branchID) : 'company',
      $or: [{ AccountName: 'Cash' }, { AccountName: 'Capital' }]
    };
    // console.log(req.body);
    findAll(AccessDB, AcountColl, key).then(account => {
      CaptalDeposit(
        UserName,
        CashDep.Amount,
        CashDep.amountType,
        'Capital',
        CashDep.Details,
        CashDep.date,
        CashDep.time,
        account.find(val => val.AccountName == 'Cash')._id,
        account.find(val => val.AccountName == 'Capital')._id,
        branchID
      ).then(depost => {
        // console.log(depost);

        insertMany(AccessDB, EntryColl, depost)
          .then(() => {
            res.sendStatus(201);
          })
          .catch(err => {
            throw err;
          });
      });
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/transfer', (req, res) => {
  let { AccessDB, branchID, UserName, CashBase } = req.headers.user;

  // console.log(req.body);

  let CashDep = req.body;
  const { error } = TransferSchema(CashDep);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    let key = {
      branch: branchID ? ObjectID(branchID) : 'company',
      $or: [
        { _id: ObjectID(CashDep.fromAccount) },
        { _id: ObjectID(CashDep.toAccount) }
      ]
    };
    // console.log(req.body);
    findAll(AccessDB, AcountColl, key).then(account => {
      // console.log('====================');
      // console.log(account);
      // console.log('====================');
      let from = account.find(({ _id }) => _id == CashDep.fromAccount);
      let toAcc = account.find(({ _id }) => _id == CashDep.toAccount);
      // console.log(from);
      // console.log(toAcc);
      // res.sendStatus(500);
      // return;
      const Ref = 'TRN-' + Date.now();
      let val = [
        {
          User: UserName,
          Account: ObjectID(CashDep.fromAccount),
          Amount: -parseFloat(CashDep.Amount),
          AmountType: CashBase,
          Description: `Transfer to ${toAcc.AccountName}`,
          Details: CashDep.Details,
          date: CashDep.date,
          time: CashDep.time,
          Acc: 'Cr',
          Ref,
          branch: key.branch
        },
        {
          User: UserName,
          Account: ObjectID(CashDep.toAccount),
          Amount: parseFloat(CashDep.Amount),
          AmountType: CashBase,
          Description: `Transfer from ${from.AccountName}`,
          Details: CashDep.Details,
          date: CashDep.date,
          time: CashDep.time,
          Acc: 'Dr',
          Ref,
          branch: key.branch
        }
      ];

      // console.log(depost);

      insertMany(AccessDB, EntryColl, val)
        .then(() => {
          res.sendStatus(201);
        })
        .catch(err => {
          throw err;
        });
    });
  } catch (error) {
    console.log(error);
  }
});

// router.use('/Account',Accounts)

// eslint-disable-next-line no-unused-vars
function PayableExpense({ DB, BR, code }) {
  // let Payable = { AccountName: 'Payable Expense', branch: ObjectID(BR) };
  let Payable = { AccountName: 'Advanced Eexpense', branch: ObjectID(BR) };

  // eslint-disable-next-line no-unused-vars
  const clienKey = [{ locale: 'Description', foreignKey: '_id' }];

  findWithKey(DB, AcountColl, Payable).then(Acc => {
    findAll(DB, FixedExpColl, { branch: ObjectID(BR) }).then(emp => {
      EmpTrans({
        DB,
        BR,
        listEmp: emp.map(e => ({ Description: e._id }))
      }).then(val => {
        fs.writeFile(`test${code}.json`, JSON.stringify(val, null, 2), err => {
          if (err) {
            console.log('error write');
            return;
          }

          console.log(val.length);
          let test = require(`../../../../../test${code}.json`);
          console.log(test.length);

          // eslint-disable-next-line no-unused-vars
          let InsertedData = test.reduce((TranArr, { _id, ...DelTran }) => {
            TranArr.push({
              ...DelTran,
              // _id: ObjectID(DelTran._id),
              Account: ObjectID(DelTran.Account),
              Description: ObjectID(DelTran.Description),
              branch: ObjectID(DelTran.branch)
            });
            TranArr.push({
              ...DelTran,
              // _id: ObjectID(DelTran._id),
              Account: ObjectID(Acc._id),
              Amount: Math.abs(DelTran.Amount),
              Description: ObjectID(DelTran.Description),
              branch: ObjectID(DelTran.branch)
            });
            return TranArr;
          }, []);
          // console.log(InsertedData);

          let DelKey = {
            $or: test.map(tr => ({ Ref: tr.Ref })),
            branch: ObjectID(BR)
          };
          const { DeleteMany } = require('@models/comanQuery');
          DeleteMany(DB, EntryColl, DelKey).then(() => {
            console.log('Deleted');

            insertMany(DB, EntryColl, InsertedData).then(() => {
              console.log('Inserted => ' + InsertedData.length);
            });
          });
        });
        // console.log();
      });
    });

    return;
    // const groupObj = {
    //   Account: '$Account',
    //   Description: '$Description'
    //   //   branch: '$branch'
    // };
    // const ComputeGroup = {
    //   Amount: { $sum: '$Amount' }
    // };
    // const groupProj = {
    //   $project: {
    //     Description: '$_id.Description',
    //     Account: '$_id.Account',
    //     Amount: 1,
    //     _id: 0
    //   }
    // };
    // const AggArray = [
    //   {
    //     $match: {
    //       // Description: ObjectID('5ff96256d87535001774762b'),
    //       Account: Acc._id,
    //       branch: Payable.branch
    //     }
    //   },
    //   ...GroupAggre(groupObj, ComputeGroup, groupProj),
    //   ...MultiKeyJoinObj({
    //     collection: FixedExpColl,
    //     joinkeys: clienKey,
    //     project: { expensName: 1, _id: 0 },
    //     marge: true
    //   }),

    //   { $sort: { date: -1 } },
    //   {
    //     $project: {
    //       _id: 0,
    //       [FixedExpColl]: 0
    //     }
    //   }
    // ];
    // // console.log(val);
    // Aggregate(DB, EntryColl, AggArray).then(payple => {
    //   console.log(payple);
    //   console.log('--------------------------------');
    //   console.log(payple.length);
    // });
  });
}

// eslint-disable-next-line no-unused-vars
function AdvancedExp({ DB, BR }) {
  let Payable = { AccountName: 'Advanced Eexpense', branch: ObjectID(BR) };

  const clienKey = [{ locale: 'Description', foreignKey: '_id' }];

  const groupObj = {
    Account: '$Account',
    Description: '$Description'
    //   branch: '$branch'
  };
  const ComputeGroup = {
    Amount: { $sum: '$Amount' }
  };
  const groupProj = {
    $project: {
      Description: '$_id.Description',
      Account: '$_id.Account',
      Amount: 1,
      _id: 0
    }
  };

  findWithKey(DB, AcountColl, Payable).then(val => {
    const AggArray = [
      {
        $match: {
          Account: val._id,
          branch: Payable.branch
        }
      },
      ...GroupAggre(groupObj, ComputeGroup, groupProj),
      ...MultiKeyJoinObj({
        collection: FixedExpColl,
        joinkeys: clienKey,
        project: { expensName: 1, _id: 0 },
        marge: true
      }),

      { $sort: { Amount: -1 } },
      {
        $project: {
          _id: 0,
          [FixedExpColl]: 0
        }
      }
    ];
    // console.log(val);
    Aggregate(DB, EntryColl, AggArray).then(payple => {
      console.log(payple);
      console.log('--------------------------------');
      console.log(payple.length);
    });
  });
}

// eslint-disable-next-line no-unused-vars
function EmpTrans({ DB, BR, listEmp }) {
  return new Promise((resolve, reject) => {
    try {
      const CashKey = {
        $or: [{ AccountType: 1 }, { AccountType: 3 }],
        branch: ObjectID(BR)
      };

      findAll(DB, AcountColl, CashKey)
        .then(cashes => {
          //  console.log(cashes);

          let AggreArray = [
            {
              $match: {
                $or: listEmp,
                branch: CashKey.branch
              }
            },
            {
              $match: {
                // Description: ObjectID('600502460dc7923d4f531c5b'),
                $or: cashes.map(({ _id }) => ({ Account: _id }))
                // branch: CashKey.branch
              }
            }
          ];

          Aggregate(DB, EntryColl, AggreArray).then(tran => {
            // console.log(tran)
            resolve(tran);
          });
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function MoneyDepositSchema(EntryData) {
  const schema = Joi.object({
    Amount: Joi.number().required(),
    amountType: Joi.string().required(),
    Details: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required()
  });

  return schema.validate(EntryData);
}
function TransferSchema(EntryData) {
  const schema = Joi.object({
    fromAccount: Joi.string().required(),
    toAccount: Joi.string().required(),
    Details: Joi.string().required(),
    Amount: Joi.number().required(),
    date: Joi.string().required(),
    time: Joi.string().required()
  });

  return schema.validate(EntryData);
}

module.exports = router;

// [
//     { AccountName: 'Sales' },
//     { AccountName: 'Sales Receivable' },
//     { AccountName: 'Sales Discount' },
//     { AccountName: 'Goods Sold' },
//     { AccountName: 'Cost of Goods' },
//     { AccountName: cashType }
//   ]
