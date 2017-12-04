'use strict';
const blessedContrib = require('blessed-contrib');
const prettyPrint    = require('../../utils/pretty-print');

class EntityTable {
    constructor(options) {
        this.data = []
        this.seenEntities = {};
        this.headers = ['ID', 'State', 'Last Changed'];

        this.widget = blessedContrib.table({
            label:         'Entity States Observed',
            keys:          true,
            border:        { type: 'line', fg: 'cyan' },
            width:         '100%',
            height:        '70%',
            fg:            'white',
            columnSpacing: 10,
            interactive:   false,
            columnWidth:   [60, 30, 30]
        });
    }
    updateWidget(entity_id, event) {
        const wasKnownEntity = this.seenEntities[entity_id] || false;
        this.seenEntities[entity_id] = event;

        const entityEventTableData = [
            entity_id,
            prettyPrint.FORMATTERS.stateFormatter(event.new_state.state),
            prettyPrint.FORMATTERS.dateFormatter(event.new_state.last_changed, 'h:MM:ss TT')
        ];

        // If entity is already being tracked then update it's item in the table
        if (wasKnownEntity) {
            this.data.forEach((item, i) => {
                if (item[0] === entity_id) {
                    this.data[i] = entityEventTableData;
                }
            });
        // Else push new record
        } else {
            this.data.push(entityEventTableData)
        }

        this.widget.setData({
            headers: this.headers,
            data:    this.data
        });
    }
}

module.exports = EntityTable;
