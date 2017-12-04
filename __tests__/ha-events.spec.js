require('should');
const smock    = require('simple-mock');
const HaEvents = require('../lib/ha-events');

const TEST_CONFIG = {
    baseUrl: 'http://bogus',
    apiPass: 'bogus',
    events:  {
        transport: 'sse',       // For future support of websockets
        retries:   {
            maxAttempts: 10,    // How many times to retry connection
            delay:       5000   // Delay this long before retry (in ms)
        }
    }
};

describe('HaEvents Tests', function() {
    afterEach(function () {
        smock.restore();
    })

    describe('instantiation', function() {
        it('should instantiate correctly', function () {
            const haEvents = new HaEvents(TEST_CONFIG);

            haEvents.config.should.equal(TEST_CONFIG);
            haEvents.streamUrl.should.equal(`${TEST_CONFIG.baseUrl}/api/stream`);
        });
    })
});

