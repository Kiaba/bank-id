'use strict';

var express = require('express');
var passport = require('passport');

var BankIDController = require('./bankid.controller');
var BankIDStrategy = require('./bankid.strategy');

var router = express.Router();

passport.use(new BankIDStrategy());

router.get('/api/bankid/', BankIDController.index);
router.get('/api/bankid/callback', BankIDController.callback);

module.exports = router;