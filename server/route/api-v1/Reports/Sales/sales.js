const express = require('express');
const { ObjectID } = require('mongodb');
const { SalesReturn } = require('@models/Accountant');

const {
  Aggregate,
  findWithKey,
  findAll,
  DeleteMany,
  FindDelete,
  updateMany,
  insertMany
} = require('@models/comanQuery');
const { MultiKeyJoinObj, GroupAggre } = require('@models/GenerateAggre');
const router = express.Router();

const ClientColl = 'Clients';
const StockColl = 'Stocks';
const PriceColl = 'PriceList';
const InvItem = 'InventoryItems';
// const InvCateg = 'ItemsCategory';
const AcountColl = 'Acounts';
const EntryColl = 'EntryBook';
const OntheWayColl = 'OnTheWay';
const OrderColl = 'Orders';
const SupplierColl = 'StockCosts';

const AccJoinKey = [{ locale: 'Account', foreignKey: '_id' }];

// Get All Sales list
router.get(`/`, (req, res) => {
  try {
    const { from, to } = req.query;
    // console.log('called');
    const { AccessDB, branchID /* code */ } = req.headers.user;

    const clienKey = [{ locale: 'Description', foreignKey: '_id' }];

    findWithKey(AccessDB, AcountColl, {
      AccountName: 'Sales',
      branch: ObjectID(branchID)
    })
      .then(account => {
        // console.log(clienKey);
        const match = {
          $match: {
            Account: account._id,
            branch: ObjectID(branchID)
          }
        };
        if (from && !to) match.$match.date = { $gte: from };
        else if (from && to) match.$match.date = { $gte: from, $lte: to };
        else if (!from && to) match.$match.date = { $lt: to };

        const groupObj = {
          date: '$date',
          Account: '$Account',
          Details: '$Details',
          Description: '$Description',
          Ref: '$Ref'
          // User: '$User',

          //   branch: '$branch'
        };
        const ComputeGroup = {
          Amount: { $sum: '$Amount' }
        };
        const groupProj = {
          $project: {
            // AccountName: '$_id.AccountName',
            Account: '$_id.Account',
            date: '$_id.date',
            Details: '$_id.Details',
            Description: '$_id.Description',
            Amount: 1,
            Ref: '$_id.Ref',
            _id: 0
            // User: '$_id.User',
          }
        };

        const AggArray = [
          match,
          ...GroupAggre(groupObj, ComputeGroup, groupProj),
          ...MultiKeyJoinObj({
            collection: ClientColl,
            joinkeys: clienKey,
            project: { Name: 1, phone: 1 },
            marge: true
          }),
          { $sort: { Details: -1 } },
          {
            $project: {
              _id: 0,
              Clients: 0
            }
          }
        ];
        // console.log(AggArray);
        Aggregate(AccessDB, EntryColl, AggArray)
          .then(val => {
            // console.log(val);
            res.send(val || []);
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
router.delete('/', (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  // const AccouKey = [{ locale: 'Account', foreignKey: '_id' }];

  // console.log(req.body);
  // res.sendStatus(500);
  // return;
  let { Details, date, Ref } = req.body;
  let DellKey = {
    Details,
    date,
    Ref,
    branch: ObjectID(branchID)
  };
  let DellStockKey = {
    date,
    Ref,
    branch: DellKey.branch,
    Description: Details
  };
  let isTransver = Details.toString().match('=>');
  DeleteMany(AccessDB, EntryColl, DellKey).then(() => {
    DeleteMany(AccessDB, StockColl, DellStockKey).then(() => {
      // console.log(val);
      if (isTransver && Ref.match(new RegExp('^REV', 'i'))) {
        FindDelete(AccessDB, OntheWayColl, { _id: Details }).then(() => {
          //   console.log(val);
          DeleteMany(AccessDB, OrderColl, { OrderCode: Details }).then(() => {
            // console.log(items);
            res.sendStatus(201);
          });
        });
      } else res.sendStatus(201);
    });
  });
  // const AggArray = [
  //   {
  //     $match: {
  //       Details,
  //       Ref: req.body.Ref
  //     }
  //   },
  //   ...MultiKeyJoinObj({
  //     collection: AcountColl,
  //     joinkeys: AccouKey,
  //     project: { AccountName: 1 },
  //     marge: true
  //   }),
  //   { $sort: { Details: -1 } },
  //   {
  //     $project: {
  //       _id: 0,
  //       AccountName: 1,
  //       Amount: 1,
  //       Details: 1,
  //       branch: 1,
  //       Reason: 1,
  //       Ref: 1
  //     }
  //   }
  // ];
  // Aggregate(AccessDB, EntryColl, AggArray).then(val => {
  //   console.log(val.length);
  //   // console.log(val);
  // });
  // res.status(500).send('not alllow to delete this date ' + date);
});

router.get(`/print`, (req, res) => {
  try {
    // console.log('called');
    const { AccessDB, branchID } = req.headers.user;
    const { OrderCode, Description, Ref } = req.query;
    // console.log(req.query);
    let StockGroup = {
      group: {
        code: '$code',
        product: '$product',
        Description: '$Description',
        SellType: '$SellType',
        sellPrice: '$sellPrice',
        branch: '$branch'
      },
      compute: {
        qty: { $sum: '$qty' }
      },
      proj: {
        $project: {
          code: '$_id.code',
          product: '$_id.product',
          Description: '$_id.Description',
          SellType: '$_id.SellType',
          sellPrice: '$_id.sellPrice',
          branch: '$_id.branch',
          qty: 1,
          _id: 0
          // User: '$_id.User',
        }
      }
    };

    const InvtoryKeys = [{ locale: 'product', foreignKey: '_id' }];
    let MyKey = { branch: ObjectID(branchID), Description: OrderCode };
    let AggArray = [
      {
        $match: MyKey
      },
      ...GroupAggre(StockGroup.group, StockGroup.compute, StockGroup.proj)
    ];
    if (Ref.match(new RegExp('^RET'))) {
      MyKey.Ref = Ref;
      AggArray.pop();
      AggArray.pop();
      AggArray.push({
        $match: MyKey
      });
    }

    AggArray = [
      // {
      //   $match: MyKey
      // },
      ...AggArray,

      ...MultiKeyJoinObj({
        collection: InvItem,
        joinkeys: InvtoryKeys,
        marge: true
      }),
      {
        $project: {
          InvName: 1,
          UnitType: 1,
          price: '$sellPrice',
          qty: 1,
          UnitQty: 1,
          SellType: 1,
          ItemID: '$product',
          code: 1
        }
      }
    ];
    const groupObj = {
      Account: '$Account',
      Details: '$Details'
      // date: '$date'
    };
    const ComputeGroup = {
      Amount: { $sum: '$Amount' }
    };
    const groupProj = {
      $project: {
        // AccountName: '$_id.AccountName',
        Account: '$_id.Account',
        Details: '$_id.Details',
        // date: '$_id.date',
        Amount: 1,
        _id: 0
      }
    };

    const Acc_key = {
      branch: ObjectID(branchID),
      $or: [
        // { AccountName: 'Sales' },
        { AccountName: 'Sales Discount' },
        { AccountName: 'Sales Receivable' },
        { AccountName: 'Mobel' },
        { AccountName: 'Cash' },
        { AccountName: 'Main Bank' }
      ]
    };

    findAll(AccessDB, AcountColl, Acc_key)
      .then(account => {
        // console.log(clienKey);
        const JornalAggArray = [
          {
            $match: {
              $or: account.map(({ _id }) => {
                return { Account: _id };
              }),
              Description: ObjectID(Description),
              Details: OrderCode,
              branch: ObjectID(branchID)
            }
          },
          ...GroupAggre(groupObj, ComputeGroup, groupProj),
          // {
          //   $match: {
          //     Amount: { $ne: 0 }
          //   }
          // },
          ...MultiKeyJoinObj({
            collection: AcountColl,
            joinkeys: AccJoinKey,
            project: { AccountName: 1 },
            marge: true
          }),
          {
            $project: { [AcountColl]: 0 }
          }
        ];
        // console.log(AggArray);
        Aggregate(AccessDB, EntryColl, JornalAggArray)
          .then(Entry => {
            // console.log(val.length);
            // console.log(Entry);
            Aggregate(AccessDB, StockColl, AggArray)
              .then(items => {
                // console.log(items);
                res.send({ Entry, items });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(error => {
        console.log(error);
        throw error;
      });

    // const AggArray = [
    //   {
    //     $match: { branch: ObjectID(branchID) }
    //   },
    //   ...GroupAggre(groupObj, ComputeGroup, groupProj),
    //   ...MultiKeyJoinObj({
    //     collection: PriceColl,
    //     joinkeys: StockKeys,
    //     project: { _id: 0, cost: 1, price: 1 },
    //     marge: true
    //   }),
    //   ...MultiKeyJoinObj({
    //     collection: InvItem,
    //     joinkeys: InvtoryKeys,
    //     project: { invCateg: '$InvCateg', InvName: 1, UnitType: 1, UnitQty: 1 },
    //     marge: true
    //   }),
    //   ...MultiKeyJoinObj({
    //     collection: InvCateg,
    //     joinkeys: Category,
    //     // project: { _id: 0 },
    //     marge: true
    //   }),
    //   {
    //     $project: {
    //       _id: 0,
    //       [InvItem]: 0,
    //       [PriceColl]: 0,
    //       [InvCateg]: 0,
    //       AccountType: 0,
    //       Ref: 0,
    //       Description: 0,
    //       date: 0,
    //       time: 0,
    //       User: 0
    //     }
    //   }
    // ];
  } catch (error) {
    console.log(error);
  }
});

router.get('/view', (req, res) => {
  // console.log(req.query);
  const { AccessDB, branchID } = req.headers.user;
  const { OrderCode } = req.query;
  let SearchKey = {
    Description: OrderCode,
    branch: ObjectID(branchID)
  };
  let StockGroup = {
    group: {
      code: '$code'
    },
    // compute: {
    //   qty: { $sum: '$qty' }
    // },
    proj: {
      $project: {
        code: '$_id.code',
        _id: 0
        // User: '$_id.User',
      }
    }
  };
  const theWayJoinkey = [{ locale: 'code', foreignKey: '_id' }];

  let AggArray = [
    {
      $match: SearchKey
    },
    ...GroupAggre(StockGroup.group, StockGroup.compute, StockGroup.proj),

    ...MultiKeyJoinObj({
      collection: OntheWayColl,
      joinkeys: theWayJoinkey,
      marge: true,
      pipe: [
        ...MultiKeyJoinObj({
          collection: SupplierColl,
          joinkeys: [{ locale: 'SelectedSupp', foreignKey: '_id' }],
          project: {
            _id: 0,
            CostName: 1
          },
          marge: true
        })
      ],
      project: { DetailsOrder: 1, Date: 1, CostName: 1, _id: 0 }
    }),
    { $sort: { Date: -1 } },
    {
      $project: {
        [OntheWayColl]: 0
      }
    }
  ];

  Aggregate(AccessDB, StockColl, AggArray).then(val => {
    // console.log(val);
    res.send(val);
  });
  // res.sendStatus(500);
});
router.get('/itemSoldTrn', (req, res) => {
  console.log(req.query);

  const { AccessDB, branchID } = req.headers.user;

  const { code, product } = req.query;
  // let UpdateKey = {
  //   product: ObjectID('603b64b5746a9b0017e15519'),
  //   code,
  //   branch: ObjectID(branchID)
  // };
  // updateMany(AccessDB, StockColl, UpdateKey, {
  //   product: ObjectID(product)
  // }).then(result => {
  //   console.log(result);
  // });

  let SearchKey = {
    code,
    product: ObjectID(product),
    Description: { $ne: 'New Arrival' },
    branch: ObjectID(branchID)
  };
  let projection = {
    qty: 1,
    Description: 1,
    date: 1,
    sellPrice: 1,
    SellType: 1,
    User: 1,
    Ref: 1
  };

  findAll(AccessDB, StockColl, SearchKey, { projection }).then(val => {
    // console.table(val);
    res.send(val);
  });
  // res.sendStatus(500);
});

router.get('/income', (req, res) => {
  try {
    const { AccessDB, branchID, code } = req.headers.user;
    // console.log(req.query);
    const { from, to } = req.query;

    const groupObj = {
      //   AccountName: '$AccountName',
      Account: '$Account'
      //   branch: '$branch'
    };
    const ComputeGroup = {
      Amount: { $sum: '$Amount' }
    };
    const groupProj = {
      $project: {
        Account: '$_id.Account',
        Amount: 1,
        _id: 0
      }
    };

    const Acc_key = {
      branch: ObjectID(branchID),

      $or: [
        { AccountName: 'Sales' },
        { AccountName: 'Sales Discount' },
        { AccountName: 'Goods Sold' }
      ]
    };

    findAll(AccessDB, AcountColl, Acc_key)
      .then(account => {
        // console.log(clienKey);
        const match = {
          $match: {
            $or: account.map(({ _id }) => {
              return { Account: _id };
            }),
            Details: { $ne: code + '-0000' },
            branch: ObjectID(branchID)
          }
        };

        if (from && !to) match.$match.date = { $gte: from };
        else if (from && to) match.$match.date = { $gte: from, $lte: to };
        else if (!from && to) match.$match.date = { $lt: to };
        const JornalAggArray = [
          match,
          ...GroupAggre(groupObj, ComputeGroup, groupProj),
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
            const ExpAccKey = {
              branch: ObjectID(branchID),
              $or: [{ AccountType: 8 }, { AccountType: 14 }]
            };

            const groupProj2 = {
              $project: {
                Amount: 1,
                _id: 0
              }
            };

            findAll(AccessDB, AcountColl, ExpAccKey).then(Expense => {
              match.$match.$or = Expense.map(({ _id }) => ({ Account: _id }));

              const expAggreArray = [
                match,

                ...GroupAggre(null, ComputeGroup, groupProj2),
                { $sort: { Amount: -1 } }
              ];
              Aggregate(AccessDB, EntryColl, expAggreArray).then(
                ([totalExp]) => {
                  // console.log(totalExp);
                  // res.send(Entry);
                  res.send({
                    Sale: Entry,
                    Expense: totalExp || { Amount: 0 }
                  });
                }
              );
            });
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

router.put('/Editedate', (req, res) => {
  // console.log(req.body);

  const { AccessDB, branchID } = req.headers.user;

  let { Ref, Details, date } = req.body;

  let EntryUpdateKey = { Ref, branch: ObjectID(branchID), Details };
  let StockUpdateKey = {
    Ref,
    Description: Details,
    branch: ObjectID(branchID)
  };
  // console.log(Ref);
  updateMany(AccessDB, EntryColl, EntryUpdateKey, { date }).then(() => {
    updateMany(AccessDB, StockColl, StockUpdateKey, { date }).then(() => {
      res.sendStatus(200);
    });
  });
  // res.sendStatus(500);
});

router.post('/return', (req, res) => {
  // console.log(req.body);
  const { AccessDB, branchID, UserName, CashBase } = req.headers.user;
  RetruntItms(req.body, AccessDB, branchID, UserName, CashBase).then(() => {
    // console.log(val);
    res.sendStatus(200);
  });

  // res.sendStatus(500);
});
module.exports = router;

function RetruntItms(body, AccessDB, branchID, UserName, CashBase) {
  return new Promise((resolve, reject) => {
    try {
      let {
        items,
        date,
        Payment: { Discount /* Remain */ },
        OrderCode,
        Description
        // Ref
      } = body;
      let CostKey = items.map(item => ({
        code: item.code,
        product: ObjectID(item.ItemID),
        branch: ObjectID(branchID)
      }));
      findAll(AccessDB, PriceColl, { $or: CostKey }).then(costs => {
        // resolve(costs);
        // console.log(items);
        // console.log('------------------------------------');
        // return;
        let newItems = items.map(item => {
          let { cost, price } = costs.find(
            itm => itm.product.toString() == item.ItemID
          );
          return { ...item, cost, SellPrice: price };
        });
        // console.log(newItems);
        // resolve('_________________________');
        const Amount = {
          // Reamin: parseFloat(Remain),
          Discount: parseFloat(Discount),
          ReturnAmount: ReturnAmountFn(newItems, 'price'),
          soldAmount: ReturnAmountFn(newItems, 'cost')
        };
        // return;
        const Acc_key = {
          branch: ObjectID(branchID),
          $or: [
            { AccountName: 'Sales' },
            { AccountName: 'Sales Receivable' },
            { AccountName: 'Sales Discount' },
            { AccountName: 'Goods Sold' },
            { AccountName: 'Cost of Goods' }
            // { AccountName: "cashType" }
          ]
        };
        findAll(AccessDB, AcountColl, Acc_key).then(accounts => {
          SalesReturn(
            UserName,
            Amount,
            CashBase,
            Description,
            OrderCode,
            ObjectID(branchID),
            accounts,
            date,
            null
          ).then(Entry => {
            // console.log(Entry);
            const [{ Ref }] = Entry;
            // console.log(Ref);
            const soldProduct = items.map(item => {
              let { code, RQTY, price, ItemID, SellType } = item;
              // if (SellType == 'retail') qty = qty / UnitQty;
              return {
                code: code,
                product: ObjectID(ItemID),
                qty: RQTY,
                Description: OrderCode,
                branch: ObjectID(branchID),
                date,
                time: 'Return',
                Ref,
                SellType,
                sellPrice: price,
                User: UserName
              };
            });
            // console.log(soldProduct);
            // return;
            insertMany(AccessDB, EntryColl, Entry)
              .then(() => {
                insertMany(AccessDB, StockColl, soldProduct)
                  .then(() => {
                    // res.send({ soldProduct, OrderCode });
                    resolve('done Insert');
                  })
                  .catch(async error => {
                    await DeleteMany(AccessDB, EntryColl, { Ref });
                    throw error;
                  });
              })
              .catch(error => {
                console.log(error);
                throw error;
              });
            // res.send({ soldProduct, OrderCode });
            // console.log('sent response');
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });

  function ReturnAmountFn(items, amount) {
    // console.log(items);
    return items.reduce((CodeAmount, item) => {
      let { RQTY, code } = item;
      let OldAmount = CodeAmount[code] || 0;
      CodeAmount[code] = OldAmount + item[amount] * RQTY;
      return CodeAmount;
    }, {});
  }
}

// [
//     { AccountName: 'Sales' },
//     { AccountName: 'Sales Receivable' },
//     { AccountName: 'Sales Discount' },
//     { AccountName: 'Goods Sold' },
//     { AccountName: 'Cost of Goods' },
//     { AccountName: cashType }
//   ]
