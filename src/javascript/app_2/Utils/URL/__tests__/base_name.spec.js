import { expect }   from 'chai';
import getBaseName  from '../base_name';

describe('base_name.js', () => {
    describe('.getBaseName', () => {
        it('should return basename from url', () => {
            global.window.location.pathname = 'app/en/statement';
            expect(getBaseName()).to.eql('/app/en/');
        });

        it('should return /app/en/ if basename does not exist', () => {
            global.window.location.pathname = '';
            expect(getBaseName()).to.eql('/app/en/');
        });
    });
});
