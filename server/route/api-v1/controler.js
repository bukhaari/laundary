const express = require('express');
const router = express.Router();

const accounts = require(`./accounts`);
const login = require(`../login`);
const User = require(`./user`);
const branches = require(`./branches`);
const services = require(`../api-v1/branches/services`);

router.use('/login', login);
router.use('/users', User);
router.use('/branches', branches);
router.use('/service', services);

router.use(`/newBusiness`, accounts);

module.exports = router;
