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
        it('should return true if string length is bigger than 0', () => {
            expect(rules['req'].func('a')).to.be.true;
        });
        it('should return false if string length is 0', () => {
            expect(rules['req'].func('')).to.be.false;
        });
    });

    describe('.validNumber', () => {
        let options;
        beforeEach('Setting up options', () => {
            options = {
                allow_empty: true,
                min: 0,
                max: 8,
                type: 'float',
                decimals: 2,
            }
        });

        // New lines seperates tests for different if statements.
        it('should return true if value is empty', () => {
           expect(rules['number'].func('', options)).to.be.true;
        });

        it('should return true if float', () => {
           expect(rules['number'].func(0.10, options)).to.be.true;
        });
        it('should return true if integer', () => {
            options['type'] = 'int';
            expect(rules['number'].func(0, options)).to.be.true;
        });
        it('should return false if value is characters', () => {
           expect(rules['number'].func('a', options)).to.be.false;
        });
        it('should return false if value is NaN', () => {
           expect(rules['number'].func(NaN, options)).to.be.false;
        });

        it('should return false if value is float which does not exceed options.decimal', () => {
           expect(rules['number'].func(12.122, options)).to.be.false;
        });

        it('should return false if min and max equals to one another while value is not equal to min', () => {
           options.min = 1;
           options.max = 1;

           expect(rules['number'].func(2, options)).to.be.false;
        });

        it('should return false if value out of boundary (min, max)', () => {
           options.min = 2;
           options.max = 4;

           expect(rules['number'].func(1, options)).to.be.false;
           expect(rules['number'].func(5, options)).to.be.false;
        });
        it('should return true if value in boundary (min, max', () => {
           options.min = 2;
           options.max = 4;

           expect(rules['number'].func(3, options)).to.be.true;
        });

        it('should return false if smaller than min', () => {
          options.min = 2;
          expect(rules['number'].func(1, options)).to.be.false;
        });

        it('should return false if bigger than max', () => {
           options.max = 0;
           expect(rules['number'].func(1, options)).to.be.false;
        });
    });
});
