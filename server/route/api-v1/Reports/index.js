const express = require('express');
// const { DeleteMany, Aggregate } = require('@models/comanQuery');

const { verifyToken } = require('@auth');

const DelRoute = require('./Delete/delete');
const SalesReport = require('./Sales/sales');
const Debtors = require('./Debtors/debts');
const CashFlow = require('./cashes/cashflow');
const expense = require('./Expense');
const Statement = require('./Statements');

const router = express.Router();

router.use(verifyToken);

router.use('/deleteRef', DelRoute);
router.use('/sales', SalesReport);
router.use('/debtors', Debtors);
router.use('/cash', CashFlow);
router.use('/expense', expense);
router.use('/statement', Statement);

module.exports = router;
