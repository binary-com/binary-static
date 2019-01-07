import { expect }             from 'chai';
import { getPreBuildDVRs }    from '../declarative_validation_rules.js';

describe('declarative_validation_rules.js', () => {
    let rules;
    let options;

    beforeEach('Getting prebuilt DVRs and setting up options.', () => {
        rules = getPreBuildDVRs();
        options = {
            allow_empty: true,
            min: 0,
            max: 8,
            type: 'float',
            decimals: 2,
        }
    });

    describe('.validRequired', () => {
        it('should return false if value is undefined', () => {
            expect(rules['req'].func(undefined)).to.be.false;
        });
        it('should return false if value is null', () => {
            expect(rules['req'].func(null)).to.be.false;
        });
        it('should return false if value length is 0', () => {
            expect(rules['req'].func('')).to.be.false;
        });
        it('should return true if value length is larger than 0', () => {
            expect(rules['req'].func('a')).to.be.true;
        });
    });

    describe('.validEmail -> FIX ME', () => {
        it('should return false if username contains restricted characters', () => {
            let restricted_characters = '`!@#$%^&*=(){}[]:;"<>,?/~|\'\\'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `user$(restricted_character)name@proper.test`
                expect(rules['email'].func(mockvalue)).to.be.false;
            });
        });
        it('should return false if @ does not exist in the middle of an address', () => {
            expect(rules['email'].func('usernameproper.test'));
        });
        it('should return false if domain name contains restricted characters', () => {
            let restricted_characters = '`!@#$%^&*=(){}[]:;"<>,?/~|\'\\_+'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `username@pro$(restricted_character)per.test`;
                expect(rules['email'].func(mockvalue)).to.be.false;
            });
        });
        it('should return false if top level domain contains restricted characters', () => {
            let restricted_characters = '0123456789`~!@#$%^&*()_+-={}[]|:";<>?,./\\\''
            restricted_characters.forEac((restricted_character) => {
                let mockvalue = `username@proper.te$(restricted_character)st`;
                expect(rules['email'].func(mockvalue)).to.be.false;
            });
        });
        it('should return false if top level domain is smaller than 2', () => {
            expect(rules['email'].func('username@proper.t')).to.be.false;
        });
        it('should return false if top level domain is bigger than 63', () => {
            expect(rules['email'].func('username@proper.tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')).to.be.false;
        });
    });

    describe('.validPassword -> FIX ME', () => {
    });

    describe('.validLetterSymbol', () => {
        it('should return false if value contains restricted characters', () => {
            let restricted_characters = '`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `test_$(restricted_character)`;
                expect(rules['letter_symbol'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validGeneral', () => {
        it('should return false if value contains restricted characters', () => {
            let restricted_characters = '`~!@#$%^&*)(_=+[}{\]\\/";:?><|'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `test_$(restricted_character)`;
                expect(rules['general'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validAddress', () => {
        it('should return false if value contains restricted characters', () => {
            let restricted_characters = '`~!$%^&*_=+[}{\]\\"?><|'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `test_$(restricted_character)`;
                expect(rules['address'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validPostCode', () => {
        it('should return true if value is in allowed characters',() => {

        });
    });

    describe('.validPhone -> FIX ME', () => {
    });

    describe('.validRegular -> FIX ME', () => {
    });

    describe('.validEmailToken -> FIX ME', () => {
    });

    describe('.validTaxID -> FIX ME', () => {
    });

    describe('.validBarrier -> FIX ME', () => {
    });

    describe('.validCompare -> FIX ME', () => {
    });

    describe('.validNotEqual -> FIX ME', () => {
    });

    describe('.validMin', () => {
        it('should return true if options.min is null, undefined, or 0', () => {
            options.min = 0;
            expect(rules['min'].func('', options)).to.be.true;
        });
        it('should return true if value.length >= options.min', () => {
            options.min = 3;
            expect(rules['min'].func('000')).to.be.true;
        });
        it('should return false if value.length < options.min', () => {
            options.min = 1;
            expect(rules['min'].func('00')).to.be.false;
        });
    });

    describe('.validLength -> FIX ME', () => {
        it('should return true if value.length is in boundary', () => {
            options.min = 1;
            expect(rules['length'].func('00', options)).to.be.true;
        });
        it('should return false if value is smaller than minimum', () => {
            options.min = 1;
            expect(rules['length'].func('', options)).to.be.false;
        });
        it('should return false if value is bigger than maximum', () => {
            options.max = 1;
            expect(rules['length'].func('00', options)).to.be.false;
        });
        it('should return true if min and max is not set', () => {
            options.max = 0;
            expect(rules['length'].func('0', options)).to.be.true;
        });
    });

    describe('.validNumber', () => {
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
