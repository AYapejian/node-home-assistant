'use strict';
const axios = require('axios');
const utils = require('./utils');
const debug = require('debug')('home-assistant:api');

class HaApi {
    constructor(config) {
        this.config     = config;

        const apiOpts   = { baseURL: config.baseUrl + '/api' };
        apiOpts.headers = (config.apiPass)
            ? { 'x-ha-access': config.apiPass }
            : {};

        this.client = axios.create(apiOpts);
    }

    callService(domain, service, data) {
        return this._post(`/services/${domain}/${service}`, data);
    }

    getServices() {
        return this._get('services');
    }

    getEvents() {
        return this._get('events');
    }

    getStates (entity_id, { include, exclude } = {}) {
        const path = (entity_id) ? `states/${entity_id}` : 'states';

        return this._get(path)
            .then(states => {
                // If passing in an entity_id will only have one result, just return formatted
                if (!states.length) { return { [states.entity_id]: states }  }

                return states.reduce((acc, state) => {
                    if (utils.shouldInclude(state.entity_id, include, exclude)) {
                        acc[state.entity_id] = state;
                    }
                    return acc;
                }, {});
            });
    }

    getEntities(entity_id, { include, exclude } = {}) {
        return this.getStates(entity_id, { include, exclude })
            .then(states => {
                const entities = Object.keys(states);

                return entities.sort()
            });
    }

    getHistory(timestamp, filterEntityId, endTimestamp, { include, exclude, flatten } = {}) {
        let path = 'history/period';

        if (timestamp) { path = path + `/${timestamp}`; }
        let params = {};
        if (filterEntityId) { params.filter_entity_id = filterEntityId;  }
        if (endTimestamp)   { params.end_time = endTimestamp;            }

        // History returns an array for each entity_id and that array containes objects for each history item
        return this._get(path, params)
            .then(result => {
                if (!include && !exclude && !flatten) { return result; }

                // Filter out results by regex, include/exclude should already be an instance of RegEx
                if (include || exclude) {
                    result = result.reduce((acc, entityArr) => {
                        const entityId = (entityArr && entityArr.length > 0) ? entityArr[0].entity_id : null;

                        if (entityId && utils.shouldInclude(entityId, include, exclude)) { acc.push(entityArr); }
                        return acc;
                    }, []);
                }

                // Instead of returning the data from home assistant ( array for each entity_id ) return one flattened array
                // of one item per history entry
                if (flatten) {
                    result = result
                        .reduce((acc, entityArray) => {
                            acc = acc.concat(entityArray);
                            return acc;
                        }, [])
                        .sort((a,b) => {
                            if (a.last_updated < b.last_updated) { return -1; }
                            if (a.last_updated > b.last_updated) { return 1; }
                            return 0;
                        });
                }

                return result;
            });
    }

    getConfig(){
        return this._get('config');
    }
    getDiscoveryInfo(){
        return this._get('discovery_info');
    }
    getErrorLog(){
        return this._get('error_log');
    }
    // TODO: Test, entity_id should be `camera.some_cam_entity`
    getCameraImage(cameraEntityId) {
        return this._get(`camera_proxy/${cameraEntityId}`);
    }

    renderTemplate(templateString) {
        return this._post('template', { template: templateString });
    }

    _post(path, data = {}) {
        debug(`POST: ${this.config.baseUrl}/${path}`);

        return this.client.post(path, data)
            .then(res => res.data || res)
            .catch(err => {
                debug(`POST: request errror: ${err.toString()}`);
                throw err;
            });
    }

    _get(path, params = {}) {
        debug(`GET: ${this.config.baseUrl}/${path}`);

        return this.client.request({ url: path, params: params })
            .then(res => res.data || res)
            .catch(err => {
                debug(`GET: request errror: ${err.toString()}`);
                throw err;
            });
    }
}

module.exports = HaApi;
