const express = require('express');
const router = express.Router();
const Joi = require('joi');
const date = require('date-and-time');
const query = require('../../models/Query/comanQuery');
// const { Current } = require('@models/dateGenerator');
const { BranchAccounts, Category, Extract } = require('../../models/util');

const { maldah, MainDB: DBName } = require('../../config/keys');
// const { verifyToken } = require("../../auth");
router.use((req, res, next) => {
  // console.log("testing");
  if (process.env.NODE_ENV !== 'production') next();
  else res.sendStatus(404);
});

// all route names
const collName1 = 'Companies';
const collName2 = 'Users';
const collName3 = 'Branches';
const collName4 = 'EntryBook';

router.get('/', (req, res) => {
  console.log(req.query);
  res.setHeader('Content-Range', '0-9/9');
  res.send([]);
});

router.post('/', (req, res) => {
  const NewComp = req.body;
  const { error } = AccountSchema(NewComp);
  // console.table(BranchAccounts());
  // console.log(NewComp);
  let BranchArray = ['country', 'city'];
  let comArray = ['domain', 'manager', 'compPhone'];
  if (!error) {
    let isExist = {
      comp: {
        $or: [
          { compName: NewComp.compName.toUpperCase() },
          { compPhone: NewComp.compPhone }
        ]
      },
      user: {
        _id: NewComp.UserName.toUpperCase()
      }
    };
    query.findWithKey(DBName, collName1, isExist.comp).then(comp => {
      query.findWithKey(DBName, collName2, isExist.user).then(usr => {
        if (usr || comp) {
          let response = {};
          if (usr) response = { UserName: usr._id };
          if (comp) {
            if (comp.compName === NewComp.compName.toUpperCase())
              response['compName'] = comp.compName;
            if (comp.compPhone === NewComp.compPhone)
              response['compPhone'] = comp.compPhone;
          }
          res.status(409).send(response);
          return;
        }

        query.AccountNumber(DBName, collName1, '_id', 99).then(Account => {
          maldah.CryptPassowrd(NewComp.password).then(async hash => {
            let [prefix] = NewComp.compName.split(' ');
            let ClientDB = `${prefix}_${NewComp.compPhone}`;

            const COMPANY = {
              _id: Number(Account) + 1,
              compName: NewComp.compName.toUpperCase(),
              ...Extract(NewComp, comArray),
              DB_Name: ClientDB,

              appParColor: '#ffa726',
              sideColor: '#ffa726',
              textColor: 'black',
              title: NewComp.compName.toUpperCase(),
              duration: 500,

              created: date.format(new Date(), 'YYYY/MM/DD'),
              Active: 1
            };
            // console.log(COMPANY);
            const BRANCH = {
              _id: `${Number(Account) + 1}-100`,
              BranchName: NewComp.branch.toUpperCase(),
              phone: NewComp.brnchPhone,
              ...Extract(NewComp, BranchArray),
              CashBase: 'KES',
              appParColor: '#0D142B',
              sideColor: '#0D142B',
              textColor: '#ffa726',
              Active: 1
            };
            const USER = {
              _id: NewComp.UserName.toUpperCase(),
              Password: hash,
              UserType: 'HQ-Admin',
              UserBranch: 'SUPER ADMIN',
              Company: COMPANY._id,
              FullName: NewComp.manager
            };
            try {
              await query.insertOne(DBName, collName1, COMPANY);
              await query.insertOne(DBName, collName2, USER);
              query
                .insertOne(ClientDB, collName3, BRANCH)
                .then(({ insertedId }) => {
                  query
                    .insertMany(ClientDB, 'MainAccounts', MainAccount())
                    .then(() => {
                      query
                        .insertMany(ClientDB, 'AccountCategory', Category())
                        .then(() => {
                          query
                            .insertMany(
                              ClientDB,
                              'cashTypes',
                              CahsTypes(insertedId)
                            )
                            .then(() => {
                              query
                                .insertMany(
                                  ClientDB,
                                  'Acounts',
                                  CreatAccounts(insertedId)
                                )
                                .then(() => {
                                  res.sendStatus(201);
                                });
                            });
                        });
                    });
                });
              // res.sendStatus(201);
            } catch (error) {
              console.log(error);
              res.sendStatus(500);
            }
          });
        });
      });
    });
  } else res.status(400).send(error.details[0].message);
});

function AccountSchema(Account) {
  const schema = Joi.object({
    compName: Joi.string().required(),
    domain: Joi.string().required(),
    compPhone: Joi.string().min(7).required(),
    brnchPhone: Joi.string().min(7).required(),
    manager: Joi.string().required(),
    branch: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    UserName: Joi.string().required(),
    password: Joi.string().required()
  });

  return schema.validate(Account);
}

function CahsTypes(branch) {
  return [
    {
      _id: 'KES-' + branch,
      CashCode: 'KES',
      CashName: 'Kenya Shillings',
      CashSypol: 'Ksh',
      branch: branch
    },
    {
      _id: 'USD-' + branch,
      CashCode: 'USD',
      CashName: 'United States Dollar',
      CashSypol: '$',
      branch: branch
    }
    // {
    //   _id: 'EAD',
    //   CashName: 'United Arab Emirates dirham',
    //   CashSypol: 'د.إ'
    // },
    // {
    //   _id: 'EUR',
    //   CashName: 'Euro',
    //   CashSypol: '€'
    // },
    // {
    //   _id: 'GBP',
    //   CashName: 'Pound Sterling',
    //   CashSypol: '£'
    // },
    // {
    //   _id: 'TRY',
    //   CashName: 'Turkish lira',
    //   CashSypol: '₺'
    // },
    // {
    //   _id: 'JPY',
    //   CashName: 'Japanese yen',
    //   CashSypol: '¥'
    // },
    // {
    //   _id: 'CNY',
    //   CashName: 'China Yen',
    //   CashSypol: '¥'
    // }
  ];
}

function CreatAccounts(branch) {
  return [...compAccount(), ...BranchAccounts(branch)];
}
function compAccount() {
  return [
    {
      AccountType: 1,
      AccountName: 'Cash',
      branch: 'company'
    },
    {
      AccountType: 5,
      AccountName: 'Capital',
      branch: 'company'
    },
    {
      AccountType: 2,
      AccountName: 'Qaasas',
      branch: 'company'
    },

    {
      AccountType: 7,
      AccountName: 'Personal Saving',
      branch: 'company'
    }
  ];
}

function MainAccount() {
  return [
    { _id: 1, Account: 'Assets', Acc: 'Dr' },
    { _id: 2, Account: 'Liabilities', Acc: 'Cr' },
    { _id: 3, Account: 'Capital', Acc: 'Cr' },
    { _id: 4, Account: 'Withdrawal', Acc: 'Cr' },
    { _id: 5, Account: 'Expenses', Acc: 'Dr' },
    { _id: 6, Account: 'Revenue', Acc: 'Cr' }
    // { _id: 7, Account: 'Discount' }
  ];
}

module.exports = router;
