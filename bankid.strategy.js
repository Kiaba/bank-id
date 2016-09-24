'use strict';

var OAuth2Strategy = require('passport-oauth2');
var url = require('url');

var BankIDService = require('./bankid.service');

var config = require('./bankid.config');

var BankIDStrategy = function() {
};

BankIDStrategy.prototype = new OAuth2Strategy({
  authorizationURL: url.format({
    protocol: config.access.protocol,
    hostname: config.access.host,
    pathname: '/DataAccessService/das/authorize'
  }),
  tokenURL: url.format({
    protocol: config.access.protocol,
    hostname: config.access.host,
    pathname: '/DataAccessService/oauth/token'
  }),
  clientID: config.client_id,
  clientSecret: config.client_secret
}, function (accessToken, refreshToken, subject, done) {
  done(null, subject, {
    accessToken: accessToken,
    refreshToken: refreshToken
  });
});

BankIDStrategy.prototype.authorizationParams = function (options) {
  return {};
};

BankIDStrategy.prototype.tokenParams = function (options) {
  var unhashed = config.client_id + config.client_secret + options.code;
  
  var params = {};
  Object.defineProperty(params, 'client_secret', {
    value: require('crypto').createHash('sha1').update(unhashed).digest('hex'),
    writable : false,
    enumerable : true,
    configurable : false
  });
  return params;
};

BankIDStrategy.prototype.userProfile = function(accessToken, done){
  var async = require('async');
  return async.waterfall([
    function(callback) {
      var options = BankIDService.getResourceOptions();
      options.params = {
        access_token: accessToken,
        client_id: config.client_id
      }
      return BankIDService.account(options, function (error, response, body) {
        callback(error, body);
      });
    }
  ], function (error, result) {
    done(error, result);
  });
}

module.exports = BankIDStrategy;