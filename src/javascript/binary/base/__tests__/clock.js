const expect      = require('chai').expect;
const Clock       = require('../clock');
const setJPClient = require('./tests_common').setJPClient;

describe('Clock', () => {
    describe('.toJapanTimeIfNeeded()', () => {
        const toJapanTimeIfNeeded = Clock.toJapanTimeIfNeeded;

        const gmt_time_str = '2017-06-14 20:34:56';
        const jp_time_str  = '2017-06-15 05:34:56';
        const longCode     = time => (`Win payout if AUD/JPY is higher than or equal to 82.676 at ${time}.`);

        describe('General', () => {
            it('returns null on empty input', () => {
                expect(toJapanTimeIfNeeded()).to.be.a('null');
            });
            it('returns null on invalid input', () => {
                expect(toJapanTimeIfNeeded('InvalidDateTime')).to.be.a('null');
            });
        });

        describe('Non-Japanese client', () => {
            it('returns the correct time', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str)).to.be.a('string')
                    .and.to.be.eq(gmt_time_str);
            });
            it('returns the correct time having timezone', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, true)).to.be.a('string')
                    .and.to.be.eq(`${gmt_time_str} +00:00`);
            });
            it('returns the correct time without seconds', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, false, '', true)).to.be.a('string')
                    .and.to.be.eq(gmt_time_str.replace(/:\d{2}$/, ''));
            });
            it('returns the correct time inside the long_code', () => {
                expect(toJapanTimeIfNeeded(null, false, longCode(gmt_time_str))).to.be.a('string')
                    .and.to.be.eq(longCode(gmt_time_str));
            });
        });

        describe('Japanese client', () => {
            before(setJPClient);

            it('returns the correct time', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str)).to.be.a('string')
                    .and.to.be.eq(jp_time_str);
            });
            it('returns the correct time having timezone', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, true)).to.be.a('string')
                    .and.to.be.eq(`${jp_time_str} UTC+09:00`);
            });
            it('returns the correct time without seconds', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, false, '', true)).to.be.a('string')
                    .and.to.be.eq(jp_time_str.replace(/:\d{2}$/, ''));
            });
            it('returns the correct time inside the long_code', () => {
                expect(toJapanTimeIfNeeded(null, false, longCode(gmt_time_str))).to.be.a('string')
                    .and.to.be.eq(longCode(jp_time_str));
            });
        });
    });
});
