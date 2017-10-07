const should        = require('should');
const nock          = require('nock');
const smock         = require('simple-mock');
const HomeAssistant = require('..');

describe('HomeAssistant Tests', function() {
    afterEach(function () {
        smock.restore();
    })

    it('should allow instantiation without config', async function () {
        const homeAssistant = await new HomeAssistant();
        should.exist(homeAssistant);
    });

    it('should automatically start listenting during instantiation if startListening === true', async function() {
        const homeAssistantExpected = {};
        const startListeningProxy = smock.mock(HomeAssistant.prototype, 'startListening').resolveWith(homeAssistantExpected);

        const homeAssistant = await new HomeAssistant({ baseUrl: 'http://localhost:8123' }, { startListening: true });
        should.exist(homeAssistant);
        startListeningProxy.callCount.should.equal(1);
    });

    it('should test incorrect connection', async function() {
        const isValidConnection = await HomeAssistant.testConnection({ baseUrl: 'http://bogus' });
        isValidConnection.should.equal(false);
    });

    it('should test correct connection', async function() {
        nock('http://fakeHomeAssistant').get('/api/config').reply(200);

        const isValidConnection = await HomeAssistant.testConnection({ baseUrl: 'http://fakeHomeAssistant' });
        isValidConnection.should.equal(true);
    });
});
