import { expect } from 'chai';
import * as DateTime from '../date_time.js';
import moment from 'moment';

describe('toMoment', () => {
    it('return utc epoch value date based on client epoch value passed', () => {
        const epoch = 1544756041;

        expect(DateTime.toMoment(1544756041)).to.deep.equal(moment.unix(epoch).utc());
    });
});

describe('convertToUnix', () => {
    const setTime = (moment_obj, time) => {
        const [hour, minute, second] = time.split(':');
        moment_obj.hour(hour).minute(minute || 0).second(second || 0);

        return moment_obj;
    };

    it('return correct unix value when date and time passed', () => {
        const date_epoch = 1544745600;
        const time = "12:30";

        expect(DateTime.convertToUnix(date_epoch, time)).to.deep.equal(setTime(DateTime.toMoment(date_epoch), time).unix());
    });
});

describe('toGMTFormat', () => {
    it('return correct GMT value when no argument passed', () => {
        expect(DateTime.toGMTFormat()).to.deep.equal(moment().utc().format('YYYY-MM-DD HH:mm:ss [GMT]'));
    });

    it('return correct GMT value when argument passed', () => {
        const time_epoch = 1544757884620;
        expect(DateTime.toGMTFormat(time_epoch)).to.deep.equal(moment(time_epoch).utc().format('YYYY-MM-DD HH:mm:ss [GMT]'));
    });
});

describe('formatDate', () => {
    const date_format = "YYYY-MM-DD"
    it('return correct response when no argument passed', () => {
        expect(DateTime.formatDate()).to.eql('Invalid date');
    });

    it('return correct date value when argument passed', () => {
        const date = "2018-12-14"
        expect(DateTime.formatDate(date, date_format)).to.deep.equal(moment(date).format(date_format));
    });
})

describe('daysFromTodayTo', () => {
    it('return empty string when there is no argument passed', () => {
        expect(DateTime.daysFromTodayTo()).to.eql('');
    });

    it('return empty string if the user selected previous day', () => {
        const date = "2018-12-13";
        expect(DateTime.daysFromTodayTo(date)).to.eql('');
    });

    it('return difference value between selected date and today', () => {
        //using moment get date three days from now
        const date = "2018-12-20";
        const diff = moment(date).utc().diff(moment().utc(), 'days');
        expect(DateTime.daysFromTodayTo(date)).to.deep.equal(diff + 1);
    });
})

describe('convertDuration', () => {
    const start_time = moment() / 1000; //time epoch now
    const end_time = moment().add(3, 'minutes') / 1000;

    describe('getDiffDuration', () => {
        it('return correct value when argument passed', () => {
            //expecting 180000 == three minutes
            expect(DateTime.getDiffDuration(start_time, end_time)).to.eql(moment.duration(moment.unix(end_time).diff(moment.unix(start_time))));
        });
    });

    describe('formatDuration', () => {
        it('return correct value when argument passed', () => {
            const duration = moment.duration(moment.unix(end_time).diff(moment.unix(start_time)));// three minutes
            expect(DateTime.formatDuration(duration)).to.eql("00:03:00");
        })
    })
});