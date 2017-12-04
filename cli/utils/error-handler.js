/* eslint-disable no-console */
'use strict';

module.exports = function(err) {
    if (!err) {
        console.error('Unknown error occured, please try again with different options or file a bug report');
        process.exit(1);
    }
    if (err.response) {
        console.error(`HTTP Error Response ${err.response.status}: ${err.response.statusText} (method: ${err.config.method}, url: ${err.config.url})`);
        process.exit(1);
    }
    if (err.message) {
        console.error(`ERROR: ${err.message}`);
        console.error(err.stack);
    }
    process.exit(1);
};
