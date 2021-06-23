const express = require('express');
const { verifyToken } = require('@auth');
const {
  findWithKey,
  findAll,
  Aggregate,
  updateOne,
  insertMany,
  insertOne,
  FindDelete,
  updateMany
} = require('@models/comanQuery');
const { GroupAggre } = require('@models/GenerateAggre');
const { AccountBalance } = require('@models/qarashQuery');
const { ObjectID } = require('mongodb');
const Joi = require('@hapi/joi');

const router = express.Router();

// all collections name
const customerColl = 'Clients';
const AccountColl = 'Acounts';
const EntryBook = 'EntryBook';

router.use(verifyToken);

// Get All cuustomer
router.get(`/`, (req, res) => {
  // console.log(req.query);
  const { AccessDB, branchID } = req.headers.user;

  findAll(AccessDB, customerColl, {
    RegBranch: ObjectID(branchID)
  }).then(clients => {
    // console.log(clients);
    res.send(clients);
  });
  // res.sendStatus(500);
});

// Insert New Customer
router.post('/', (req, res) => {
  // let user = req.headers.user;

  const { error } = ClientSchema(req.body);
  if (error) {
    // console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    //   console.log(req.body);

    const { AccessDB, branchID, UserName, code, CashBase } = req.headers.user;
    let Checkkey = {
      phone: new RegExp(`${req.body.phone}$`, 'i'),
      RegBranch: ObjectID(branchID)
    };
    findWithKey(AccessDB, customerColl, Checkkey).then(value => {
      if (value) {
        res
          .status(409)
          .send(
            `Phone <span class="error--text">${req.body.phone}</span> is already created`
          );
        return;
      }
      // })
      let CustomerInfo = {
        Name: req.body.Name,
        phone: req.body.phone,
        date: req.body.date,
        // time: req.body.time,
        RegBranch: ObjectID(branchID)
      };
      insertOne(AccessDB, customerColl, CustomerInfo)
        .then(({ insertedId }) => {
          //
          //   res.sendStatus(201);
          const debtor = {
            client: insertedId,
            Amount: req.body.Amount,
            date: req.body.date,
            time: req.body.time,
            AccessDB,
            branchID,
            UserName,
            CashBase,
            code
          };
          SaveOldBalance(debtor)
            .then(() => {
              // console.log(val);
              res.redirect('/api-v1/customer');
            })
            .catch(err => {
              FindDelete(AccessDB, customerColl, { _id: insertedId });
              res.status(500).send(err);
            });
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});
// Customer Update
router.put('/', (req, res) => {
  try {
    // let user = req.headers.user;
    // console.log(req.body);
    const { AccessDB, branchID } = req.headers.user;

    let updateInfo = {
      Name: req.body.Name,
      phone: req.body.phone
    };

    let Checkkey = {
      phone: new RegExp(`${req.body.phone}$`, 'i'),
      RegBranch: ObjectID(branchID),
      _id: { $ne: ObjectID(req.body.ID) }
    };
    findWithKey(AccessDB, customerColl, Checkkey).then(value => {
      if (value) {
        res
          .status(409)
          .send(
            `Phone <span class="error--text">${req.body.phone}</span> is already created`
          );
        return;
      }
      // })
      updateOne(
        AccessDB,
        customerColl,
        { _id: ObjectID(req.body.ID) },
        updateInfo,
        false
      )
        .then(() => {
          //   console.log(v);
          //   res.redirect("/api/house/rooms", 301);
          let ClientKey = { RegBranch: ObjectID(branchID) };

          findAll(AccessDB, customerColl, ClientKey, {})
            .then(val => {
              res.send(val);
            })
            .catch(error => {
              console.log(error);
              throw error;
            });
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

// Get specific cuustomer
router.get(`/find`, (req, res) => {
  // console.log(req.query);
  const { AccessDB, branchID } = req.headers.user;

  const { phone } = req.query;
  findWithKey(AccessDB, customerColl, {
    phone,
    RegBranch: ObjectID(branchID)
  }).then(val => {
    // console.log(val);
    res.send(val);
  });
  // res.sendStatus(500);
});

// Get client transactions
router.get('/transactions', (req, res) => {
  // let user = ;

  try {
    let { AccessDB, branchID } = req.headers.user;
    let { _id, from, to } = req.query;
    // console.log(req.query);

    // if (!branchID) branchID = branch;
    // else branchID = ObjectID(branchID);
    const Acc_key = {
      branch: ObjectID(branchID),
      $or: [
        // { AccountName: 'Sales' },
        { AccountName: 'Sales' },
        { AccountName: 'Sales Discount' },
        { AccountName: 'Cash' },
        { AccountName: 'Mobile' },
        { AccountName: 'Main Bank' }
      ]
    };
    findAll(AccessDB, AccountColl, Acc_key).then(account => {
      let match = {
        $or: account.map(acc => ({ Account: acc._id })),
        Description: ObjectID(_id),
        branch: ObjectID(branchID)
      };

      if (from && !to) match.date = { $gte: from };
      else if (from && to) match.date = { $gte: from, $lte: to };
      else if (!from && to) match.date = { $lte: to };

      const groupObj = {
        Account: '$Account',
        Details: '$Details',
        info: '$info',
        date: '$date',
        Acc: '$Acc',
        User: '$User',
        Ref: '$Ref'
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
          User: '$_id.User',
          Acc: '$_id.Acc',
          Ref: '$_id.Ref',
          Amount: 1,
          _id: 0
        }
      };
      let projection = {
        User: 1,
        Account: 1,
        Amount: 1,
        AmountType: 1,
        Details: 1,
        info: 1,
        date: 1,
        Acc: 1,
        Ref: 1
      };
      const AggArray = [
        { $match: match },
        ...GroupAggre(groupObj, ComputeGroup, groupProj),
        { $sort: { date: -1, Details: -1 } },
        {
          $project: projection
        }
      ];

      Aggregate(AccessDB, EntryBook, AggArray).then(result => {
        // console.log(result);
        let temp = result.map(val => {
          let { AccountName } = account.find(acc => {
            return acc._id.toString() == val.Account.toString();
          }) || { AccountName: '' };
          /* if (AccountName == 'Mobel') AccountName = 'Mobile';
            else */
          if (AccountName == 'Sales Discount') AccountName = 'Discount';
          if (val.info) {
            val.Details = val.info;
            val.info = undefined;
          }
          return {
            ...val,
            AccountName
          };
        });
        // console.log('------------------------');
        // console.log(temp);
        res.send(temp);
      });
    });
  } catch (error) {
    console.log('Cliens transaction Error');
    console.log(error);
    res.sendStatus(403);
  }
});

router.get('/balance', (req, res) => {
  // let user = req.headers.user;

  try {
    let { AccessDB, branchID } = req.headers.user;
    // if(!branchID)
    // branchID = branch
    // else branchID = ObjectID(branchID)

    let { _id, from, to } = req.query;
    // console.log(req.query);

    findWithKey(AccessDB, AccountColl, {
      AccountName: 'Sales Receivable',
      branch: ObjectID(branchID)
    }).then(acc => {
      if (acc)
        AccountBalance(
          AccessDB,
          acc._id,
          ObjectID(_id),
          from,
          to,
          null,
          branchID
        ).then(blce => {
          // console.log(blce);
          res.send(blce.map(tran => ({ ...tran, Amount: -tran.Amount })));
        });
      else {
        res.status(500).send('Account not found');
      }
    });
  } catch (error) {
    console.log('Customer Erro');
    console.log(error);

    res.sendStatus(403);
  }
});

router.get('/validOld', (req, res) => {
  try {
    let { AccessDB, branchID, code } = req.headers.user;
    const { _id } = req.query;
    const key = {
      Description: ObjectID(_id),
      Details: code + '-0000',
      branch: ObjectID(branchID)
    };
    findWithKey(AccessDB, EntryBook, key).then(val => {
      res.send(val);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.post('/oldblce', (req, res) => {
  try {
    let { AccessDB, branchID, UserName, CashBase, code } = req.headers.user;
    const debtor = {
      ...req.body,
      AccessDB,
      branchID,
      UserName,
      CashBase,
      code
    };

    SaveOldBalance(debtor)
      .then(() => {
        // console.log(val);
        res.sendStatus(201);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  } catch (error) {
    console.log(error);
    console.log('error');
    throw error;
  }
});

router.put('/Editedate', (req, res) => {
  // console.log(req.body);

  const { AccessDB, branchID } = req.headers.user;

  let { Ref, Details, date } = req.body;

  let UpdateKey = { Ref, branch: ObjectID(branchID) };
  updateMany(AccessDB, EntryBook, UpdateKey, { Details, date }).then(() => {
    res.sendStatus(200);
  });
  // res.sendStatus(500);
});

function SaveOldBalance(Deptor) {
  return new Promise((resolve, reject) => {
    try {
      let {
        date,
        time,
        Amount,
        Details,
        client,
        code,
        branchID,
        AccessDB,
        UserName,
        CashBase
      } = Deptor;

      // console.log(req.body);
      // res.sendStatus(500);
      if (Amount <= 0) {
        resolve(201);
        return;
      }
      const Acc_key = {
        branch: ObjectID(branchID),
        // $or: [{ AccountName: 'Sales' }, { AccountName: 'Sales Receivable' }]
        $or: [{ AccountName: 'Cash' }, { AccountName: 'Sales Receivable' }]
      };
      findAll(AccessDB, AccountColl, Acc_key).then(accouts => {
        const Sales = AccountID(accouts, 'Cash');
        const Receivable = AccountID(accouts, 'Sales Receivable');
        const Ref = 'OLD-' + Date.now();
        AccountBalance(
          AccessDB,
          Sales,
          null,
          null,
          null,
          CashBase,
          branchID
        ).then(([TotalAmount]) => {
          // console.log(TotalAmount);
          // res.send(blce);
          if (!TotalAmount || TotalAmount.Amount < Amount) {
            reject(
              `your <span class="error--text">${CashBase}</span> balance in not enough`
            );
            return;
          }
          const tranArray = [
            {
              User: UserName,
              Account: ObjectID(Sales),
              Amount: -parseFloat(Amount),
              AmountType: CashBase,
              Description: ObjectID(client),
              Details: code + '-0000',
              info: Details || 'Old Balance',
              date,
              time,
              Acc: 'Cr',
              Ref,
              branch: Acc_key.branch
            },
            {
              User: UserName,
              Account: ObjectID(Receivable),
              Amount: parseFloat(Amount),
              AmountType: CashBase,
              Description: ObjectID(client),
              Details: code + '-0000',
              info: Details || 'Old Balance',
              date,
              time,
              Acc: 'Dr',
              Ref,
              branch: Acc_key.branch
            }
          ];
          insertMany(AccessDB, EntryBook, tranArray).then(() => {
            // console.log(Ref);
            resolve(Ref);
          });
        });
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function AccountID(Accounts, AccountName) {
  return Accounts.find(acc => acc.AccountName === AccountName)._id;
}

module.exports = router;

function ClientSchema(Client) {
  try {
    const schema = Joi.object({
      Name: Joi.string().required(),
      phone: Joi.string().required(),
      Amount: Joi.number(),
      date: Joi.date().required(),
      time: Joi.string().required()
    });

    return schema.validate(Client);
  } catch (error) {
    console.log(error);
    return error;
  }
}
