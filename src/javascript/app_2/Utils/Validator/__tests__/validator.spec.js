import { expect }           from 'chai';

import { getPreBuildDVRs }  from '../declarative_validation_rules';
import Error                from '../errors';
import Validator            from '../validator';

describe('Validator', () => {
    const input = 'TestInput';
    const rules = getPreBuildDVRs();
    const validator = new Validator(
        input,
        rules,
    );

    describe('.constructor', () => {
        it('should set class variables properly', () => {
            expect(validator.input).to.eql(input);
            expect(validator.rules).to.eql(rules);
            expect(validator.store).to.eql(null);
            expect(typeof validator.errors).to.eql('object');
            expect(validator.error_count).to.eql(0);
        });
    });

    describe('.addfailure', () => {
        it('should add failure', () => {
            const ruleObject = Validator.getRuleObject('length');
            validator.addFailure(input, ruleObject);

            expect(validator.errors.errors).to.have.property(input);
            expect(validator.error_count).to.eql(1);
        });
    });

    describe('.check', () => {
        it('should run validator', () => {
            expect(validator.check()).to.eql(false);
        });
    });

    describe('.isPassed', () => {
        it('should return result from .check', () => {
            expect(validator.isPassed()).to.eql(false);
        });
    });

    describe('.getRuleObject', () => {
        it('should get rule object', () => {
            const rule = Validator.getRuleObject('length');
            expect(rule).to.eql({
                name: 'length',
                options: {},
                validator: rules['length'].func,
            });
        });
    });
});
