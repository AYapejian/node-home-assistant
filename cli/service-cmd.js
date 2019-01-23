/* eslint-disable no-console */
'use strict';
const errorHandler = require('./utils/error-handler');
const haEntities   = module.exports = {};


haEntities.exec = async function ({ globalOpts, subCmdOpts } = {}, client, domain, service, data) {
    try {
        // TODO: Call service
        const response = await client.api.callService(domain, service, data);
        console.log(JSON.stringify(response));
    } catch (e) {
        if (e.response) {
            switch(e.response.status) {
                case 400:
                    console.log('Bad request, please make sure service, domain and data are correct');
                    break;
                default:
                    console.dir(e.response.data);
            }
            process.exit(1);
        }
        errorHandler(e);
        // 404, entity was not found, just output empty JSON object
        if (e.response && e.response.status === 404) {
            errorHandler(e);
            process.exit(0);
        } else {
            errorHandler(e);
        }
    }
}
