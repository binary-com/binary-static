import { expect }                                   from 'chai';
import sinon                                        from 'sinon';
import { getPreBuildDVRs, getPasswordLengthConfig } from '../declarative_validation_rules';

describe('getPasswordLengthConfig', () => {
    const malta_account_type = 'mt';
    const other_account_type = 'id';

    it('Expects return correct object when passing malta account type', () => {
        expect(getPasswordLengthConfig(malta_account_type)).to.eql({
            min: 8,
            max: 25
        });
    });

    it('Expects return correct object when passing other account type', () => {
        expect(getPasswordLengthConfig(other_account_type)).to.eql({
            min: 6,
            max: 25
        });
    });
});

describe('getPreBuildDVRs', () => {
    const anyFunction = () => {};
    const pre_build_dvrs = {
        address:        { func: anyFunction, message: '' },
        barrier:        { func: anyFunction, message: '' },
        compare:        { func: anyFunction, message: '' },
        email:          { func: anyFunction, message: '' },
        general:        { func: anyFunction, message: '' },
        length:         { func: anyFunction, message: '' },
        letter_symbol:  { func: anyFunction, message: '' },
        min:            { func: anyFunction, message: '' },
        not_equal:      { func: anyFunction, message: '' },
        number:         { func: anyFunction, message: '' },
        password:       { func: anyFunction, message: '' },
        phone:          { func: anyFunction, message: '' },
        postcode:       { func: anyFunction, message: '' },
        regular:        { func: anyFunction, message: '' },
        req:            { func: anyFunction, message: '' },
        signup_token:   { func: anyFunction, message: '' },
        tax_id:         { func: anyFunction, message: '' },
    };

    it('Expects pre_build_dvrs initialized if no arguments passed', () => {
        expect(Object.keys(getPreBuildDVRs())).to.eql(Object.keys(pre_build_dvrs));
    });

    it('Expects return pre build dvrs if there is pre-build dvrs', () => {
        getPreBuildDVRs()['address'].message = 'anymessage';

        expect(getPreBuildDVRs()['address'].message).to.eql('anymessage');
    });
});

describe('preBuildDVRs functions', () => {
    const DVRS = getPreBuildDVRs(); //initialize dvrs
    const password = 'pass1234';
    const wrong_password = 'wrong12';
    const wrong_options = new Object;
    const options = {
        to: '#txtPassword',
        min: 8,
        max: 25
    };
    const stubInit = () => {
        $ = sinon.stub();
        $.withArgs(options.to).returns({
            val: sinon.stub().returns(password)
        });
    }


    describe('validCompare', () => {
        it('expects return false if empty value passed', () => {
            expect(DVRS['compare'].func('', options)).to.be.false;
        });

        it('expects return true if the value match', () => {
            stubInit();
            expect(DVRS['compare'].func(password, options)).to.be.true;
        });

        it('expects false if the value is not match', () => {
            expect(DVRS['compare'].func(wrong_password, options)).to.be.false;
        });
    });

    describe('validNotEqual', () => {
        it('expects return true if empty value passed', () => {
            expect(DVRS['not_equal'].func('', options)).to.be.true;
        });

        it('expects return false if the value match', () => {
            stubInit();
            expect(DVRS['not_equal'].func(password, options)).to.be.false;
        });

        it('expects true if the value is not match', () => {
            expect(DVRS['not_equal'].func(wrong_password, options)).to.be.true;
        });
    });

    describe('validMin', () => {
        it('expects return true if options min is falsy', () => {
            expect(DVRS['min'].func(password, wrong_options)).to.be.true;
        });

        it('expects return true if value is more than equal 8 character', () => {
            expect(DVRS['min'].func(password, options)).to.be.true;
        });

        it('expects return false if value is less than equal 8 character', () => {
            expect(DVRS['min'].func(wrong_password, options)).to.be.false;
        });
    });

    describe('validLength', () => {
        it('expects return true if options min and max is falsy', () => {
            expect(DVRS['length'].func(password, wrong_options)).to.be.true;
        });

        it('expects return true if value is between the range of options', () => {
            expect(DVRS['length'].func(password, options)).to.be.true;
        });

        it('expects return false if value is not between the range of options', () => {
            expect(DVRS['length'].func(wrong_password, options)).to.be.false;
        });
    });

    describe('.validNumber', () => {
        const number_options = {
            min: 0,
            max: 200,
            type: null,
            decimals: 5
        };

        it('expects return true if value is empty or zero', () => {
           expect(DVRS['number'].func(0, number_options)).to.be.true;
        });
 
        it('expects return true if number is float within correct decimals', () => {
            number_options.type = 'float';
           expect(DVRS['number'].func(0.10, number_options)).to.be.true;
        });

        it('expects return false if number is float not within correct decimals', () => {
            expect(DVRS['number'].func(0.111111, number_options)).to.be.false;
        });

        it('expercts return true if value is integer', () => {
            number_options.type = 'int';
            expect(DVRS['number'].func(1, number_options)).to.be.true;
        });

        it('expects return false if value is string or characters', () => {
           expect(DVRS['number'].func('a', number_options)).to.be.false;
        });

        it('expects return false if value is neither integer or float', () => {
           expect(DVRS['number'].func(NaN, number_options)).to.be.false;
        });

        it('expects return false if the value is not within the range of min and max', () => {
           expect(DVRS['number'].func(500, options)).to.be.false;
        });
 
        it('expects return false for minus value', () => {
          expect(DVRS['number'].func(-1, options)).to.be.false;
        });
    });
});