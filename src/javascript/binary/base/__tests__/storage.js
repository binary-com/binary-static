var expect = require('chai').expect;
var storage = require('../storage');
var utility = require('../utility');

describe('text.localize', function() {
    var text = new storage.Localizable({
        key1: 'value',
        key2: 'value [_1]',
        'You_can_view_your_[_1]trading_limits_here_': 'Ihre [_1] Handelslimits sind hier ersichtlich.',
    });
    it('should try to return a string from the localised texts', function() {
        expect(text.localize('key')).to.equal('key');
        expect(text.localize('key1')).to.equal('value');
        expect(text.localize('You can view your [_1]trading limits here.'))
            .to.equal('Ihre [_1] Handelslimits sind hier ersichtlich.');
    });

    it('should only template when required', function() {
        expect(text.localize('key2')).to.equal('value [_1]');
        // inject global template function
        global.template = utility.template;
        expect(text.localize('key2', [1])).to.equal('value 1');
        expect(text.localize('You can view your [_1]trading limits here.', ['something']))
            .to.equal('Ihre something Handelslimits sind hier ersichtlich.');
        delete global.template;
    });
});
