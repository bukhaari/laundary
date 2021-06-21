const bcrypt = require('bcryptjs');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

function CryptPassowrd(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (!err) {
        bcrypt.hash(password, salt, (error, hash) => {
          if (!error) resolve(hash);
          else reject(error);
        });
      } else reject(err);
    });
  });
}

function DecryptPassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, same) => {
      // console.log(same);
      if (!err) resolve(same);
      else reject(err);
    });
  });
}
module.exports = {
  conString: process.env.ConnURL,
  jsonSecret: process.env.SecretKey,
  MainDB: 'LAUNDRY',
  PORT: process.env.PORT,
  maldah: {
    CryptPassowrd,
    DecryptPassword
  }
};
