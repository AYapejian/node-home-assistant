'use strict';
/* eslint-disable no-console, no-process-env */
const { createStream } = require('table');
const config = require('./_config');
const HomeAssistant = require('..');

const tableConfig = {
    columnDefault: {
        width: 30
    },
    columnCount: 5
};
const tableStream = createStream(tableConfig);


const logStateChange = (obj) => {
    // console.log(inspect(obj));
    const { entity_id, event } = obj;

    const logEntry = {
        domain:        entity_id.split('.')[0],
        entity_id:     event.entity_id,
        friendly_name: event.new_state.attributes.friendly_name,
        new_state:     event.new_state.state,
        old_state:     event.old_state.state
    };
    const tableLogEntry = [
        logEntry.domain,
        logEntry.entity_id,
        logEntry.friendly_name,
        logEntry.new_state,
        logEntry.old_state
    ];
    tableStream.write(tableLogEntry);
}




const homeAssistant = new HomeAssistant(config, { startListening: true });
homeAssistant.events.on('ha_events:state_changed',    (evt) => logStateChange(evt));
