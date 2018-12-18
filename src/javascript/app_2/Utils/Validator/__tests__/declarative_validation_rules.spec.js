import { expect }             from 'chai';
import { getPreBuildDVRs }    from '../declarative_validation_rules.js';

let rules;

beforeEach('Getting Pre Built Declarative Validation Rules', () => {
    rules = getPreBuildDVRs();
});

describe('.validAddress', () => {
    it('should validate address', () => {
        expect(rules['address'].func('Lot 000, Test Road')).to.eql(true);
        expect(rules['address'].func('`~!$%^&*_=+[ Lot 000, Test Road')).to.eql(false);
    });
});

describe('.validBarrier', () => {
    it('should validate barrier', () => {
        expect(rules['barrier'].func('+-.')).to.eql(true);
        expect(rules['barrier'].func('~!$%^&*_=+')).to.eql(false);
    });
});

describe('.validRequired', () => {
    it('should return false if value is undefined or null, and should return true if str length bigger than 0', () => {
        expect(rules['req'].func('Valid')).to.eql(true);

        expect(rules['req'].func(undefined)).to.eql(false);
        expect(rules['req'].func(null)).to.eql(false);
        expect(rules['req'].func('')).to.eql(false);
    });
});
