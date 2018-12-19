import { expect }   from 'chai';
import getBaseName  from '../base_name';

describe('base_name.js', () => {
    describe('.getBaseName', () => {
        var window = global.window;

        it('should return basename from url', () => {
            expect(getBaseName()).to.eql('');
        });

        it('should return /app/en/ if basename does not exist', () => {
            expect(getBaseName()).to.eql('/app/en/')
        });
    });
});
