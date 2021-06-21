const express = require('express');
const { ObjectID } = require('mongodb');
const {
  Aggregate,
  findWithKey,
  findAll,
  insertMany
  // updateMany,
  // DeleteMany
} = require('@models/comanQuery');
const { MultiKeyJoinObj, GroupAggre } = require('@models/GenerateAggre');

const router = express.Router();

const ClientColl = 'Clients';
// const StockColl = 'Stocks';
// const PriceColl = 'PriceList';
// const InvItem = 'InventoryItems';
const AcountColl = 'Acounts';
// const InvCateg = 'ItemsCategory';
const EntryColl = 'EntryBook';

const AccJoinKey = [{ locale: 'Account', foreignKey: '_id' }];

// Get All Inventory list

router.get('/', (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;
    const clientJoinKey = [{ locale: 'Description', foreignKey: '_id' }];

    const groupObj = {
      // Account: '$Account',
      Description: '$Description'
      //   branch: '$branch'
    };
    const ComputeGroup = {
      Amount: { $sum: '$Amount' }
    };
    const groupProj = {
      $project: {
        Description: '$_id.Description',
        Amount: 1,
        _id: 0
      }
    };

    findWithKey(AccessDB, AcountColl, {
      AccountName: 'Sales Receivable',
      branch: ObjectID(branchID)
    })
      .then(({ _id }) => {
        // console.log(clienKey);
        const match = {
          $match: {
            Account: _id,
            branch: ObjectID(branchID)
          }
        };

        const JornalAggArray = [
          match,
          ...GroupAggre(groupObj, ComputeGroup, groupProj),
          ...MultiKeyJoinObj({
            collection: ClientColl,
            joinkeys: clientJoinKey,
            project: { Name: 1, phone: 1 },
            marge: true
          }),
          { $sort: { Amount: -1 } },
          {
            $project: { [ClientColl]: 0, _id: 0 }
          }
        ];
        // console.log(AggArray);
        Aggregate(AccessDB, EntryColl, JornalAggArray)
          .then(debtors => {
            // console.log(debtors.length);
            // let Clients = debtors.map(({ Description }, index) => {
            //   return {
            //     _id: Description,
            //     Name: `Name ${index + 1}`,
            //     phone: `phone ${index + 1}`,
            //     RegBranch: ObjectID(branchID)
            //   }
            // })
            // insertMany(AccessDB, ClientColl, Clients)
            // updateMany(AccessDB, ClientColl, { RegBranch: ObjectID(branchID) }, { date: "2020-12-25" })
            // console.log(branchID)
            res.send(debtors);
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

router.get('/alldebts', (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;

    // console.log(req.query);
    const { Description } = req.query;

    const groupObj = {
      Account: '$Account',
      Details: '$Details',
      info: '$info',
      date: '$date'
    };
    const ComputeGroup = {
      Amount: { $sum: '$Amount' }
    };
    const groupProj = {
      $project: {
        // AccountName: '$_id.AccountName',
        Account: '$_id.Account',
        Details: '$_id.Details',
        info: '$_id.info',
        date: '$_id.date',
        Amount: 1,
        _id: 0
      }
    };

    const AccKey = {
      // $or: [{ AccountName: 'Goods Sold' }, { AccountName: 'Cost of Goods' }]
      branch: ObjectID(branchID),
      $or: [
        { AccountName: 'Sales' },
        { AccountName: 'Sales Discount' },
        { AccountName: 'Sales Receivable' }
      ]
    };

    findAll(AccessDB, AcountColl, AccKey)
      .then(account => {
        // console.log(account);
        const match = {
          $match: {
            $or: account.map(({ _id }) => {
              return { Account: _id };
            }),
            Description: ObjectID(Description),
            branch: ObjectID(branchID)
          }
        };

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
            project: { AccountName: 1, _id: 0 },
            marge: true
          }),

          { $sort: { Details: -1 } },
          {
            $project: {
              date: 1,
              Details: 1,
              AccountName: 1,
              Amount: 1,
              info: 1
            }
          }
        ];

        Aggregate(AccessDB, EntryColl, JornalAggArray)
          .then(debtors => {
            // console.log(debtors);
            let val = debtors.reduce((result, debtor) => {
              // if (!result[debtor.Details])
              //   result[debtor.Details] = { costs: [] };
              // if (debtor.info) console.log(debtor);
              result[debtor.Details] = [
                ...(result[debtor.Details] || []),
                {
                  AccountName: debtor.AccountName,
                  Amount: debtor.Amount,
                  date: debtor.date
                }
              ];
              return result;
            }, {});

            let result = Object.keys(val).reduce((result, order) => {
              let canReturn = val[order].some(
                acc => acc.AccountName == 'Sales Receivable'
              );
              if (canReturn) result[order] = val[order];
              return result;
            }, {});
            // console.log(val);
            // console.log('--------------------------------------------');
            // console.log(result);
            res.send(result);
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

router.post('/payment', (req, res) => {
  // console.log(req.body);
  let { AccessDB, branchID, UserName, CashBase } = req.headers.user;
  const groupObj = {
    Details: '$Details'
  };
  const ComputeGroup = {
    Amount: { $sum: '$Amount' }
  };
  const groupProj = {
    $project: {
      Details: '$_id.Details',
      Amount: 1,
      _id: 0
    }
  };

  let {
    Description,
    Amount,
    date,
    time,
    Details,
    BankRef,
    cashType
  } = req.body;
  const Ref = 'REP-' + Date.now();
  const AccArray = [
    { AccountName: 'Sales Receivable' },
    { AccountName: cashType }
  ];
  findAll(AccessDB, AcountColl, {
    $or: AccArray,
    branch: ObjectID(branchID)
  }).then(acc => {
    let match = {
      $match: {
        Account: acc.find(den => den.AccountName == 'Sales Receivable')._id,
        Description: ObjectID(Description),
        branch: ObjectID(branchID)
      }
    };
    let JornalAggArray = [
      match,
      ...GroupAggre(groupObj, ComputeGroup, groupProj),
      { $sort: { Details: 1 } },
      {
        $match: {
          Amount: { $gt: 0 }
        }
      }
    ];
    Aggregate(AccessDB, EntryColl, JornalAggArray).then(debts => {
      // console.log(debts);
      // res.sendStatus(500);
      // return;

      const TranArray = [
        {
          User: UserName,
          Account: ObjectID(acc.find(cash => cash.AccountName == cashType)._id),
          Amount: parseFloat(Amount),
          AmountType: CashBase,
          Description: ObjectID(Description),
          Details,
          date,
          time,
          Acc: 'Dr',
          Ref,
          branch: ObjectID(branchID),
          CashRef: BankRef
        }
      ];
      // return;
      let PaidAmount = Amount;
      let index = 0;
      while (PaidAmount > 0 && debts.length > index) {
        let balnce = debts[index].Amount;
        if (PaidAmount <= balnce) {
          TranArray.push({
            User: UserName,
            Account: ObjectID(
              acc.find(cash => cash.AccountName == 'Sales Receivable')._id
            ),
            Amount: -parseFloat(PaidAmount),
            AmountType: CashBase,
            Description: ObjectID(Description),
            Details: debts[index].Details,
            date,
            time,
            Acc: 'Cr',
            Ref,
            branch: ObjectID(branchID)
          });

          PaidAmount -= PaidAmount;
        } else {
          TranArray.push({
            User: UserName,
            Account: ObjectID(
              acc.find(cash => cash.AccountName == 'Sales Receivable')._id
            ),
            Amount: -parseFloat(debts[index].Amount),
            AmountType: CashBase,
            Description: ObjectID(Description),
            Details: debts[index].Details,
            date,
            time,
            Acc: 'Cr',
            Ref,
            branch: ObjectID(branchID)
          });

          PaidAmount -= debts[index].Amount;
        }
        index++;
      }
      // console.log(TranArray);
      insertMany(AccessDB, EntryColl, TranArray).then(() => {
        res.sendStatus(201);
        // console.log(Ref);
      });
    });
  });
  // res.sendStatus(500);
});
router.post('/Depositpayment', (req, res) => {
  // console.log(req.body);
  let { AccessDB, branchID, UserName, CashBase, code } = req.headers.user;

  const groupObj = {
    Details: '$Details'
  };
  const ComputeGroup = {
    Amount: { $sum: '$Amount' }
  };
  const groupProj = {
    $project: {
      Details: '$_id.Details',
      Amount: 1,
      _id: 0
    }
  };

  let {
    Description,
    Amount,
    date,
    time,
    Details,
    BankRef,
    cashType
  } = req.body;
  const Ref = 'REP-' + Date.now();
  const AccArray = [
    { AccountName: 'Sales Receivable' },
    { AccountName: cashType }
  ];
  findAll(AccessDB, AcountColl, {
    $or: AccArray,
    branch: ObjectID(branchID)
  }).then(acc => {
    let match = {
      $match: {
        Account: acc.find(den => den.AccountName == 'Sales Receivable')._id,
        Description: ObjectID(Description),
        branch: ObjectID(branchID)
      }
    };
    let JornalAggArray = [
      match,
      ...GroupAggre(groupObj, ComputeGroup, groupProj),
      { $sort: { Details: 1 } },
      {
        $match: {
          Amount: { $gt: 0 }
        }
      }
    ];
    Aggregate(AccessDB, EntryColl, JornalAggArray).then(debts => {
      // console.log(debts);
      // res.sendStatus(500);
      // return;

      const TranArray = [
        {
          User: UserName,
          Account: ObjectID(acc.find(cash => cash.AccountName == cashType)._id),
          Amount: parseFloat(Amount),
          AmountType: CashBase,
          Description: ObjectID(Description),
          Details,
          date,
          time,
          Acc: 'Dr',
          Ref,
          branch: ObjectID(branchID),
          CashRef: BankRef
        }
      ];
      // return;
      let PaidAmount = Amount;
      let index = 0;
      let AccountID = acc.find(cash => cash.AccountName == 'Sales Receivable')
        ._id;
      while (PaidAmount > 0 && debts.length > index) {
        let balnce = debts[index].Amount;
        if (PaidAmount <= balnce) {
          TranArray.push({
            User: UserName,
            Account: ObjectID(AccountID),
            Amount: -parseFloat(PaidAmount),
            AmountType: CashBase,
            Description: ObjectID(Description),
            Details: debts[index].Details,
            date,
            time,
            Acc: 'Cr',
            Ref,
            branch: ObjectID(branchID)
          });

          PaidAmount -= PaidAmount;
        } else {
          TranArray.push({
            User: UserName,
            Account: ObjectID(AccountID),
            Amount: -parseFloat(debts[index].Amount),
            AmountType: CashBase,
            Description: ObjectID(Description),
            Details: debts[index].Details,
            date,
            time,
            Acc: 'Cr',
            Ref,
            branch: ObjectID(branchID)
          });

          PaidAmount -= debts[index].Amount;
        }
        index++;
      }
      if (PaidAmount > 0) {
        TranArray.push({
          User: UserName,
          Account: ObjectID(AccountID),
          Amount: -parseFloat(PaidAmount),
          AmountType: CashBase,
          Description: ObjectID(Description),
          Details: code + '-AAA',
          date,
          time,
          Acc: 'Cr',
          Ref,
          branch: ObjectID(branchID)
        });

        PaidAmount -= PaidAmount;
      }
      // console.log(TranArray);
      // res.sendStatus(500);
      insertMany(AccessDB, EntryColl, TranArray).then(() => {
        res.sendStatus(201);
        console.log(Ref);
      });
    });
  });
  // res.sendStatus(500);
});

module.exports = router;

// [
//     { AccountName: 'Sales' },
//     { AccountName: 'Sales Discount' },
//     { AccountName: 'Sales Receivable' },
//     { AccountName: 'Goods Sold' },
//     { AccountName: 'Cost of Goods' },
//     { AccountName: cashType }
//   ]
