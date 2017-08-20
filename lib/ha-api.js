'use strict';
const axios = require('axios');
const debug = require('debug')('home-assistant:api');

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
HaApi.prototype.getStates   = function (entity_id) {
    const path = (entity_id)
        ? `states/${entity_id}`
        : 'states';

    return this._get(path)
        .then(states => {
            if (states && states.length > 0) {
                return states.reduce((statesObj, state) => {
                    statesObj[state.entity_id] = state;
                    return statesObj;
                }, {});
            }
            return states;
        });
};
HaApi.prototype.getConfig = function() { return this._get('config'); }
HaApi.prototype.getDiscoveryInfo = function() { return this._get('discovery_info'); }
HaApi.prototype.getBootstrap = function() { return this._get('bootstrap'); }
HaApi.prototype.getErrorLog = function() { return this._get('error_log'); }

// TODO: Test, entity_id should be `camera.some_cam_entity`
HaApi.prototype.getCameraImage = function(cameraEntityId) {
    return this._get(`camera_proxy/${cameraEntityId}`);
};

HaApi.prototype.renderTemplate = function(templateString) {
    return this._post('template', { template: templateString });
};

// http://localhost:8123/api/history/period/2016-12-29T00:00:00+02:00?filter_entity_id=sensor.temperature
HaApi.prototype.getHistory = function(timestamp, filterEntityId) {
    let path = 'history/period';
    if (timestamp) { path = path + `/${timestamp}`; }
    if (filterEntityId) { path = path + `?filter_entity_id=${filterEntityId}`; }
    return this._get(path);
}

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
