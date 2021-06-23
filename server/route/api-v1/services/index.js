const express = require('express');
const { verifyToken } = require('../../../auth');
const { insertOne, findAll } = require('../../../models/Query/comanQuery');
const router = express.Router();

router.use(verifyToken);

//Collection Name
const AccessColl = 'Services';

router.get('/', (req, res) => {
  const { AccessDB, branchID } = req.headers.user;

  findAll(AccessDB, AccessColl, { branch: branchID })
    .then(datas => {
      res.send(datas);
    })
    .catch(er => {
      res.send(er.message);
    });
});

router.post('/', async (req, res) => {
  const { AccessDB, branchID } = req.headers.user;
  try {
    const result = await insertOne(AccessDB, AccessColl, {
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
