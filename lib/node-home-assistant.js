const debug    = require('debug')('home-assistant');
const HaEvents = require('./ha-events');
const HaApi    = require('./ha-api');

const DEFAULTS = {
    baseUrl: null,
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

function HomeAssistant(config, { startListening } = {}) {
    if (! (this instanceof HomeAssistant)) { return new HomeAssistant(config); }

    this.config = Object.assign({}, DEFAULTS, config);
    this.api    = new HaApi(this.config);
    this.events = new HaEvents(this.config);

    if (startListening) { this.startListening(); }
    return this;
}

HomeAssistant.testConnection = async function ({ baseUrl, apiPass }) {
    const apiTest = new HaApi({ baseUrl, apiPass });
    try {
        await apiTest.getConfig();
        return true;
    } catch (e) {
        return false;
    }
};

HomeAssistant.prototype.startListening = async function () {
    if (!this.config.baseUrl) { throw new Error ('Home Assistant URL not set'); }

    try {
        await HomeAssistant.testConnection(this.config)
    } catch (e) {
        debug(`Connection to home assistant could not be established with config: ${this.config.baseUrl} ${(this.config.apiPass) ? '<password redacted>' : '<password not used>'}`);
        throw e;
    }
    this.events.startListening();
    this.events.on('ha_events:state_changed', (evt) => this._onStateChanged(evt));
    return this;
}

HomeAssistant.prototype.getStates = async function (entityId, forceRefresh = {}) {
    if (!this.states || forceRefresh) { this.states = await this.api.getStates(); }
    return (entityId)
        ? this.states[entityId] || null
        : this.states;
}

HomeAssistant.prototype.getServices = async function ({ forceRefresh } = {}) {
    if (!this.availableServices || forceRefresh) {  this.availableServices = await this.api.getServices(); }
    return this.availableServices;
};

HomeAssistant.prototype.getEvents = async function ({ forceRefresh } = {}) {
    if (!this.availableEvents || forceRefresh) { this.availableEvents = await this.api.getEvents(); }
    return this.availableEvents;
}

HomeAssistant.prototype._onStateChanged = async function (changedEntity) {
    debug(`changedEntity: ${JSON.stringify(changedEntity)}`);
    const cachedEntity = await this.getStates(changedEntity.entity_id)

    if (!cachedEntity) { debug('Got state changed event for entity that was not know, this should not happen'); }
    this.states[changedEntity.entity_id] = changedEntity.event.new_state;
};
module.exports = HomeAssistant;
