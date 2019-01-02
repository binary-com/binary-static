import { expect }             from 'chai';
import { getPreBuildDVRs }    from '../declarative_validation_rules.js';

describe('declarative_validation_rules.js', () => {
    let rules;

    beforeEach('Getting Pre Built Declarative Validation Rules', () => {
        rules = getPreBuildDVRs();
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

    describe('.validEmail', () => {
        it('should return false if address is missing an At sign', () => {
            expect(rules['email'].func('a.a')).to.be.false;
        });
        it('should return false if address is missing a full stop', () => {
            expect(rules['email'].func('a@a')).to.be.false;
        });
        it('should return true if address is correct', () =>  {
            expect(rules['email'].func('a@a.me')).to.be.true;
        });
    });

    describe('.validPassword -> FIX ME', () => {
    });

    describe('.validLetterSymbol', () => {
        it('should return false if value contains restricted characters', () => {
            expect(rules['letter_symbol'].func('`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d')).to.be.false;
        });
    });

    describe('.validGeneral', () => {
        it('should return false if value contains restricted characters', () => {
            expect(rules['general'].func('`~!@#$%^&*)(_=+[}{\]\\/";:?><|')).to.be.false;
        });
    });

    describe('.validAddress', () => {
        it('should return false if value contains restricted characters', () => {
            expect(rules['address'].func('`~!$%^&*_=+[}{\]\\"?><|')).to.be.false;
        });
    });

    describe('.validPostCode', () => {
        it('should return true if value is in allowed characters',() => {
            expect(rules['postcode'].func('00000')).to.be.true;
        });
    });

    describe('.validPhone', () => {
        it('should return false if value is/contain non number', () => {
            expect(rules['phone'].func('0w0')).to.be.false;
        });
        it('should return true if value is all numbers', () => {
            expect(rules['phone'].func('000 0000 0000')).to.be.true;
        });
    });

    describe('.validRegular -> FIX ME', () => {
    });

    describe('.validEmailToken', () => {
        it('should return true if value is of length 8', () => {
            expect(rules['signup_token'].func('00000000')).to.be.true;
        });
        it('should return true if value is of length 8 with spaces around', () => {
            expect(rules['signup_token'].func(' 00000000 ')).to.be.true;
        });
        it('should return false if value is not of length 8', () => {
            expect(rules['signup_token'].func('0')).to.be.false;
        });
        it('should return false if value is not of length 8 with spaces around', () => {
            expect(rules['signup_token'].func(' 0 ')).to.be.false;
        });
    });

    describe('.validTaxID -> FIX ME', () => {
    });

    describe('.validBarrier -> FIX ME', () => {
    });

    describe('.validCompare -> FIX ME', () => {
    });

    describe('.validNotEqual -> FIX ME', () => {
    });

    describe('.validMin -> FIX ME', () => {
    });

    describe('.validLength -> FIX ME', () => {
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

    describe('.isMoreThanMax -> FIX ME', () => {
    });

    describe('.getPreBuildDVRs', () => {
        it('should return an object', () => {
            expect(rules).to.be.a('object');
        });
    });
});
