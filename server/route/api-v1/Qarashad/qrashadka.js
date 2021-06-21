const express = require('express');
const { objecID } = require('@models/connection');
const QrashQuery = require('@models/qarashQuery');
const Bank = require('@models/Accountant');
const Query = require('@models/comanQuery');
const { verifyToken } = require('@auth');
const Joi = require('@hapi/joi');
const router = express.Router();

// all route names
const collName = 'EntryBook';
// const collName2 = "Customer";

router.post('/deposit', verifyToken, (req, res) => {
  let user = req.headers.user;
  if (!user) {
    // console.log("Hellow");
    res.sendStatus(403);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  let userName = user.UserName;
  let depInfo = req.body;

  const { error } = EntryBookSchema(depInfo);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }

  QrashQuery.CheckBalance(
    DB_Name,
    depInfo.AccountNumber,
    depInfo.amountType,
    'Receivable'
  ).then(Balance => {
    // console.log(Balance);

    Bank.Deposit(
      userName,
      Balance,
      DB_Name,
      depInfo.amount,
      depInfo.amountType,
      depInfo.AccountNumber,
      depInfo.details,
      depInfo.date,
      depInfo.time
    ).then(depost => {
      // console.log(depost);

      Query.insertMany(DB_Name, collName, depost)
        .then(() => {
          QrashQuery.AccountBalance(DB_Name, depInfo.AccountNumber).then(
            result => {
              // console.log(result);
              res.send(result);
            }
          );
        })
        .catch(err => {
          throw err;
        });
    });
  });

  // console.log(depost);
});
router.post('/withdraw', verifyToken, async (req, res) => {
  let user = req.headers.user;
  if (!user) {
    // console.log("Hellow");
    res.sendStatus(403);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  let userName = user.UserName;
  let depInfo = req.body;

  const { error } = EntryBookSchema(depInfo);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  // QrashQuery.TotalCashByAccount(DB_Name, "Main Cash", depInfo.amountType).then(
  //   cash => {
  //     // console.log(cash);
  //     if (cash.length == 0 || cash[0].Amount < depInfo.amount) {
  //       res
  //         .status(400)
  //         .send(
  //           `Your ${depInfo.amountType} balance is less than ${depInfo.amount}`
  //         );
  //       return;
  //     } else {
  QrashQuery.CheckBalance(
    DB_Name,
    depInfo.AccountNumber,
    depInfo.amountType
  ).then(Balance => {
    Bank.Withdraw(
      userName,
      Balance,
      DB_Name,
      depInfo.amount,
      depInfo.amountType,
      depInfo.AccountNumber,
      depInfo.details,
      depInfo.date,
      depInfo.time
    ).then(withdrow => {
      // console.log(withdrow);
      Query.insertMany(DB_Name, collName, withdrow)
        .then(() => {
          QrashQuery.AccountBalance(DB_Name, depInfo.AccountNumber).then(
            result => {
              // console.log(result);
              res.send(result);
            }
          );
        })
        .catch(err => {
          throw err;
        });
      // res.sendStatus(400);
    });
  });
  // }
});

// console.log(depost);
// });
router.post('/Buy', verifyToken, async (req, res) => {
  // console.log("Founded");
  let user = req.headers.user;
  if (!user) {
    // console.log("Hellow");
    res.sendStatus(403);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  let userName = user.UserName;
  let BuyInfo = req.body;

  const { error } = ExchangeSchema(BuyInfo);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  Bank.ExchangeData(DB_Name, BuyInfo, userName).then(exchange => {
    QrashQuery.CheckBalance(
      DB_Name,
      BuyInfo.ClientAccount,
      BuyInfo.sellorBuyType
    ).then(clBalane => {
      // console.log(clBalane);
      Bank.Withdraw(
        userName,
        clBalane,
        DB_Name,
        BuyInfo.sellorBuyAmount,
        BuyInfo.sellorBuyType,
        BuyInfo.ClientAccount,
        'Exchanged',
        BuyInfo.date,
        BuyInfo.time
      ).then(BuyDraw => {
        // console.log(SellDraw);
        QrashQuery.CheckBalance(
          DB_Name,
          BuyInfo.ClientAccount,
          BuyInfo.homeType,
          'Receivable'
        ).then(Deen => {
          // console.log(Deen);
          Bank.Deposit(
            userName,
            Deen,
            DB_Name,
            BuyInfo.Amount,
            BuyInfo.homeType,
            BuyInfo.ClientAccount,
            `From ${BuyInfo.sellorBuyAmount.toLocaleString()} ${
              BuyInfo.sellorBuyType
            } Exchange`,
            BuyInfo.date,
            BuyInfo.time
          )
            .then(BuyDep => {
              // console.log([...exchange, ...BuyDep, ...BuyDraw]);
              SaveExchange(
                DB_Name,
                [...exchange, ...BuyDep, ...BuyDraw],
                BuyInfo,
                userName
              ).then(data => {
                res.send(data);
              });
            })
            .catch(err => {
              console.log(err);
              res
                .status(451)
                .send('internal Error happened please contact the Devloper');
              // throw(err)
            });
        });
      });
    });

    // res.sendStatus(200);
  });

  // console.log(BuyInfo);
});
router.post('/Sell', verifyToken, async (req, res) => {
  let user = req.headers.user;
  if (!user) {
    // console.log("Hellow");
    res.sendStatus(403);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  let userName = user.UserName;
  let Sellinfo = req.body;

  const { error } = ExchangeSchema(Sellinfo);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }

  Bank.ExchangeData(DB_Name, Sellinfo, userName).then(exchange => {
    QrashQuery.CheckBalance(
      DB_Name,
      Sellinfo.ClientAccount,
      Sellinfo.homeType
    ).then(clBalane => {
      // console.log(clBalane);
      Bank.Withdraw(
        userName,
        clBalane,
        DB_Name,
        Sellinfo.Amount,
        Sellinfo.homeType,
        Sellinfo.ClientAccount,
        `Exchanged`,
        Sellinfo.date,
        Sellinfo.time
      ).then(BuyDraw => {
        // console.log(SellDraw);
        QrashQuery.CheckBalance(
          DB_Name,
          Sellinfo.ClientAccount,
          Sellinfo.sellorBuyType,
          'Receivable'
        ).then(Deen => {
          // console.log(Deen);
          Bank.Deposit(
            userName,
            Deen,
            DB_Name,
            Sellinfo.sellorBuyAmount,
            Sellinfo.sellorBuyType,
            Sellinfo.ClientAccount,
            `From ${Sellinfo.Amount} ${Sellinfo.homeType} Exchange`,
            Sellinfo.date,
            Sellinfo.time
          )
            .then(BuyDep => {
              // console.log([...exchange, ...BuyDep, ...BuyDraw]);
              SaveExchange(
                DB_Name,
                [...exchange, ...BuyDep, ...BuyDraw],
                Sellinfo,
                userName
              ).then(data => {
                res.send(data);
                // res.sendStatus(200);
              });
            })
            .catch(err => {
              console.log(err);
              res
                .status(451)
                .send('internal Error happened please contact the Devloper');
              // throw(err)
            });
        });
      });
    });

    // res.sendStatus(200);
  });

  // res.sendStatus(200);
});
router.post('/totalcash', verifyToken, (req, res) => {
  let user = req.headers.user;

  let DB_Name = `DB_${user.phone}`;
  // console.log(req.body);
  // RCL -> stands of Request Clinet
  let RCL = req.body;

  QrashQuery.TotalCashByAccount(
    DB_Name,
    RCL.Account,
    RCL.cashType,
    RCL.from,
    RCL.to
  )
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log(error);
    });
  // res.sendStatus(201);
});
router.post('/Expense', verifyToken, (req, res) => {
  let user = req.headers.user;
  if (!user) {
    res.sendStatus(403);
    console.log(user);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  let userName = user.UserName;

  // console.log(req.body);
  let ExpenseInfo = req.body;
  const { error } = ExpenseSchema(ExpenseInfo);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    // console.log(ExpenseInfo);
    // res.sendStatus(201);
    let val = [
      {
        User: userName,
        Account: objecID(ExpenseInfo.Account),
        Amount: -Number(ExpenseInfo.Amount),
        AmountType: ExpenseInfo.AmountType,
        Description: 'Expense',
        Details: `To: ${ExpenseInfo.type.text}`,
        date: ExpenseInfo.date,
        time: ExpenseInfo.time,
        Acc: 'Cr'
      },
      {
        User: userName,
        Account: objecID(ExpenseInfo.type.value),
        Amount: Number(ExpenseInfo.Amount),
        AmountType: ExpenseInfo.AmountType,
        Description: 'Expense',
        Details: `${ExpenseInfo.type.text}`,
        date: ExpenseInfo.date,
        time: ExpenseInfo.time,
        Acc: 'Dr'
      }
    ];
    // console.log(val);
    let TranRef = Date.now();
    for (let index = 0; index < val.length; index++) {
      val[index].Ref = TranRef;
    }
    Query.insertMany(DB_Name, collName, val)
      .then(result => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});
router.post('/allexpense', verifyToken, (req, res) => {
  let user = req.headers.user;
  if (!user) {
    res.sendStatus(403);
    console.log(user);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  // console.log(req.body);
  QrashQuery.Expenses(DB_Name, req.body.from, req.body.to)
    .then(expense => {
      res.send(expense);
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
});
router.post('/transfer', verifyToken, (req, res) => {
  let user = req.headers.user;
  if (!user) {
    res.sendStatus(403);
    // console.log(user);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  let userName = user.UserName;

  // console.log(req.body);
  let transfer = req.body.transfer;
  const { error } = TransferSchema(transfer);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    let val = [
      {
        User: userName,
        Account: objecID(transfer.FromAccount.value),
        Amount: -Number(transfer.Amount),
        AmountType: transfer.AmountType,
        Description: 'Transfer',
        Details: `To: ${transfer.ToAccount.text}`,
        date: transfer.date,
        time: transfer.time,
        Acc: 'Cr'
      },
      {
        User: userName,
        Account: objecID(transfer.ToAccount.value),
        Amount: Number(transfer.Amount),
        AmountType: transfer.AmountType,
        Description: 'Transfer',
        Details: `From: ${transfer.FromAccount.text}`,
        date: transfer.date,
        time: transfer.time,
        Acc: 'Dr'
      }
    ];
    // console.log(val);
    let TranRef = Date.now();
    for (let index = 0; index < val.length; index++) {
      val[index].Ref = TranRef;
    }
    Query.insertMany(DB_Name, collName, val)
      .then(result => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});
router.post('/DhigidHanti', verifyToken, (req, res) => {
  let user = req.headers.user;
  if (!user) {
    res.sendStatus(403);
    // console.log(user);
    return;
  }
  let DB_Name = `DB_${user.phone}`;
  let userName = user.UserName;

  // console.log(req.body);
  let CashDep = req.body.Dhigid;
  const { error } = MoneyDepositSchema(CashDep);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    Bank.CaptalDeposit(
      userName,
      DB_Name,
      CashDep.Amount,
      CashDep.amountType,
      CashDep.Details,
      CashDep.data,
      CashDep.time
    ).then(val => {
      // console.log(val);
      Query.insertMany(DB_Name, collName, val)
        .then(result => {
          res.sendStatus(201);
        })
        .catch(err => {
          console.log(err);
        });
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/Accounts/:AccountType', verifyToken, (req, res) => {
  let user = req.headers.user;
  if (!user) {
    res.sendStatus(403);
    console.log(user);
    return;
  }
  let DB_Name = `DB_${user.phone}`;

  // console.log(req.params.AccountType);
  let key = {};
  if (req.params.AccountType === 'Cash')
    key = { category: req.params.AccountType };
  else if (
    'Expenses' === req.params.AccountType ||
    req.params.AccountType === 'Assets'
  )
    key = { AccountType: req.params.AccountType };
  else key = { AccountName: req.params.AccountType };

  Query.findAll(DB_Name, 'Acounts', key).then(result => {
    res.send(result);
  });
  // res.sendStatus(200);
});

function EntryBookSchema(EntryData) {
  const schema = Joi.object({
    amount: Joi.number().required(),
    AccountNumber: Joi.number().required(),
    amountType: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    details: Joi.string().required()
  });

  return schema.validate(EntryData);
}
function ExpenseSchema(EntryData) {
  const schema = Joi.object({
    Amount: Joi.number().required(),
    type: Joi.object({
      text: Joi.string().required(),
      value: Joi.string().required()
    }),
    AmountType: Joi.string().required(),
    Account: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required()
  });

  return schema.validate(EntryData);
}
function TransferSchema(EntryData) {
  // let nestedObject = Joi.object().keys({
  //   text: Joi.string().required(),
  //   value: Joi.string().required()
  // });

  const schema = Joi.object({
    Amount: Joi.number().required(),
    FromAccount: Joi.object({
      text: Joi.string().required(),
      value: Joi.string().required()
    }),
    ToAccount: {
      text: Joi.string().required(),
      value: Joi.string().required()
    },
    AmountType: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required()
  });

  return schema.validate(EntryData);
}

function MoneyDepositSchema(EntryData) {
  // let nestedObject = Joi.object().keys({
  //   text: Joi.string().required(),
  //   value: Joi.string().required()
  // });

  const schema = Joi.object({
    Amount: Joi.number().required(),
    amountType: Joi.string().required(),
    Details: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required()
  });

  return schema.validate(EntryData);
}

function ExchangeSchema(EntryData) {
  const schema = Joi.object({
    ClientAccount: Joi.number().required(),
    sellorBuyAmount: Joi.number().required(),
    Rate: Joi.number().required(),
    sellorBuyType: Joi.string().required().max(3).min(3),
    homeType: Joi.string().required().max(3).min(3),
    date: Joi.string().required(),
    time: Joi.string().required(),
    sellOrBuy: Joi.string().required().min(3).max(4),
    Amount: Joi.number().required()
  });

  return schema.validate(EntryData);
}

function SaveExchange(dbName, Entry, exchange, user) {
  return new Promise((resolve, reject) => {
    let TranRef = Date.now();
    for (let index = 0; index < Entry.length; index++) {
      Entry[index].Ref = TranRef;
    }
    let exchangeData = {
      SourceType: exchange.sellorBuyType,
      SourceAmount: exchange.sellorBuyAmount,
      Rate: exchange.Rate,
      Amount: exchange.Amount,
      ExchangeType: exchange.sellOrBuy,
      User: user,
      data: exchange.date,
      time: exchange.time,
      Ref: TranRef
    };
    Query.insertMany(dbName, 'EntryBook', Entry)
      .then(result => {
        Query.insertOne(dbName, 'Exchange', exchangeData)
          .then(data => {
            QrashQuery.AccountBalance(dbName, exchange.ClientAccount).then(
              result => {
                // console.log(result);
                resolve(result);
              }
            );
            // resolve("ok");
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(err => {
        reject('1');
      });
  });
}

module.exports = router;
