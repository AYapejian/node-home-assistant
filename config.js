/* eslint no-process-env:0 */
/*
Configuration values are read either from environment variable or a config file set.

Config is loaded in order of precedence:
1. Passed as CLI or as module config
2. Read from environment variables
3. Read from .env file in this directory
3. Read from a config file (os location dependent)
To run examples create a file named `.env` in the project root folder with the following contents:

HA_BASE_URL=http://localhost:8123
HA_API_PASS=mypassword

*/
'use strict';
require('dotenv').config();
const config = module.exports = {};

const GLOBAL_OPTS = {
    url:      process.env.HA_URL       || 'http://localhost:8123',
    password: process.env.HA_PASSWORD  || null,
    debug:    process.env.HA_DEBUG     || false,
    theme:    {
        enabled:    process.env.HA_THEME_ENABLED        || true,
        text:       process.env.HA_THEME_TEXT           || 'grey',
        headerText: process.env.HA_THEME_HEADER_TEXT    || 'cyan',
        states:     {
            active:   process.env.HA_THEME_STATES_ACTIVE    || '#4CAF50',
            inactive: process.env.HA_THEME_STATES_INACTIVE  || '#f44336',
            unknown:  process.env.HA_THEME_STATES_UNKNOWN   || '#FF9800',
            error:    process.env.HA_THEME_STATES_ERROR     || '#d50000'
        },
        domains: {
            light:         process.env.HA_THEME_DOMAINS_LIGHT           || '#FFEB3B',
            switch:        process.env.HA_THEME_DOMAINS_SWITCH          || '#F9A825',
            sensor:        process.env.HA_THEME_DOMAINS_SENSOR          || '#0277BD',
            binary_sensor: process.env.HA_THEME_DOMAINS_BINARY_SENSOR   || '#03A9F4',
            lock:          process.env.HA_THEME_DOMAINS_LOCK            || '#512DA8',
            cover:         process.env.HA_THEME_DOMAINS_COVER           || '#7E57C2',
            automation:    process.env.HA_THEME_DOMAINS_AUTOMATION      || '#009688'
        }
    }
};

const SUB_COMMAND_OPTS = {
    history: {
        from:          process.env.HA_HISTORY_FROM           || '1 hour ago',
        to:            process.env.HA_HISTORY_TO             || 'now',
        relativeDates: process.env.HA_HISTORY_RELATIVE_DATES || false,
        entity_id:     process.env.HA_HISTORY_ENTITY_ID      || null,
        include:       process.env.HA_HISTORY_INCLUDE        || null,
        exclude:       process.env.HA_HISTORY_INCLUDE        || null,
        pretty:        process.env.HA_HISTORY_PRETTY         || true
    },
    dashboard: {
        include: process.env.HA_DASHBOARD_INCLUDE || null,
        exclude: process.env.HA_DASHBOARD_EXCLUDE || null
    },
    // entity and entities are the same, this is a hack until a refactor
    entity: {
        include: process.env.HA_ENTITIES_INCLUDE || null,
        exclude: process.env.HA_ENTITIES_EXCLUDE || null,
        pretty:  process.env.HA_ENTITIES_PRETTY  || false
    },
    entities: {
        include: process.env.HA_ENTITIES_INCLUDE || null,
        exclude: process.env.HA_ENTITIES_EXCLUDE || null,
        pretty:  process.env.HA_ENTITIES_PRETTY  || false
    },
    states: {
        include:       process.env.HA_ENTITIES_INCLUDE       || null,
        exclude:       process.env.HA_ENTITIES_EXCLUDE       || null,
        relativeDates: process.env.HA_HISTORY_RELATIVE_DATES || false,
        pretty:        process.env.HA_ENTITIES_PRETTY        || false
    }
};

config.getTheme = function() {
    return GLOBAL_OPTS.theme;
}

// Allows for passing in commands as overrides for options when
// getting the config from CLI
config.get = function (subCmd, subCmdOpts = {}, globalOpts = {}) {
    globalOpts = Object.keys(GLOBAL_OPTS).reduce((acc, k) => {
        acc[k] = globalOpts[k] || GLOBAL_OPTS[k]
        return acc;
    }, {})

    if (!SUB_COMMAND_OPTS[subCmd]) {
        return {
            globalOpts: globalOpts,
            subCmdOpts: {}
        };
    }

    subCmdOpts = Object.keys(SUB_COMMAND_OPTS[subCmd]).reduce((acc, k) => {
        acc[k] = subCmdOpts[k] || SUB_COMMAND_OPTS[subCmd][k];
        return acc;
    }, {});

    if (subCmdOpts.include) { subCmdOpts.include = new RegExp(subCmdOpts.include); }
    if (subCmdOpts.exclude) { subCmdOpts.exclude = new RegExp(subCmdOpts.exclude); }
    const compiledConfig = { globalOpts, subCmdOpts };
    return compiledConfig;
};
