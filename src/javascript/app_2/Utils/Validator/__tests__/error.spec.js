import { expect }   from 'chai';
import Errors       from '../errors';

describe('Error', () => {
    let errors;
    beforeEach('Setting up Errors object', () => {
        errors = new Errors();
        errors.add('HTTPCodes', '100');
    });

    describe('.add', () => {
        it('should equal to 1 as an error is added', () => {
            expect(errors.errors).to.have.property('HTTPCodes').with.length(1);
        });
    });

    describe('.all', () => {
        it('should return all errors', () => {
            errors.add('HTTPCodes', '101');
            expect(errors.all()).to.have.property('HTTPCodes').with.lengthOf(2);
        });
    });

    describe('.first', () => {
        it('should return first error if attribute exists', () => {
            expect(errors.first('HTTPCodes')).to.eql('100');
        });
    });

    describe('.get', () => {
        it('should return data if attribute exists', () => {
            expect(errors.get('HTTPCodes')).to.eql(['100']);
        });
        it('should return [] if attribute does not exist', () => {
            expect(errors.get('')).to.eql([]);
        });
    });

    describe('.has', () => {
        it('should return true if attribute exists', () => {
            expect(errors.has('HTTPCodes')).to.be.true;
        });
        it('should return false if attribute does not exists', () => {
            expect(errors.has('')).to.be.false;
        });
    });
});
