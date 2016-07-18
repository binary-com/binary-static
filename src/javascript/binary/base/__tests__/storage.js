var expect = require('chai').expect;
var storage = require('../storage');
var utility = require('../utility');

describe('text.localize', function() {
    var text = new storage.Localizable({
        key1: 'value',
        key2: 'value [_1]',
    });
    it('should try to return a string from the localised texts', function() {
        expect(text.localize('key')).to.equal('key');
        expect(text.localize('key1')).to.equal('value');
    });

    it('should only template when required', function() {
        expect(text.localize('key2')).to.equal('value [_1]');
        // inject global template function
        global.template = utility.template;
        expect(text.localize('key2', [1])).to.equal('value 1');
        delete global.template;
    });
});
