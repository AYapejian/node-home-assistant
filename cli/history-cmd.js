/* eslint-disable no-console */
'use strict';
const chrono       = require('chrono-node');
const dateFormat   = require('dateformat');
const prettyPrint  = require('./utils/pretty-print');
const errorHandler = require('./utils/error-handler');
const haHistory  = module.exports = {};

haHistory.exec = async function ({ globalOpts, subCmdOpts } = {}, client) {
    const { pretty, from, to, entity_id, include, exclude, relativeDates } = subCmdOpts;

    let fromDate = chrono.parseDate(from);
    fromDate = dateFormat(fromDate, 'isoDateTime');

    let toDate = (to)
        ? chrono.parseDate(to)
        : null;
    toDate = toDate ? dateFormat(toDate, 'isoDateTime') : null;

    const entityId = entity_id || null;
    try {
        // TODO: Doublecheck last_changed and last_updated dates, make sure they are returning fine from home-assistant
        // and from the api lib
        const history = await  client.api.getHistory(fromDate, entityId, toDate, { include, exclude, flatten: true });

        if (pretty) {
            if (relativeDates) {
                prettyPrint.output(history, ['entity_id', 'last_changed_relative', 'state']);
            } else {
                prettyPrint.output(history, ['entity_id', 'last_changed', 'state']);
            }
        } else {
            console.log(history);
        }

        process.exit(0);
    } catch (e) {
        errorHandler(e);
    }
}
