import { expect }             from 'chai';
import { getPreBuildDVRs }    from '../declarative_validation_rules.js';

describe('declarative_validation_rules.js', () => {
    let rules;
    beforeEach('Getting Pre Built Declarative Validation Rules', () => {
        rules = getPreBuildDVRs();
    });

    describe('.getPreBuildDVRs', () => {
        it('should return an object', () => {
            expect(rules).to.be.a('object');
        });
    });

    describe('.validRequired', () => {
        it('should return false if undefined', () => {
            expect(rules['req'].func(undefined)).to.be.false;
        });
        it('should return false if null', () => {
            expect(rules['req'].func(null)).to.be.false;
        });
        it('should return true if not undefined or not null', () => {
            expect(rules['req'].func('Filled')).to.be.true;
        });
        it('should return true if string length is bigger than 0', () => {
            expect(rules['req'].func('A')).to.be.true;
        });
        it('should return false if string length is 0', () => {
            expect(rules['req'].func('')).to.be.false;
        });
    });

    describe.skip('.validNumber', () => {
       it('should return true if value empty', () => {
           expect(rules['number'].func('')).to.be.true;
       });
       it('should return false if value is float', () => {
           expect(rules['number'].func());
       });
    });
});
