/* eslint-disable no-console */
'use strict';
const prettyPrint  = require('./utils/pretty-print');
const errorHandler = require('./utils/error-handler');
const haStates     = module.exports = {};

haStates.exec = async function ({ globalOpts, subCmdOpts } = {}, client) {
    const { pretty, include, exclude, relativeDates } = subCmdOpts;

    try {
        let states = await client.api.getStates(null, { include, exclude });

        if (pretty) {
            states = Object.keys(states).map(s => {
                const { entity_id, last_updated, last_changed, state } = states[s];
                return [entity_id, last_updated, last_changed, state];
            });

            if (relativeDates) {
                prettyPrint.output(states, ['entity_id', 'last_updated_relative', 'last_changed_relative', 'state']);
            } else {
                prettyPrint.output(states, ['entity_id', 'last_updated', 'last_changed', 'state']);
            }
        } else {
            const output = Object.keys(states).map(s => `${s}: ${states[s].state}\n`)
                .reduce((acc, stateString) => (acc += stateString));

            console.log(output);
        }
        process.exit(0);
    } catch (e) {
        errorHandler(e);
    }
}
