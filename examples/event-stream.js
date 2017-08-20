/* eslint-disable no-console, no-process-env */
'use strict';
const HomeAssistant = require('..');

const config = {
    baseUrl: process.env.HA_URL  || 'http://localhost:8123',
    apiPass: process.env.HA_PASS || 'supersecretpassword'
};

const homeAssistant = new HomeAssistant(config);

// Static Emitted Events
homeAssistant.events.on('ha_events:open',  (evt) => console.log(`(ha_events:open)  ${JSON.stringify(evt)}`));
homeAssistant.events.on('ha_events:close', (evt) => console.log(`(ha_events:close) ${JSON.stringify(evt)}`));
homeAssistant.events.on('ha_events:error', (evt) => console.log(`(ha_events:error) ${JSON.stringify(evt)}`));
// All Home Assistant Sent Events
homeAssistant.events.on('ha_events:all',   (evt) => console.log(`(ha_events:all)   ${JSON.stringify(evt)}`));
// Events by event_type as sent by home assistant ('state_changed' and 'service_executed' from home assistant below)
homeAssistant.events.on('ha_events:state_changed',    (evt) => console.log(`(ha_events:state_changed)    ${JSON.stringify(evt)}`));
homeAssistant.events.on('ha_events:service_executed', (evt) => console.log(`(ha_events:service_executed) ${JSON.stringify(evt)}`));
// Events by event_type and entity_id (if found)
homeAssistant.events.on('ha_events:state_changed:light.office', (evt) => console.log(`(ha_events:state_changed:light.office) ${JSON.stringify(evt)}`));
