'use strict';
const HaDashboard  = require('./dashboard/ha-dashboard');
const EntityTable  = require('./dashboard/widgets/entity-table');
const EventsLog    = require('./dashboard/widgets/events-log');
const dashboardCmd = module.exports = {};

dashboardCmd.exec = function ({ globalOpts, subCmdOpts } = {}, client) {
    const { include, exclude } = subCmdOpts;

    client.startListening({ includeRegex: include, excludeRegex: exclude });

    const dashboard = new HaDashboard();
    const entityTable = new EntityTable();
    const eventsLog = new EventsLog();
    dashboard.addWidget(entityTable);
    dashboard.addWidget(eventsLog);

    client.events.on('ha_events:state_changed', (evt) => {
        eventsLog.updateWidget(evt.entity_id, evt.event);
        entityTable.updateWidget(evt.entity_id, evt.event);
        dashboard.render();
    });

    dashboard.render();
}
