'use strict';
/* eslint-disable no-console, no-process-env */
const config = require('./_config');
const HomeAssistant = require('..');

const homeAssistant = new HomeAssistant(config);

// Examples of currently supported API Calls
const examples = {
    getConfig:        () => homeAssistant.api.getConfig(),
    getDiscoveryInfo: () => homeAssistant.api.getDiscoveryInfo(),
    getStates:        () => homeAssistant.api.getStates(),
    getEntities:      () => homeAssistant.api.getEntities(),
    getState:         () => homeAssistant.api.getStates('light.office_3'),
    getEvents:        () => homeAssistant.api.getEvents(),
    getErrorLog:      () => homeAssistant.api.getErrorLog(),
    getServices:      () => homeAssistant.api.getServices(),
    getCameraImage:   () => homeAssistant.api.getCameraImage('camera.pi_cam_01'),
    renderTemplate:   () => homeAssistant.api.renderTemplate('{{ states("camera.pi_cam_01") }}'),
    getHistory:       () => homeAssistant.api.getHistory(),
    callService:      () => homeAssistant.api.callService('light', 'turn_off', { entity_id: 'light.office_3' }),
    toggleLight:      async (entityId) => {
        const callLightService = (service, eid) => homeAssistant.api.callService('light', service, { entity_id: eid });

        const lightState = await homeAssistant.getStates(entityId);
        let targetState = (lightState.state === 'on') ? 'turn_off' : 'turn_on';
        await callLightService(targetState, entityId);

        targetState = (targetState === 'turn_on') ? 'turn_off' : 'turn_on';
        await callLightService(targetState, entityId);
        console.log(`Light ${entityId} Toggled`);
    }
};


// Modify `getConfig` to call any test methods above
examples.getStates()
    .then(haConfig => console.log(haConfig))
    .catch(e => console.log(e.message));

// Another example
// examples.toggleLight('light.office_3')
//     .then(haConfig => console.log(haConfig))
//     .catch(e => console.log(e.message));
