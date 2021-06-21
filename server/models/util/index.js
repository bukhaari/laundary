const { ObjectID } = require('mongodb');

function Extract(Obj, keys) {
  return keys.reduce((filterd, key) => {
    filterd[key] = Obj[key];
    return filterd;
  }, {});
}
function GenerateCode(Num, char, split = '-') {
  // console.log('Generate: ' + Num);
  if (Num === -1) return char + '-000' + Math.abs(Num);
  else {
    if (typeof Num === 'number') Num = `${char}-${Num}`;
    let [, seq, seq2] = Num.split(split);
    if (seq2) seq = seq2;
    // console.log('seq2', seq2);
    seq = Number(seq) + 1;

    // console.log(seq);
    if (seq < 10) return char + '-000' + seq;
    else if (seq < 100) return char + '-00' + seq;
    else if (seq < 1000) return char + '-0' + seq;
    else return char + '-' + seq;
  }
}
function GenerateCode2(Num, char, split = '-') {
  if (Num === 1) return char + '-0' + Num;
  else {
    if (typeof Num == 'number') Num = `${char}-${Num}`;
    let [, seq, seq2] = Num.split(split);
    if (seq2) seq = seq2;
    // console.log('seq2', seq2);
    seq = Number(seq) + 1;
    // console.log(seq);
    if (seq < 10) return char + '-0' + seq;
    else return char + '-' + seq;
  }
}
function BranchAccounts(branch) {
  return [
    {
      AccountType: 5,
      AccountName: 'Capital',
      branch: branch
    },
    {
      AccountType: 8,
      AccountName: 'Rent',
      branch: branch
    },
    {
      AccountType: 8,
      AccountName: 'Salary',
      branch: branch
    },
    {
      AccountType: 7,
      AccountName: 'Payable Expense',
      branch: branch
    },
    {
      AccountType: 4,
      AccountName: 'Advanced Eexpense',
      branch: branch
    },

    {
      AccountType: 1,
      AccountName: 'Cash',
      branch: branch
    },
    {
      AccountType: 1,
      AccountName: 'Mobile',
      branch: branch
    },
    {
      AccountType: 2,
      AccountName: 'Receivable Revenue',
      branch: branch
    },

    {
      AccountType: 9,
      AccountName: 'Revenue',
      branch: branch
    },
    {
      AccountType: 7,
      AccountName: 'Unearned Revenue',
      branch: branch
    },
    {
      AccountType: 13,
      AccountName: 'Discount',
      branch: branch
    }
  ];
}

function Category() {
  return [
    {
      _id: 1,
      AccountType: 1,
      category: 'Cash',
      CategName: 'OnHand'
    },
    {
      _id: 2,
      AccountType: 1,
      category: 'Account Receivable'
    },
    {
      _id: 3,
      AccountType: 1,
      category: 'Cash Bank',
      CategName: 'Bank'
    },

    {
      _id: 4,
      AccountType: 1,
      category: 'Prepaid'
    },
    {
      _id: 5,
      AccountType: 3,
      category: 'Owner Capital'
    },
    {
      _id: 6,
      AccountType: 4,
      category: 'Owners'
    },

    {
      _id: 7,
      AccountType: 2,
      category: 'Account payable'
    },
    {
      _id: 8,
      AccountType: 5,
      category: 'Fixed Expenses'
    },
    {
      _id: 9,
      AccountType: 6,
      category: 'Sales'
    },
    {
      _id: 13,
      AccountType: 5,
      category: 'Discount'
    },
    {
      _id: 14,
      AccountType: 5,
      category: 'Variable Expense'
    },
    {
      _id: 15,
      AccountType: 1,
      category: 'investment'
    }
  ];
}

module.exports = {
  Extract,
  GenerateCode,
  GenerateCode2,
  BranchAccounts,
  Category
};
