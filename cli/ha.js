#!/usr/bin/env node
/* eslint-disable no-process-env, no-debugger, no-console */
'use strict';
const commander  = require('commander');
const config     = require('../config');
const haClient   = require('./utils/_ha-client');
const pkg        = require('../package.json');

commander.version(pkg.version)
    .option('-v, --version',                'get version')
    .option('-d, --debug',                  'output debug messages', false)
    .option('-u, --url <url>',              'home assistant url')
    .option('-p, --password <password>',    'home assistant password')
    .usage('[cmd]');

commander.on('--help', function() {
    const exampleText = `
  Examples:

    * History:
      $ ha history --pretty --relative-dates
      $ ha history --entity_id binary_sensor.motion_office_motion
      $ ha history --include office --exclude group --pretty
      $ ha history --include '(office|livingroom)' --exclude '(sensor|group)' --pretty
      $ ha history --from "3 days ago" --to "2 days ago"
      $ ha history -i '(office|bedroom)' -e '(^sensor|device_tracker|group)' -f '1 day ago' --pretty
    * States:
      $ ha states
      $ ha states --pretty --relative-dates
      $ ha states -i '^sensor' -e '_motion$|transmission|pihole'
    * Entities:
      $ ha entities
      $ ha entities --pretty
      $ ha entities --include '^sensor' --exclude '_motion$|transmission|pihole'
    * Dashboard:
        $ ha dashboard
        $ ha dashboard --include '^sensor' --exclude '_motion$|transmission|pihole'

`;

    console.log(exampleText);
});

/* ********************************************************************************************* */
/* Fetch history                                                                                 */
commander.command('history')
    .option('--entity_id <entityId>',   'only return history for entity_id provided')
    .option('-f, --from <fromDate>',    'fetch starting at this date/time. Defaults to -1 hour from current time')
    .option('-t, --to <toDate>',        'fetch until this date/time. Defaults to current date/time')
    .option('-i, --include  <regex>',   'include entity_id by regex match. NOTE: If fetching only one entity --entity_id will be faster')
    .option('-e, --exclude <regex>',    'exclude entity_id by regex match')
    .option('--relative-dates',         'dates will be displayed relative to "now"')
    .option('--pretty',                 'formats output in a more readable form')
    .description('Get history, defaults to all history from past hour')
    .action(function(cmd) {
        const cmdConfig = config.get('history', cmd, cmd.parent);
        const client = haClient.get(cmdConfig.globalOpts);
        return require('./history-cmd').exec(cmdConfig, client);
    });

/* ********************************************************************************************* */
/* Fetch States                                                                                  */
commander.command('states')
    .option('-i, --include  <regex>',   'include entity_id by regex match.')
    .option('-e, --exclude <regex>',    'exclude entity_id by regex match')
    .option('--relative-dates',         'dates will be displayed relative to "now"')
    .option('--pretty',                 'formats output in a more readable form')
    .description('Get list of all known states, returns only the list of entity_ids with states')
    .action(function(cmd) {
        const cmdConfig = config.get('states', cmd, cmd.parent);
        const client = haClient.get(cmdConfig.globalOpts);
        require('./states-cmd').exec(cmdConfig, client);
    });

/* ********************************************************************************************* */
/* Fetch Entities                                                                                */
commander.command('entities')
    .option('-i, --include  <regex>',   'include entity_id by regex match.')
    .option('-e, --exclude <regex>',    'exclude entity_id by regex match')
    .option('--pretty',                 'formats output in a more readable form')
    .description('Get list of all known entities, returns only the list of entity_ids')
    .action(function(cmd) {
        const cmdConfig = config.get('entities', cmd, cmd.parent);
        const client = haClient.get(cmdConfig.globalOpts);
        require('./entities-cmd').exec(cmdConfig, client);
    });

/* ********************************************************************************************* */
/* Display Dashboard                                                                             */
commander.command('dashboard')
    .option('-i, --include  <regex>',   'include entity_id by regex match.')
    .option('-e, --exclude <regex>',    'exclude entity_id by regex match')
    .description('Display a dashboard that is updated with state data as events occur')
    .action(function(cmd) {
        const cmdConfig = config.get('dashboard', cmd, cmd.parent);
        const client = haClient.get(cmdConfig.globalOpts);
        require('./dashboard-cmd').exec(cmdConfig, client);
    });

// TODO: Below options

// $ ha service input_boolean turn_off
// $ ha service home_assistant restart
// $ ha service light turn_on -d entity_id=light.office -d brightness=100 -d transition=5
// commander.command('service <service_domain> <service>')
//     .option('-d, --data <keyValue> [...otherKeyValues]',   'key/value pair to send as data, can have many "-d" switches.')
//     .description('Calls home assistant service with data provided')
//     .action(function(service_domain, service, keyValue, otherKeyValues) {
//         console.log(service_domain, service, keyValue, otherKeyValues);
//         debugger;
//         console.log('SERVICE: ');
//     });


// $ ha show service light
// $ ha show service light turn_on
// $ ha show entity light.office
// $ ha show event state_changed
// commander.command('show <service|entity|event>')

// commander.command('show <service|entity|event>')
//     .description('Get details of a home assistant object')
//     .action(function(cmd) {
//         console.log('INFO: ', cmd)
//     });

// commander.command('ping')
//     .description('ping home assistant, use for testing configuration or as a health check')
//     .action(function() {
//         console.log('TODO: PING');
//     });

// // TODO: Allow saving the url and password to a homedir config file
// commander.command('config [key] [value]')
//     .description('get / set ha cli configuration')
//     .action(function(key, value) {
//         if (key && value) {
//             console.log('CONFIG: Settings configuration values for ', key, value);
//             return;
//         }
//         console.log('CONFIG: Dumping current configuration');
//     });

commander.command('*')
    .action(function() {
        console.error('Command not found');
        commander.outputHelp();
        process.exit(1);
    });


function parseArguments() {
    // No args passed
    if (process.argv.length === 2) {
        commander.parse(process.argv);
        commander.outputHelp();
        process.exit(1);
    }
    commander.parse(process.argv);
    return commander;
}

parseArguments();

