'use strict';

module.exports = {
  version: '1.2.0',
  init: function (pluginContext) {
    const policy = require('./policies/micromart-cookie-jwt');
    pluginContext.registerPolicy(policy);
  }
};

