import { expect }       from 'chai';
import * as Language    from '../language';

describe('language.js', () => {
    describe('.getAllowedLanguages', () => {
        it('should return an object', () => {
            expect(Language.getAllowedLanguages()).to.a('object');
        });
        it('should return only allowed language', () => {
            expect(Language.getAllowedLanguages()).to.not.have.property('ACH');
        });
    });
});
