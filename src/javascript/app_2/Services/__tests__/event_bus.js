const expect   = require('chai').expect;
const eventBus = require('../event_bus').default;

describe('Event Bus', function() {
    beforeEach(() => {
        eventBus.eventList = {}
    });

    it('should create a global bus for all events', () => {
        eventBus.listen('test', null, false);
        eventBus.listen('test', null, false);
        eventBus.listen('test', null, false);
        eventBus.listen('test', null, false);

        expect(eventBus.eventList.test.length).to.equal(4);
    });
    it('should one off events that are defined with once', () => {
        eventBus.listen('test', null, false);
        eventBus.once('test2', () => ({}), false);

        eventBus.dispatch('test2', '');

        expect(eventBus.eventList['test2'].length).to.be.equal(0)
    })
    it('should remove event entirely if requested with off', () => {
        eventBus.listen('test')
        eventBus.listen('test2')
        eventBus.ignore('test')

        expect(typeof eventBus.eventList.test).to.be.equal('undefined')
    })
});
