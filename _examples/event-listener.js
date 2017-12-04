'use strict';
/* eslint-disable no-console, no-process-env */
const { inspect } = require('util');
const config = require('./_config');
const HomeAssistant = require('..');

const log = (topic, obj) => console.log(`*************\n${topic} -- \n${inspect(obj, {depth: 3, colors: true })}`);
const homeAssistant = new HomeAssistant(config, { startListening: true });

// Static Emitted Events
homeAssistant.events.on('ha_events:open',  (evt) => log('(ha_events:open)', evt));
homeAssistant.events.on('ha_events:close', (evt) => log('(ha_events:close)', evt));
homeAssistant.events.on('ha_events:error', (evt) => log('(ha_events:error)', evt));
// All Home Assistant Sent Events
homeAssistant.events.on('ha_events:all',   (evt) => log('(ha_events:all)', evt));
// Events by event_type as sent by home assistant ('state_changed' and 'service_executed' from home assistant below)
homeAssistant.events.on('ha_events:state_changed',    (evt) => log('(ha_events:state_changed)',evt));
homeAssistant.events.on('ha_events:service_executed', (evt) => log('(ha_events:service_executed)', evt));
// Events by event_type and entity_id (if found)
homeAssistant.events.on('ha_events:state_changed:light.office', (evt) => log('(ha_events:state_changed:light.office)', evt));

