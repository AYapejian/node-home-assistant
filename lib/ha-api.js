'use strict';
const axios = require('axios');
const debug     = require('debug')('home-assistant:api');

function HaApi(config) {
    if (! (this instanceof HaApi)) { return new HaApi(config); }
    debug('instantiating api interface');

    this.config    = config;
    const apiOpts = { baseURL: config.baseUrl + '/api' };
    apiOpts.headers = (config.apiPass)
        ? { 'x-ha-access': config.apiPass }
        : {};

    this.client = axios.create(apiOpts);
}

HaApi.prototype.getServices = function () { return this._get('services'); };
HaApi.prototype.getEvents   = function () { return this._get('events');   };

// Fetches states from home assistant and returns object
// with entity_id as keys for easier manipulation
HaApi.prototype.getStates   = function () {
    return this._get('states')
        .then(states => {
            return states.reduce((statesObj, state) => {
                statesObj[state.entity_id] = state;
                return statesObj;
            }, {});
        });
};

HaApi.prototype.callService = function(domain, service, data) {
    return this._post(`/services/${domain}/${service}`, data);
};

HaApi.prototype._post = function post(path, data = {}) {
    debug(`POST: ${this.config.baseUrl}/${path}`);

    return this.client.post(path, data)
        .then(res => res.data || res)
        .catch(err => {
            debug(`POST: request errror: ${err.toString()}`);
            throw err;
        });
};

HaApi.prototype._get = function (path) {
    debug(`GET: ${this.config.baseUrl}/${path}`);
    return this.client.get(path)
        .then(res => res.data || res)
        .catch(err => {
            debug(`GET: request errror: ${err.toString()}`);
            throw err;
        });
};

module.exports = HaApi;
