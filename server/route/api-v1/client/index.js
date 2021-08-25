const express = require('express');
const { verifyToken } = require('../../../auth');
const {
  insertOne,
  findAll,
  findOneData
} = require('../../../models/Query/comanQuery');
const router = express.Router();

router.use(verifyToken);

//Collection Names
const CollOrder = 'OrdersList';
const collClient = 'Client';

router.get('/', (req, res) => {
  const { AccessDB, branchID } = req.headers.user;

  findAll(AccessDB, collClient, { branch: branchID })
    .then(datas => {
      res.send(datas);
    })
    .catch(er => {
      res.send(er.message);
    });
});

router.get('/:number', async (req, res) => {
  try {
    const { AccessDB, branchID } = req.headers.user;

    // console.log('req pramas', req.params.number);

    const filterKey = {
      branch: branchID,
      number: parseInt(req.params.number)
    };

    // console.log('filterKey', filterKey);

    const Clientdata = await findOneData(AccessDB, collClient, filterKey);
    const [Orderdata] = await findAll(
      AccessDB,
      CollOrder,
      {
        branch: branchID,
        clientId: Clientdata._id
      },
      {},
      { Date: -1 }
    );

    // console.log('getClient', Clientdata);
    // console.log('Orderdata', Orderdata);
    const data = {
      balance: Orderdata.balance ? Orderdata.balance : 0,
      ...Clientdata
    };
    // console.log('Data', data);
    res.send(data);
  } catch (err) {
    res.send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  try {
    const result = await insertOne(AccessDB, collClient, {
      ...req.body,
      branch: branchID
    });
    const data = result.ops[0];
    res.send(data);
  } catch (ex) {
    res.send(ex.message);
    console(ex);
  }
});

module.exports = router;
