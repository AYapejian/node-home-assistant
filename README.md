# Node Home Assistant

Home Assistant utility library for node

NOTE: This is a work in progress ymmv.  Currently it's working in my very limited testing and uses the Server Sent Events interface Home Assistant surfaces.

## Usage

Install the module

```
npm install AYapejian/node-home-assistant
```

Then see usage below or `examples/simple.js` for more details

```javascript
const HomeAssistant = require('..');

const config = {
    baseUrl: 'http://localhost:8123',
    apiPass: 'supersecretpassword'
};

const homeAssistant = new HomeAssistant(config);

// Call a service with domain, service, data
homeAssistant.api.callService('light', 'turn_off', { entity_id: 'light.office_hue_room' })
    .then(res => console.log('Light switched off', res))
    .catch(e => console.log(e));

// Events by event_type as sent by home assistant ('state_changed' and 'service_executed' from home assistant below)
homeAssistant.events.on('ha_events:state_changed', (evt) => console.log(`(ha_events:state_changed) ${JSON.stringify(evt)}`));
```

## TODO
- [ ] Tests
- [ ] Reconnect logic
