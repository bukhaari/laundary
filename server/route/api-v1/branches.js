const express = require('express');
const query = require('../../models/Query/comanQuery');
const { MainDB: mainDB } = require('../../config/keys');
const Joi = require('joi');

const { BranchAccounts, Extract } = require('../../models/util');
const { verifyToken /* isHQAdmin */ } = require('../../auth');
const { ObjectID } = require('mongodb');
const router = express.Router();

// all route names
const collName = 'Branches';
// const mainDB = 'Xawala';
const AccountColl = 'Acounts';
const CashColl = 'cashTypes';
const Companies = 'Companies';
router.use(verifyToken);
// router.use(isHQAdmin);

// Get All customers
router.get(`/`, (req, res) => {
  // console.log(req.headers.user);
  // console.log(req.params);
  // console.log(req.query);
  // res.sendStatus(500);
  // return;
  let { sort } = req.query;
  const BranchKey = {
    Active: 1
  };
  const { AccessDB } = req.headers.user;

  query.findAll(AccessDB, collName, BranchKey, { sort }).then(result => {
    res.send(result);
  });
});

//Post new Cush type

router.post(`/`, (req, res) => {
  // console.log(req.body);

  try {
    let { AccessDB, Company } = req.headers.user;
    // console.log(req.body);
    // res.sendStatus(500);
    // return;
    // console.log(Company);
    const { error } = BranchSchema(req.body);
    if (error) {
      console.log(error);
      res.status(400).send(error.details[0].message);
      return;
    }
    let BranchInfo = {
      ...Extract(req.body, [
        'BranchName',
        'phone',
        'appParColor',
        'sideColor',
        'textColor',
        'CashBase',
        'country',
        'city'
      ]),
      BranchName: req.body.BranchName.toUpperCase(),
      Active: 1
    };

    let B_Key = { BranchName: new RegExp(`^${req.body.BranchName}$`, 'i') };

    query.findWithKey(AccessDB, collName, B_Key).then(brch => {
      if (brch) {
        res.status(409).send({
          BranchName: `${req.body.BranchName} is already registered.`
        });
        //   return;
      } else {
        query
          .AccountNumber(AccessDB, collName, '_id', 99)
          .then(async account => {
            // console.log(Com);

            // Com.AccountNumber
            //   account.split

            // console.log(account);
            let Numbers = isNaN(account) ? account.split('-') : [account];

            //   BranchInfo.Account = Number(account) + 1;
            if (Numbers.length == 2)
              BranchInfo._id = `${Company}-${Number(Numbers[1]) + 1}`;
            else BranchInfo._id = `${Company}-${Number(Numbers[0]) + 1}`;

            // console.log(BranchInfo);
            // res.sendStatus(500);
            // return;

            query
              .insertOne(AccessDB, collName, BranchInfo)
              .then(({ insertedId }) => {
                query
                  .insertMany(AccessDB, AccountColl, BranchAccounts(insertedId))
                  .then(() => {
                    const branchCash = req.body.branchCash.map(cash => ({
                      _id: `${cash.CashCode}-${insertedId}`,
                      ...cash,
                      branch: insertedId
                    }));
                    query
                      .insertMany(AccessDB, CashColl, branchCash)
                      .then(() => {
                        res.send(BranchInfo);
                      });
                  });
              });
          });
      }
    });
  } catch (error) {
    console.log(error);
  }
});



//update Customer Info
router.put(`/`, (req, res) => {
  // console.log(req.body);
  // res.sendStatus(500);
  // return;
  let { AccessDB } = req.headers.user;
  let B_Key = {
    BranchName: new RegExp(`^${req.body.BranchName}$`, 'i'),
    _id: { $ne: req.body._id }
  };
  query.findWithKey(AccessDB, collName, B_Key).then(brch => {
    if (brch) {
      res.status(409).send({
        BranchName: true
      });
      return;
    }
    let BranchInfo = {
      ...req.body,
      BranchName: req.body.BranchName.toUpperCase()
    };
    delete BranchInfo._id;
    query
      .updateOne(AccessDB, collName, { _id: req.body._id }, BranchInfo, false)
      .then(() => {
        res.send(req.body);
      });
  });

  // res.send('put Request');
});

function BranchSchema(Account) {
  const schema = Joi.object({
    BranchName: Joi.string().required(),
    phone: Joi.required(),
    CashBase: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    appParColor: Joi.string().required(),
    sideColor: Joi.string().required(),
    textColor: Joi.string().required(),
    branchCash: Joi.array().required()
  });

  return schema.validate(Account);
}

// eslint-disable-next-line no-unused-vars
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
