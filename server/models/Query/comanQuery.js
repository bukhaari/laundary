const { DB_Collection, clientDB } = require('../Connection');

function CreateCollections(DB_Name, collName, option = {}) {
  return new Promise((resolve, reject) => {
    clientDB
      .db(DB_Name)
      .createCollection(collName, option)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}
function insertUsingTransaction(col1, col2, DB_Name) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      // async () => {
      const session = clientDB.startSession({
        defaultTransactionOptions: {
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
          readPreference: 'primary'
        }
      });

      await session.withTransaction(async function () {
        const collection1 = client.db(DB_Name).collection(col1.collectionName);
        const collection2 = client.db(DB_Name).collection(col2.collectionName);

        // Important:: You must pass the session to the operations.
        await collection1.insertOne(col1.doc, { session });

        // console.log(result);
        // Important:: You must pass the session to the operations.
        let val = await collection2.insertOne(col2.doc, { session });
        // console.log(val);
        resolve(val.ops);
      });
      // }
      // console.log('transaction Fuction');
    } catch (error) {
      console.log('transaction Error');
      //  throw(error)
      reject(error);
    }
  });
}

async function CreateIndex(dbName, collectionName, index) {
  let newIDex = await DB_Collection(dbName, collectionName);
  return new Promise((resolve, reject) => {
    newIDex.createIndex(index, (error, result) => {
      if (!error) {
        resolve(result);
        // console.log(result);
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}

function insertMany(dbName, collectionName, data) {
  // console.log(dbName);
  return new Promise((resolve, reject) => {
    DB_Collection(dbName, collectionName)
      .then(ins => {
        ins.insertMany(data, (err, val) => {
          if (!err) {
            resolve(val);
          } else {
            reject(err);
          }
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

function FindDelete(dbName, collectionName, key) {
  return new Promise((resolve, reject) => {
    DB_Collection(dbName, collectionName)
      .then(findDell => {
        findDell.findOneAndDelete(key, (err, result) => {
          if (!err) {
            resolve(result);
          } else reject(err);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}
function updateOne(dbName, collectionName, key, data, insert = true) {
  // console.log(key);
  // console.log(data);
  return new Promise((resolve, reject) => {
    DB_Collection(dbName, collectionName)
      .then(update => {
        update
          .findOneAndUpdate(key, { $set: { ...data } }, { upsert: insert })
          .then(result => {
            resolve(result);
            // console.log(update);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
}
function updateMany(dbName, collectionName, key, data, insert = false) {
  // console.log(key);
  // console.log(data);
  return new Promise((resolve, reject) => {
    DB_Collection(dbName, collectionName)
      .then(update => {
        update
          .updateMany(
            key,
            { $set: { ...data } },
            { returnOriginal: false, upsert: insert }
          )
          .then(result => {
            resolve(result);
            // console.log(update);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
}

function findAll(db_Name, collectionName, key = {}, options = {}) {
  return new Promise((resolve, reject) => {
    // console.log(db_Name, collectionName, key);
    DB_Collection(db_Name, collectionName)
      .then(find => {
        find.find(key, options).toArray((err, doc) => {
          if (!err) resolve(doc || []);
          else reject(err);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}
function findWithKey(DB_Name, collectionName, key) {
  try {
    return new Promise((resolve, reject) => {
      // console.log(key);
      DB_Collection(DB_Name, collectionName)
        .then(find => {
          find
            .findOne(key)
            .then(doc => {
              // console.log(doc);
              resolve(doc);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function findJoined_WithKey(Obj) {
  return new Promise((resolve, reject) => {
    // console.log(key);
    let {
      DB_Name,
      Base_Coll,
      Join_Coll,
      localField,
      foreignField,
      as,
      project,
      key
    } = Obj;
    try {
      DB_Collection(DB_Name, Base_Coll)
        .then(join => {
          join
            .aggregate([
              { $match: key },
              {
                $lookup: {
                  from: Join_Coll,
                  localField, // field in the orders collection
                  foreignField, // field in the items collection
                  as
                }
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [{ $arrayElemAt: [`$${as}`, 0] }, '$$ROOT']
                  }
                }
              },
              { $project: { ...project } }
            ])
            .toArray((err, result) => {
              if (!err) resolve(result);
              else reject(err);
            });
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
}

function insertOne(DB_Name, collectionName, data) {
  // console.log(data);
  return new Promise((resolve, reject) => {
    DB_Collection(DB_Name, collectionName)
      .then(ins => {
        ins.insertOne(data, (err, val) => {
          if (!err) {
            resolve(val);
            // console.log(val);
          } else {
            reject(err);
          }
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

function AccountNumber(
  DB_Name,
  collectionName,
  Account = 'AccountNumber',
  base = 100,
  key = null
) {
  return new Promise((resolve, reject) => {
    try {
      const AggreArray = [];
      if (key && typeof key == 'object') {
        AggreArray.push({
          $match: key
        });
      }
      // console.log(Account);
      // console.log('---------------------------');

      AggreArray.push({
        $group: {
          _id: null,
          AccountNumber: { $max: `$${Account}` }
        }
      });
      DB_Collection(DB_Name, collectionName)
        .then(find => {
          find.aggregate(AggreArray).toArray((err, result) => {
            let [val] = result;
            if (val && val.AccountNumber) resolve(val.AccountNumber);
            else resolve(base);
          });
        })
        .catch(error => {
          reject(error);
        });

      // console.log(result);
    } catch (error) {
      reject(error);
    }
  });
}

function MaxStringVal(
  DB_Name,
  collectionName,
  Account = 'AccountNumber',
  base = 100,
  key = null,
  splitInx = 1,
  splitChar = '-'
) {
  return new Promise((resolve, reject) => {
    try {
      const AggreArray = [];
      if (key && typeof key == 'object') {
        AggreArray.push({
          $match: key
        });
      }
      // console.log(Account);
      // console.log('---------------------------');

      AggreArray.push({
        $group: {
          _id: null,
          // AccountNumber: { $max: `$${Account}` }
          AccountNumber: {
            $max: {
              $toInt: {
                $arrayElemAt: [
                  {
                    $split: [`$${Account}`, splitChar]
                  },
                  splitInx
                ]
              }
            }
          }
        }
      });
      DB_Collection(DB_Name, collectionName)
        .then(find => {
          // find
          //   .findOne({ $query: { ...key }, $orderby: { Date: -1 } })
          //   .then(val => {
          //     console.log('----------------------');
          //     console.log(val);
          //   });
          find.aggregate(AggreArray).toArray((err, result) => {
            let [val] = result;
            // console.log(result);
            // console.log('----------------------');
            // console.log(val);
            if (val && val.AccountNumber) resolve(val.AccountNumber);
            else resolve(base);
          });
        })
        .catch(error => {
          reject(error);
        });

      // console.log(result);
    } catch (error) {
      reject(error);
    }
  });
}

function BulkWrite(DB_Name, collection, data) {
  return new Promise((resolve, reject) => {
    if (!data.length) {
      resolve('No Data');
      return;
    }
    DB_Collection(DB_Name, collection)
      .then(bulk => {
        bulk.bulkWrite(data, (err, val) => {
          if (!err) {
            resolve(val);
          } else {
            reject(err);
          }
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

function Aggregate(DB_Name, collectionName, AggreArray) {
  return new Promise((resolve, reject) => {
    try {
      DB_Collection(DB_Name, collectionName)
        .then(find => {
          find.aggregate(AggreArray).toArray((err, result) => {
            // console.log(result);
            resolve(result || []);
          });
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });

      // console.log(result);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function DeleteMany(dbName, collectionName, key) {
  return new Promise((resolve, reject) => {
    DB_Collection(dbName, collectionName)
      .then(deleteAll => {
        deleteAll.deleteMany(key, (err, result) => {
          if (!err) {
            resolve(result);
          } else reject(err);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

const findOneAndUpdateData = async (
  dbName,
  collectionName,
  data,
  filterKey
) => {
  const datas = await DB_Collection(dbName, collectionName);

  await datas.findOneAndUpdate(filterKey, [{ $set: data }], {
    returnNewDocument: true
  });

  return await datas.findOne(filterKey);
};

// const updateOneData = async (dbName, collectionName, data, filterKey) => {
//   const datas = await DB_Collection(dbName, collectionName);
//   return datas.updateOne(filterKey, { $set: data });
// };

module.exports = {
  BulkWrite,
  findJoined_WithKey,
  DeleteMany,
  Aggregate,
  FindDelete,
  AccountNumber,
  MaxStringVal,
  updateOne,
  updateMany,
  findAll,
  insertOne,
  findWithKey,
  insertMany,
  insertUsingTransaction,
  CreateCollections,
  CreateIndex,
  findOneAndUpdateData
  // updateOneData
};
