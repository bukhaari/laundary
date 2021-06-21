var jwt = require('jsonwebtoken');
const { jsonSecret } = require('./config/keys');

// const collName = 'Users';
// const dbName = 'xisabhaye';

function verifyToken(req, res, next) {
  // console.log(req.headers['athorization']);
  let headerData = req.headers['athorization'];
  // console.log(headerData);
  // console.log('----------------------');
  jwt.verify(headerData, jsonSecret, (err, dec) => {
    // console.log(err);
    if (err) res.sendStatus(401);
    else {
      // console.log(dec);
      req.headers['user'] = {
        AccessDB: dec.Access,
        UserName: dec._id,
        UserType: dec.UserType,
        Company: dec.Company,
        branchID: dec.branchID,
        CashBase: dec.CashBase
      };

      next();
    }
  });
  // next()
}
function isHQAdmin(req, res, next) {
  // console.log(req.headers.user);
  let user = req.headers.user;
  if (user.UserType == 'HQ-Admin') next();
  else res.sendStatus(412);
}
function isAdmin(req, res, next) {
  // console.log('-------------------------------');
  // console.log(req.headers.user);
  // console.log('-------------------------------');
  let user = req.headers.user;
  if (user.UserType == 'Admin') next();
  else res.sendStatus(412);
}
module.exports = {
  verifyToken,
  isHQAdmin,
  isAdmin
};
