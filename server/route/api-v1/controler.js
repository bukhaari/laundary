const express = require('express');
const router = express.Router();

const accounts = require(`./accounts`);
const login = require(`../login`);
const User = require(`./user`);
const branches = require(`./branches`);
const services = require(`./services`);
const employees = require(`../api-v1/branches/Employees`);
const newOrder = require(`./newOrder`);
const client = require(`./client`);

router.use('/login', login);
router.use('/users', User);
router.use('/branches', branches);
router.use('/service', services);
router.use('/employees', employees);
router.use('/orderList', newOrder);
router.use('/client', client);

router.use(`/newBusiness`, accounts);

module.exports = router;
