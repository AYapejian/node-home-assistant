# Node Home Assistant

Home Assistant utility library and command line interface

NOTE: This is a work in progress ymmv.  Currently it's working in my very limited testing and uses the Server Sent Events interface Home Assistant surfaces along with the REST api.

## Usage

### Use as a command line tool

1. Install the module `npm install -g node-home-assistant`
2. Add an environment variable with your Home Assistant URL and Password exported as `HA_URL` and `HA_PASSWORD`
3. Run `ha history` as a quick test
4. See other commands and examples by running `ha` with no other options
5. The command line tool surfaces a lot of the defaults and configuration via environment variables, checkout `config.js` for a listing

### Use as a library in your own project
1. Install module locally `npm install --save node-home-assistant`
2. Check out the `_examples` directory in this project which shows some usage of the API and Events listener interfaces
3. Quick example below:

```javascript
const HomeAssistant = require('node-home-assistant');

const config = {
    baseUrl: 'http://localhost:8123',
    apiPass: 'supersecretpassword'
};

const homeAssistant = new HomeAssistant(config, { startListening: true });

// Call a service with domain, service, data
homeAssistant.api.callService('light', 'turn_off', { entity_id: 'light.office_hue_room' })
    .then(res => console.log('Light switched off', res))
    .catch(e => console.log(e));

// Events by event_type as sent by home assistant ('state_changed' and 'service_executed' from home assistant below)
homeAssistant.events.on('ha_events:state_changed', (evt) => console.log(`(ha_events:state_changed) ${JSON.stringify(evt)}`));
```

## TODO
- [ ] CLI option to call service
- [ ] More tests
- [ ] Finish CLI Dashboard
