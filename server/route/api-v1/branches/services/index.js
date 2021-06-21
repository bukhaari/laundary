const express = require('express');
const { verifyToken } = require('../../../../auth');
const router = express.Router();

router.use(verifyToken);

router.post('/', (req, res) => {
  console.log(req.body);
  res.sendStatus(500);
});

module.exports = router;
