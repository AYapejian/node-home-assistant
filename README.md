# Node Home Assistant

Home Assistant utility library and command line interface

NOTE: This is a work in progress ymmv.  Currently it's working in my very limited testing and uses the Server Sent Events interface Home Assistant surfaces along with the REST api.

## Command Line
### Install

1. Install the module `npm install -g node-home-assistant`
2. Add an environment variable with your Home Assistant URL and Password exported as `HA_URL` and `HA_PASSWORD`
3. Run `ha history` as a quick test
4. See other commands and examples by running `ha` with no other options
5. The command line tool surfaces a lot of the defaults and configuration via environment variables, checkout `config.js` for a listing

### Command line help output

```shell
$ ha

Usage: ha [cmd]

Options:
  -V, --version                                 output the version number
  -v, --version                                 get version
  -d, --debug                                   output debug messages
  -u, --url <url>                               home assistant url
  -p, --password <password>                     home assistant password
  -h, --help                                    output usage information

Commands:
  history [options]                             Get history, defaults to all history from past hour
  states [options]                              Get list of all known states, returns only the list of entity_ids with states
  entities [options]                            Get list of all known entities, returns only the list of entity_ids
  dashboard [options]                           Display a dashboard that is updated with state data as events occur
  service <domain> <service> [data]             Calls home assistant service with data provided, outputs the response body from home assistant
  show [options] <entity|entities> [entity_id]  Get all details of one or more home assistant entities, returns only JSON object. If no entity is found JSON object will be empty, no error will be thrown
  *

  Examples:

    * History:
      $ ha history --pretty --relative-dates
      $ ha history --entity_id binary_sensor.motion_office_motion
      $ ha history --include office --exclude group --pretty
      $ ha history --include '(office|livingroom)' --exclude '(sensor|group)' --pretty
      $ ha history --from "3 days ago" --to "2 days ago"
      $ ha history -i '(office|bedroom)' -e '(^sensor|device_tracker|group)' -f '1 day ago' --pretty
    * States:
      $ ha states
      $ ha states --pretty --relative-dates
      $ ha states -i '^sensor' -e '_motion$|transmission|pihole'
    * Entities:
      $ ha entities
      $ ha entities --pretty
      $ ha entities --include '^sensor' --exclude '_motion$|transmission|pihole'
    * Entity Details:
      $ ha show entities
      $ ha show entities group.all_switches
      $ ha show entities --include sensor
    * Calling Services
      $ ha service light turn_on '{ "entity_id": "light.garage_hue_room" }'
      $ ha service light turn_off '{ "entity_id": "light.garage_hue_room" }'
      $ ha service light turn_off
    * Dashboard:
        $ ha dashboard
        $ ha dashboard --include '^sensor' --exclude '_motion$|transmission|pihole'
```

## Use as a library in your own project
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
- [x] CLI option to call service
- [ ] More tests
- [ ] Finish CLI Dashboard
- [ ] Update API to use new home assistant authentication methods
