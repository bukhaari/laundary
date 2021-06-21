function generateMultJoinKey(obj) {
  try {
    const { joinkeys, cond } = obj;
    const localeFild = joinkeys.reduce((allKeys, { locale, localVar }) => {
      allKeys[`key${locale.toLowerCase()}`] = `$${locale}`;
      if (localVar) allKeys[`key${localVar.toLowerCase()}`] = `$${localVar}`;
      return allKeys;
    }, {});
    // console.log(localeFild);
    const condition = joinkeys.map(({ locale, foreignKey }) => ({
      $eq: [`$${foreignKey}`, `$$key${locale.toLowerCase()}`]
    }));
    // console.log(condition);
    // console.log(localeFild);
    const JoinKey = { [cond ? cond : '$and']: condition };
    return {
      localeFild,
      JoinKey
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function MultiKeyJoinObj({
  collection,
  marge,
  project,
  pipe,
  hasKey,
  ...JoinObj
}) {
  try {
    const { localeFild, JoinKey } = generateMultJoinKey(JoinObj);
    let match = {
      $expr: { ...JoinKey }
    };
    if (typeof hasKey === 'object')
      match = {
        ...match,
        ...hasKey
      };
    const pipeline = [{ $match: match }];
    // console.log({ ...JoinKey });
    // console.log(localeFild);
    if (pipe && pipe.length) pipeline.push(...pipe);
    if (project) pipeline.push({ $project: project });
    const joinArray = [
      {
        $lookup: {
          from: collection,
          let: localeFild,
          pipeline,
          as: collection
        }
      }
    ];
    if (marge) joinArray.push(MargeJoindedColl(collection));
    return joinArray;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function MargeJoindedColl(JoinArray) {
  try {
    return {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: [`$${JoinArray}`, 0] }, '$$ROOT']
        }
      }
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
function GroupAggre(GroupID = null, Computed, project = null) {
  const groupArray = [
    {
      $group: {
        _id: typeof GroupID == 'object' ? { ...GroupID } : GroupID,
        ...Computed
      }
    }
  ];
  if (project) groupArray.push(project);
  return groupArray;
}

module.exports = {
  MultiKeyJoinObj,
  MargeJoindedColl,
  GroupAggre
};
