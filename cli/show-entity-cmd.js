/* eslint-disable no-console */
'use strict';
const errorHandler = require('./utils/error-handler');
const haEntities   = module.exports = {};


haEntities.exec = async function ({ globalOpts, subCmdOpts } = {}, client, entity_id) {
    const { include, exclude } = subCmdOpts;

    try {
        if (entity_id) {
            let entities = await client.api.getEntities(entity_id);
            let foundEntity = entities[0];
            let entityState = await client.api.getStates(foundEntity);
            console.log(JSON.stringify(entityState));
            process.exit(0);
        }
        else {
            let entityStates = await client.api.getStates(null, { include, exclude });
            console.log(JSON.stringify(entityStates));
        }
    } catch (e) {
        // 404, entity was not found, just output empty JSON object
        if (e.response && e.response.status === 404) {
            console.log('{}');
            process.exit(0);
        } else {
            errorHandler(e);
        }
    }
}
