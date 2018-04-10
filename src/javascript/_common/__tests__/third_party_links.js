const expect         = require('chai').expect;
const AccountOpening = require('../third_party_links');

describe('ThirdPartyLinks', () => {
    describe('.isThirdPartyLink()', () => {
        it('works for binary.com', () => {
            expect(AccountOpening.isThirdPartyLink('https://www.binary.com')).to.equal(false);
        });
        it('works for binary.com subdomains', () => {
            expect(AccountOpening.isThirdPartyLink('https://www.style.binary.com')).to.equal(false);
            expect(AccountOpening.isThirdPartyLink('https://login.binary.com/signup.php?lang=0')).to.equal(false);
        });
        it('works for special values', () => {
            expect(AccountOpening.isThirdPartyLink('javascript:;')).to.equal(false);
            expect(AccountOpening.isThirdPartyLink('#')).to.equal(false);
            expect(AccountOpening.isThirdPartyLink('mailto:affiliates@binary.com')).to.equal(false);
        });
        it('works for third party domains', () => {
            expect(AccountOpening.isThirdPartyLink('https://www.authorisation.mga.org.mt/verification.aspx?lang=EN&company=a5fd1edc-d072-4c26-b0cd-ab3fa0f0cc40&details=1')).to.equal(true);
            expect(AccountOpening.isThirdPartyLink('https://twitter.com/Binarydotcom')).to.equal(true);
        });
    });
});
