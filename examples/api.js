/* eslint-disable no-console, no-process-env */
'use strict';
const HomeAssistant = require('..');

const config = {
    baseUrl: process.env.HA_URL  || 'http://localhost:8123',
    apiPass: process.env.HA_PASS || 'supersecretpassword'
};


const homeAssistant = new HomeAssistant(config);
const resHandler = (res) => console.log(res);


homeAssistant.api.getConfig().then(resHandler).catch(resHandler);
homeAssistant.api.getDiscoveryInfo().then(resHandler).catch(resHandler);
homeAssistant.api.getBootstrap().then(resHandler).catch(resHandler);
homeAssistant.api.getStates().then(resHandler).catch(resHandler);
homeAssistant.api.getStates('light.office_2').then(resHandler).catch(resHandler);
homeAssistant.api.getErrorLog().then(resHandler).catch(resHandler);
homeAssistant.api.getCameraImage('camera.pi_cam_01').then(resHandler).catch(resHandler);
homeAssistant.api.renderTemplate('{{ states("camera.pi_cam_01") }}').then(resHandler).catch(resHandler);

homeAssistant.api.getHistory('2017-08-19T00:00').then(resHandler).catch(resHandler);

// // Call a service with domain, service, data
homeAssistant.api.callService('light', 'turn_off', { entity_id: 'light.office_hue_room' })
    .then(res => console.log('Light switched off', res))
    .catch(e => console.log(e));

// // If needed a fresh set of states can be obtained via
homeAssistant.api.getStates()
    .then(res => console.log(res))
    .catch(e => console.log(e));

// // If needed a fresh set of available events can be fetch via
homeAssistant.api.getEvents()
    .then(res => console.log(res))
    .catch(e => console.log(e));

// // If needed a fresh set of available services can be fetch via
homeAssistant.api.getServices()
    .then(res => console.log(res))
    .catch(e => console.log(e));
