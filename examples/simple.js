/* eslint-disable no-console */
'use strict';
const HomeAssistant = require('..');

const config = {
    baseUrl: 'http://localhost:8123',
    apiPass: 'supersecretpassword'
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

// Call a service with domain, service, data
homeAssistant.api.callService('light', 'turn_off', {
    entity_id: 'light.office_hue_room'
}).then(res => console.log('Light switched off', res))
.catch(e => console.log(e));

// States are tracked and updated internally on state_changed. The states object
// contains map of [entity_id] to the last 'new_state' for that entity
console.log(homeAssistant.states);
// Services are fetched once during initial instantiation
console.log(homeAssistant.availableServices);
// Events are fetched once during initial instantiation
console.log(homeAssistant.availableEvents);

// If needed a fresh set of states can be obtained via
homeAssistant.api.getStates()
    .then(res => console.log(res))
    .catch(e => console.log(e));

// If needed a fresh set of available events can be fetch via
homeAssistant.api.getEvents()
    .then(res => console.log(res))
    .catch(e => console.log(e));

// If needed a fresh set of available services can be fetch via
homeAssistant.api.getServices()
    .then(res => console.log(res))
    .catch(e => console.log(e));




