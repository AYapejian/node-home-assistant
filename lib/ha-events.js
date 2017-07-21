'use strict';
const inherits     = require('util').inherits;
const EventEmitter = require('events').EventEmitter;
const EventSource  = require('eventsource');
const debug        = require('debug')('home-assistant:events');

function HaEvents(config) {
    if (! (this instanceof HaEvents)) { return new HaEvents(config); }
    debug('instantiating events interface');

    this.config    = config;
    this.streamUrl = `${config.baseUrl}/api/stream`;
    this.esOptions = (config.apiPass)
        ? { headers: { 'x-ha-access': config.apiPass }}
        : {};
    this.connected = false;

    // TODO: Implement websocket listener
    if (config.events.transport === 'sse') {
        debug ('setting up eventsource transport');
        this.client = new EventSource(this.streamUrl, this.esOptions);
        this.client.on('message', (evt) => this.onClientMessage(evt));

        this.client.on('open',  ()    => this.onClientOpen());
        this.client.on('close', ()    => this.onClientClose());
        this.client.on('error', (err) => this.onClientError(err));
    }

    EventEmitter.call(this);
    this.setMaxListeners(0);
}
inherits(HaEvents, EventEmitter);


HaEvents.prototype.onClientMessage = function(msg) {
    // debug('sse message event: ' + require('util').inspect(msg));
    if (!msg || !msg.data || msg.data === 'ping') { return; }

    let event;
    try   { event = JSON.parse(msg.data); }
    catch (e) { this.emit('ha_events:error', e); }

    if (event) {
        const eventType = event.event_type;
        const entityId  = (event.data) ? event.data.entity_id : null;

        const emitEvent = {
            event_type: eventType,
            entity_id:  entityId,
            event:      event.data
        };

        // Emit on all channel
        this.emit('ha_events:all', emitEvent);
        // Emit on the event type channel
        if (emitEvent.event_type) {
            this.emit(`ha_events:${event.event_type}`, emitEvent);
        }
        // Most specific emit for event_type and entity_id
        if (emitEvent.event_type && emitEvent.entity_id) {
            this.emit(`ha_events:${event.event_type}:${emitEvent.entity_id}`, emitEvent);
        }

    }
};

HaEvents.prototype.onClientOpen = function () {
    debug('events connection open');
    this.connected = true;
    this.emit('ha_events:open');
};

HaEvents.prototype.onClientClose = function () {
    this.closeClient(null, 'events connection closed, cleaning up connection');
};

HaEvents.prototype.onClientError = function (err) {
    this.closeClient(err, 'events connection error, cleaning up connection');
};

HaEvents.prototype.closeClient = function (err, logMsg) {
    if (logMsg) { debug(logMsg); }
    if (err)    {
        debug(err);
        this.emit('ha_events:error', err);
    }

    if (this.client && this.client.close) {
        this.connected = false;
        this.client.close();
        this.emit('ha_events:close');
    }

    setTimeout(() => {
        this.client = new EventSource(this.streamUrl, this.esOptions);
        this.client.on('message', (evt) => this.onClientMessage(evt));

        this.client.on('open',  ()    => this.onClientOpen());
        this.client.on('close', ()    => this.onClientClose());
        this.client.on('error', (error) => this.onClientError(error));
    }, 2000);
};


HaEvents.prototype.startReconnectionLogic = function () {

};

module.exports = HaEvents;
