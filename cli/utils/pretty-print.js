/* eslint-disable no-console */
'use strict';
const Chalk       = require('chalk');
const config      = require('../../config');
const dateFormat  = require('dateformat');
const timeago     = require('timeago.js')();
const Table       = require('tty-table');
const merge       = require('object-merge');
const prettyPrint = module.exports = {};

const theme = config.getTheme();

const STATE_TEXT_MATCHES = {
    ACTIVE:   ['on', 'active', 'home', 'seeding', 'open', 'unlocked', 'playing'],
    INACTIVE: ['off', 'inactive', 'not_home', 'idle', 'closed', 'locked'],
    UNKNOWN:  ['unknown', '?'],
    ERROR:    ['error']
};

const TABLE_DEFAULTS = {
    borderStyle:   1,
    paddingBottom: 0,
    headerAlign:   'center',
    align:         'center',
    color:         theme.text
};

const HEADER_DEFAULTS = {
    headerColor: theme.headerText,
    color:       theme.text,
    align:       'left',
    paddingLeft: 2,
    width:       50
};

prettyPrint.FORMATTERS = {
    entityIdFormatter: function (value, opts = {}) {
        if (!theme.enabled) { return value; }

        opts.color = opts.color || true;
        let domain = value.split('.');
        domain = domain[0];

        let foundThemeColor = false;
        Object.keys(theme.domains).forEach(themeDomainKey => {
            if (foundThemeColor) { return; }
            if (domain === themeDomainKey) {
                value = Chalk.hex(theme.domains[themeDomainKey])(value);
                foundThemeColor = true;
            }
        })
        return value;
    },
    dateFormatter: function(value, overrideFormat) {
        const date = new Date(value);
        if (overrideFormat) { return dateFormat(date, overrideFormat); }
        return dateFormat(date, 'dddd, mmmm dS, h:MM:ss TT');
    },
    dateFormatterRelative: function(value, overrideRelativeTime) {
        const date = new Date(value);
        if (overrideRelativeTime) { return timeago.format(date, overrideRelativeTime); }
        return timeago.format(date);
    },
    stateFormatter: function(value) {
        if (!theme.enabled) { return value; }
        const lcValue = value.toLowerCase();

        if (STATE_TEXT_MATCHES.ACTIVE.includes(lcValue)) {
            return Chalk.hex(theme.states.active)(value);
        }
        if (STATE_TEXT_MATCHES.INACTIVE.includes(lcValue)) {
            return Chalk.hex(theme.states.inactive)(value);
        }
        if (STATE_TEXT_MATCHES.UNKNOWN.includes(lcValue)) {
            return Chalk.hex(theme.states.unknown)(value);
        }
        if (STATE_TEXT_MATCHES.ERROR.includes(lcValue)) {
            return Chalk.hex(theme.states.error)(value);
        }
        return value;
    }
}

prettyPrint.HEADER_CONFIGS = {
    ENTITY_ID: {
        value:     'entity_id',
        alias:     'Entity ID',
        width:     70,
        formatter: 'entityIdFormatter'
    },
    LAST_CHANGED: {
        value:     'last_changed',
        alias:     'Last Changed',
        width:     45,
        formatter: 'dateFormatter'
    },
    LAST_CHANGED_RELATIVE: {
        value:     'last_changed',
        alias:     'Last Changed',
        width:     45,
        formatter: 'dateFormatterRelative'
    },
    LAST_UPDATED: {
        value:     'last_updated',
        alias:     'Last Updated',
        width:     45,
        formatter: 'dateFormatter'
    },
    LAST_UPDATED_RELATIVE: {
        value:     'last_updated',
        alias:     'Last Updated',
        width:     45,
        formatter: 'dateFormatterRelative'
    },
    STATE: {
        value:     'state',
        alias:     'State',
        width:     30,
        align:     'center',
        formatter: 'stateFormatter'
    }
};

prettyPrint.getHeaderConfig = function(headerProp) {
    let headerConfig = prettyPrint.HEADER_CONFIGS[headerProp.toUpperCase()];
    headerConfig = merge(HEADER_DEFAULTS, headerConfig);
    if (headerConfig.formatter) { headerConfig.formatter = prettyPrint.FORMATTERS[headerConfig.formatter]; }
    return headerConfig;
}

prettyPrint.output = function (arr, headerProps) {
    const headers = headerProps.map(propName => {
        return prettyPrint.getHeaderConfig(propName)
    });

    let tableCli = Table(headers, arr, TABLE_DEFAULTS);
    console.log(tableCli.render());
};

