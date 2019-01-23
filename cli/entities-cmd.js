/* eslint-disable no-console */
'use strict';
const prettyPrint  = require('./utils/pretty-print');
const errorHandler = require('./utils/error-handler');
const haEntities   = module.exports = {};

haEntities.exec = async function ({ globalOpts, subCmdOpts } = {}, client) {
    const { pretty, include, exclude } = subCmdOpts;

    try {
        let entities = await client.api.getEntities(null, { include, exclude });
        console.log(JSON.stringify(entities));
        if (pretty) {
            // Table expects array for each entry ( TODO: check options, it should work for objects as well )
            entities = entities.map(i => ([i]));
            prettyPrint.output(entities, ['entity_id']);
        } else {
            const output = entities.reduce((acc, e) => (acc += e + '\n'), '');
            console.log(output);
        }
        process.exit(0);
    } catch (e) {
        errorHandler(e);
    }
}
