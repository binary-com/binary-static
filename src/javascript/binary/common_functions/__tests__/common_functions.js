const expect          = require('chai').expect;
const CommonFunctions = require('../common_functions');


describe('CommonFunctions', () => {
    describe('.checkInput()', () => {
        it('detects that mochaTest does not support date type', () => {
            expect(CommonFunctions.checkInput('date', 'not-a-date')).to.eq(false);
        });
    });
});
