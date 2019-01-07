import { expect } from 'chai';
import sinon from 'sinon';
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
    const options = {
        to: '#txtPassword',
        min: 8,
        max: 25
    };

    describe('validCompare', () => {
        global.$ = sinon.stub();

        $.withArgs(options.to).returns({
            val: sinon.stub().returns('pass123')
        });

        it('expects return false if empty value passed', () => {
            expect(DVRS['compare'].func('', options)).to.be.false;
        });

        it('expects return true if the value match', () => {
            expect(DVRS['compare'].func('pass123', options)).to.be.true;
        });

        it('expects false if the value is not match', () => {
            expect(DVRS['compare'].func('wrongpass123', options)).to.be.false;
        });
    });
});