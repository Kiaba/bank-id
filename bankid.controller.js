'use strict';

var passport = require('passport');

exports.index = function(req, res, next) {
  var query = req.query;
  return passport.authenticate('oauth2', {
    callbackURL: '/api/bankid/callback?redirect_uri=' + query.redirect_uri
  })(req, res, next);
};

exports.callback = function(req, res, next) {
  var query = req.query;
  return passport.authenticate('oauth2', {
    code: query.code,
    callbackURL: '/api/bankid/callback?redirect_uri=' + query.redirect_uri
  }, function (err, result, info) {
    req.session.user = result.customer;
    res.redirect(query.redirect_uri);
  })(req, res, next);
};