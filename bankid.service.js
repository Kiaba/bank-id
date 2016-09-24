'use strict';

var url = require('url');
var request = require('request');

var config = require('./bankid.config');

exports.account = function (options, callback) {
  return request.post({
    'url': url.format({
      protocol: options.protocol,
      hostname: options.host,
      pathname: '/ResourceService/checked/data'
    }),
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + options.params.access_token + ', Id ' + options.params.client_id,
      'Accept': 'application/json'
    },
    json: true,
    body: {
      "type": "physical",
      "fields": ["firstName", "middleName", "lastName", "phone", "inn", "clId", "clIdText", "birthDay","email"],
      "addresses":[
        {
          "type":"factual",
          "fields":["country","state","area","city","street","houseNo","flatNo","dateModification"]
        },
        {
          "type":"birth",
          "fields":["country","state","area","city","street","houseNo","flatNo","dateModification"]
        }
      ],
      "documents": [
        {
          "type": "passport",
          "fields": ["series", "number", "issue", "dateIssue", "dateExpiration", "issueCountryIso2"]
        }
      ],
      "scans": [
        {
          "type": "passport",
          "fields": ["link", "dateCreate", "extension"]
        },
        {
          "type": "zpassport",
          "fields": ["link", "dateCreate", "extension"]
        }
      ]
    }
  }, function (error, response, body) {
    callback(error, response, body);
  });
};

exports.getAccessOptions = function () {
	var options = {
		protocol: config.access.protocol,
		host: config.access.host,
		client_id: config.client_id,
		client_secret: config.client_secret
	};

	return options;
};


exports.getResourceOptions = function () {
	var options = {
		protocol: config.resource.protocol,
		host: config.resource.host,
		client_id: config.client_id,
		client_secret: config.client_secret
	};

	return options;
};
