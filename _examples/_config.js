'use strict';
/*
To run examples create a file named `.env` in the project root folder with the following contents:

HA_URL=http://localhost:8123
HA_PASSWORD=mypassword

*/

/* eslint no-process-env:0 */
require('dotenv').config();
module.exports = {
    baseUrl: process.env.HA_URL,
    apiPass: process.env.HA_PASSWORD
};
