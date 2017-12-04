'use strict';
const HomeAssistant = require('../..');
const debug = require('debug')('home-assistant:cli');
const haClient = module.exports = {};

haClient.get = ({ url, password }, extraOpts = {}) => {
    debug('instantiating home assistant instance')

    return new HomeAssistant({
        baseUrl: url,
        apiPass: password
    }, extraOpts);
};
