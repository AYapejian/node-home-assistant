'use strict';
const debug    = require('debug')('home-assistant');
const HaEvents = require('./ha-events');
const HaApi    = require('./ha-api');

const DEFAULTS = {
    baseUrl: 'http://localhost:8123',
    apiPass: null,
    api:     {},
    events:  {
        transport: 'sse',       // For future support of websockets
        retries:   {
            maxAttempts: 10,    // How many times to retry connection
            delay:       5000   // Delay this long before retry (in ms)
        }
    }
};

function HomeAssistant(config) {
    if (! (this instanceof HomeAssistant)) { return new HomeAssistant(config); }
    this.config    = Object.assign({}, DEFAULTS, config);

    this.events = new HaEvents(this.config);
    this.api    = new HaApi(this.config);
    this._init();
}

HomeAssistant.prototype._init = function () {
    // Get the initial state list
    // create state listener to watch events and keep local copy of updated states
    this.api.getStates()
        .then(states => (this.states = states))
        .then(() => this.events.on('ha_events:state_changed', (evt) => this._onStateChanged(evt)))
        .catch(debug);
    this.api.getServices()
        .then(services => (this.availableServices = services))
        .catch(debug);
    this.api.getEvents()
        .then(events => (this.availableEvents = events))
        .catch(debug);
};

HomeAssistant.prototype.getStates = function () {
    let currentStates = this.states
        ? Promise.resolve(this.states)
        : this.api.getStates();

    return currentStates
        .then(states => {
            this.states = states;
            return states;
        });
}

HomeAssistant.prototype.getServices = function () {
    let availableServices = this.availableServices
        ? Promise.resolve(this.availableServices)
        : this.api.getServices();

    return availableServices
        .then(services => {
            this.availableServices = services;
            return services;
        });
}

HomeAssistant.prototype.getEvents = function () {
    let availableEvents = this.availableEvents
        ? Promise.resolve(this.availableServices)
        : this.api.getEvents();

    return availableEvents
        .then(events => {
            this.availableEvents = events;
            return events;
        });
}

HomeAssistant.prototype._onStateChanged = function (changedEntity) {
    debug(`changedEntity: ${JSON.stringify(changedEntity)}`);
    const cachedEntity = this.states[changedEntity.entity_id];

    if (!cachedEntity) {
        debug('Got state changed event for entity that was not know, this should not happen');
    }
    this.states[changedEntity.entity_id] = changedEntity.event.new_state;
};
module.exports = HomeAssistant;
