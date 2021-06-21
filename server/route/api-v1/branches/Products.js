const express = require('express');
const { ObjectID } = require('mongodb');
const { verifyToken } = require('@auth');
const {
  Aggregate,
  DeleteMany,
  // DeleteNewOrde,
  insertOne,
  insertMany,
  findAll,
  MaxStringVal
} = require('@models/comanQuery');
const { MultiKeyJoinObj, GroupAggre } = require('@models/GenerateAggre');
const { GenerateCode } = require('@models/util');
const { SalesTrans } = require('@models/Accountant');
const router = express.Router();

const ClientColl = 'Clients';
const StockColl = 'Stocks';
const PriceColl = 'PriceList';
const InvItem = 'InventoryItems';
const AcountColl = 'Acounts';
const InvCateg = 'ItemsCategory';
const EntryColl = 'EntryBook';

router.use(verifyToken);

// Get All Inventory list
router.get(`/`, (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;
    // console.log(req.headers.user);
    // const key = { Ref: "New-1609669633184" };

    // DeleteNewOrde(AccessDB, "ORD-100-0003", key).then(() => {
    //   // res.sendStatus(val);
    //   console.log("Deleted")
    // });
    // let myArray = [0.34, -0.02, -0.06, -0.12, -0.14];
    // console.log(myArray.reduce((total, num) => (total += num), 0));

    const groupObj = {
      product: '$product',
      code: '$code',
      branch: '$branch'
    };
    const ComputeGroup = {
      qty: { $sum: { $toDecimal: { $toString: '$qty' } } }
    };
    const groupProj = {
      $project: {
        _id: 0,
        product: '$_id.product',
        code: '$_id.code',
        branch: '$_id.branch',
        qty: { $toDouble: '$qty' }
      }
    };
    // let key = {
    //   branch: ObjectID(branchID),
    //   code: '114=>115-41',
    //   product: ObjectID('5fec20bc26b1650017003f4a')
    // };
    // let TestArray = [
    //   {
    //     $match: key
    //   },

    //   ...GroupAggre(groupObj, ComputeGroup, groupProj)

    // ];
    // Aggregate(AccessDB, StockColl, TestArray).then(val => {
    //   console.log(val);
    // });

    const StockKeys = [
      { locale: 'product', foreignKey: 'product' },
      { locale: 'code', foreignKey: 'code' },
      { locale: 'branch', foreignKey: 'branch' }
    ];
    const InvtoryKeys = [{ locale: 'product', foreignKey: '_id' }];
    const Category = [{ locale: 'invCateg', foreignKey: '_id' }];

    const AggArray = [
      {
        $match: { branch: ObjectID(branchID) }
      },
      ...GroupAggre(groupObj, ComputeGroup, groupProj),
      {
        $match: {
          qty: { $gt: 0 }
        }
      },
      ...MultiKeyJoinObj({
        collection: PriceColl,
        joinkeys: StockKeys,
        project: { _id: 0, cost: 1, price: 1 },
        marge: true
      }),
      ...MultiKeyJoinObj({
        collection: InvItem,
        joinkeys: InvtoryKeys,
        project: { invCateg: '$InvCateg', InvName: 1, UnitType: 1, UnitQty: 1 },
        marge: true
      }),
      ...MultiKeyJoinObj({
        collection: InvCateg,
        joinkeys: Category,
        // project: { _id: 0 },
        marge: true
      }),
      {
        $project: {
          _id: 0,
          [InvItem]: 0,
          [PriceColl]: 0,
          [InvCateg]: 0,
          AccountType: 0,
          Ref: 0,
          Description: 0,
          date: 0,
          time: 0,
          User: 0
        }
      }
    ];
    Aggregate(AccessDB, StockColl, AggArray)
      .then(val => {
        // console.log(
        //   val.filter(
        //     item => item.code == '114=>115-41' && item.InvName == '4009'
        //   )
        // );
        res.send(val);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});

router.post('/store', StoreSell);

module.exports = router;

function StoreSell(req, res) {
  // console.log('reached');
  const { branchID, AccessDB, UserName, CashBase, code } = req.headers.user;
  const {
    product,
    DueAmount,
    Paid,
    cashType,
    BankRef,
    Discount,
    Name,
    client: phone,
    SellType,
    date,
    time
  } = req.body;

  const Amount = {
    DueAmount: parseFloat(DueAmount),
    paid: parseFloat(Paid),
    Discount: parseFloat(Discount),
    PriceAmount: product.reduce((CodeCost, costs) => {
      let { qty, price, code } = costs;
      // if (SellType == 'retail') qty = qty / UnitQty;
      CodeCost[code] = CodeCost[code]
        ? CodeCost[code] + price * qty
        : price * qty;
      // return (total += cost * qty);
      return CodeCost;
    }, {}),
    soldAmount: product.reduce((CodeCost, costs) => {
      let { qty, UnitQty, cost, code } = costs;
      if (SellType == 'retail') qty = qty / UnitQty;
      CodeCost[code] = CodeCost[code]
        ? CodeCost[code] + cost * qty
        : cost * qty;
      // return (total += cost * qty);
      return CodeCost;
    }, {})
  };

  // console.log(Amount.PriceAmount);
  // res.sendStatus(500);
  // return;

  const Acc_key = {
    branch: ObjectID(branchID),
    $or: [
      { AccountName: 'Sales' },
      { AccountName: 'Sales Receivable' },
      { AccountName: 'Sales Discount' },
      { AccountName: 'Goods Sold' },
      { AccountName: 'Cost of Goods' },
      { AccountName: cashType }
    ]
  };
  findAll(AccessDB, AcountColl, Acc_key).then(accounts => {
    const OrderKey = {
      Account: accounts.find(acc => acc.AccountName == 'Sales')._id,
      Details: RegExp(`^${code}`),
      branch: ObjectID(branchID)
    };
    // console.log(OrderKey);
    // DeleteMany(AccessDB, EntryColl, { Ref: 'Rev-1603807560772' });
    MaxStringVal(AccessDB, EntryColl, 'Details', -1, OrderKey, 2).then(
      async number => {
        // console.log(code);
        const orderCode = GenerateCode(number, code);
        // console.log(orderCode);
        // res.sendStatus(500);
        // return;
        let { _id: clientID } = Name;
        if (!clientID) {
          let { insertedId } = await insertOne(AccessDB, ClientColl, {
            Name,
            phone,
            date,
            time,
            RegBranch: ObjectID(branchID)
          });
          clientID = insertedId;
        }
        CheckBalance(AccessDB, clientID, accounts, branchID, code).then(
          balance => {
            // console.log(balance);
            Amount.AvBlance = balance;
            SalesTrans(
              UserName,
              cashType,
              BankRef,
              Amount,
              CashBase,
              clientID,
              orderCode,
              ObjectID(branchID),
              accounts,
              date,
              time
            ).then(Entry => {
              // // console.log(Entry);
              // res.sendStatus(500);
              // return;
              const [{ Ref }] = Entry;
              // console.log(Ref);
              const soldProduct = product.map(item => {
                let { code, qty, price, UnitQty, product, branch } = item;
                if (SellType == 'retail') qty = qty / UnitQty;
                return {
                  code: code,
                  product: ObjectID(product),
                  qty: -qty,
                  Description: orderCode,
                  branch: ObjectID(branch),
                  date,
                  time,
                  Ref,
                  SellType,
                  sellPrice: price,
                  User: UserName
                };
              });

              insertMany(AccessDB, EntryColl, Entry)
                .then(() => {
                  insertMany(AccessDB, StockColl, soldProduct)
                    .then(() => {
                      res.send({ soldProduct, orderCode });
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
              // res.send({ soldProduct, orderCode });
              // console.log('sent response');
            });
          }
        );
      }
    );
    // console.log(accounts);
  });
  //   console.log(product);
  // res.sendStatus(500);
}

function CheckBalance(DB, clientID, accounts, branchID, code) {
  return new Promise((resolve, reject) => {
    try {
      let MyDetails = code + '-AAA';
      const Groupt = {
        grp: {
          Details: '$Details'
        },
        cmpt: {
          Amount: { $sum: '$Amount' }
        },
        prj: {
          $project: {
            Details: '$_id.Details',
            Amount: 1,
            _id: 0
          }
        }
      };

      let match = {
        $match: {
          Account: accounts.find(den => den.AccountName == 'Sales Receivable')
            ._id,
          Description: ObjectID(clientID),
          Details: MyDetails,
          branch: ObjectID(branchID)
        }
      };

      let JornalAggArray = [
        match,
        ...GroupAggre(Groupt.grp, Groupt.cmpt, Groupt.prj),

        {
          $match: {
            Amount: { $lt: 0 }
          }
        }
      ];
      Aggregate(DB, EntryColl, JornalAggArray).then(([blc]) => {
        resolve(blc || { Amount: 0, Details: MyDetails });
      });
    } catch (error) {
      reject(error);
    }
  });
}
