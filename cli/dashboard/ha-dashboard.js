'use strict';
/* eslint-disable no-console, no-process-env */
const debug    = require('debug')('home-assistant:dashboard');
const debounce = require('debounce');
const merge    = require('merge');
const blessed  = require('blessed');

const DEFAULTS = {
    blessed: {
        smartCSR:    true,
        autoPadding: true,
        debug:       false
    }
};

class HomeAssistantDashboard {
    constructor(dashboardOptions) {
        debug('Instantiating Dashboard');
        this.opts = merge({}, DEFAULTS, dashboardOptions);
        this.screen = blessed.screen(this.opts.blessed);

        function resize(e) { this.screen.emit('resize'); }
        process.on('SIGWINCH', debounce(resize, 500));
        this.screen.key(['escape', 'q', 'C-c'], function(ch, key) { return process.exit(0); });
        this.screen.render();
    }
    addWidget(widgetWrapper, focus = true) {
        this.screen.append(widgetWrapper.widget);
        if (focus) { widgetWrapper.widget.focus(); }
    }
    render() {
        this.screen.render();
    }
}

module.exports = HomeAssistantDashboard;
