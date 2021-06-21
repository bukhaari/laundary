const MongoClient = require('mongodb').MongoClient;
// const objecID = require("mongodb").ObjectID;
const { conString } = require('../../config/keys');
var client = {};
function clientDB() {
  return client;
}

async function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(conString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(con => {
        client = con;
        resolve('connected');
      })
      .catch(err => {
        // console.log(err);
        // process.exit(1);
        reject(err);
      });
  });
}
async function DB_Collection(DB_Name, collName) {
  // let client = await MongoClient.connect(conString, { useNewUrlParser: true })
  return client.db(DB_Name).collection(collName);
}

module.exports = {
  // objecID,
  DB_Collection,
  connect,
  clientDB
};
