'use strict';
const blessedContrib = require('blessed-contrib');

class EventsLog {
    constructor() {
        this.widget = blessedContrib.log({
            label:  'State Changes',
            border: { type: 'line', fg: 'cyan' },
            width:  '100%',
            top:    '70%',
            height: '30%',
            fg:     'white'
        });
    }
    getWidget() {
        return this.widget;
    }
    updateWidget(entityId, event) {
        const logStr = `State Changed for entity: ${entityId}, current state is ${event.new_state.state} (was ${event.old_state.state})`
        this.widget.log(logStr);
    }
}

module.exports = EventsLog;
