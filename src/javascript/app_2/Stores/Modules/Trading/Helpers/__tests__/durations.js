import { expect } from 'chai';
import * as Duration from '../duration.js';
import BinarySocket from '_common/base/socket_base';

describe('buildDurationConfig', () => {
    const contract = {
        barrier_category: "euro_atm",
        barriers: 0,
        contract_category: "callput",
        contract_category_display: "Up/Down",
        contract_display: "Higher",
        contract_type: "CALL",
        exchange_name: "FOREX",
        expiry_type: "daily",
        market: "forex",
        max_contract_duration: "365d",
        min_contract_duration: "1d",
        sentiment: "up",
        start_type: "spot",
        submarket: "major_pairs",
        underlying_symbol: "frxAUDJPY"
    }

    const durations = {
        min_max: {
            spot: {
                daily: {
                    min: 86400,
                    max: 31536000
                },
            }
        },
        units_display: {
            spot: [{
                text: "days",
                value: "d"
            }]
        }
    }

    it('Returns correct value when durations is not passed', () => {
        expect(Duration.buildDurationConfig(contract)).to.eql(durations);
    });

    it('Returns correct value when durations passed', () => {
        expect(Duration.buildDurationConfig(contract, durations)).to.eql(durations);
    });

});

describe('convertDurationUnit', () => {
    it('Returns null if the arguments are empty value', () => {
        expect(Duration.convertDurationUnit('','','')).to.be.null;
    })
    it('Returns null if there is no arguments', () => {
        expect(Duration.convertDurationUnit()).to.be.null;
    })
    it('Returns correct value for 1 day duration', () => {
        expect(Duration.convertDurationUnit("1", "d", "s")).to.eql(86400);
    });

    it('Returns correct value for 1 year duration', () => {
        expect(Duration.convertDurationUnit("365", "d", "s")).to.eql(31536000);
    });

    it('Returns correct value for 5 minute duration', () => {
        expect(Duration.convertDurationUnit("5", "m", "s")).to.eql(300);
    });

    it('Returns correct value for 3 minute duration', () => {
        expect(Duration.convertDurationUnit("3", "m", "s")).to.eql(180);
    });
});

describe('getExpiryType', () => {
    const serverTime = async () => {
        const { time: server_time } = await BinarySocket.send({ time: 1 });
        return server_time;
    }

    it('Return correct value when server time passed', () => {
        const store = {
            duration_unit: 't',
            expiry_date: '2018-12-13',
            expiry_type: 'duration',
            root_store: {
                common: {
                    server_time: serverTime(),
                }
            }
        }

        expect(Duration.getExpiryType(store)).to.eql('tick');
    });

});

describe('convertDurationLimit', () => {
    it('Returns correct value for ticks unit', () => {
        expect(Duration.convertDurationLimit(5, "t")).to.eql(5);
    });

    it('Returns correct value for minutes unit', () => {
        expect(Duration.convertDurationLimit(180, "m")).to.eql(3);
    });

    it('Returns correct value for hour unit', () => {
        expect(Duration.convertDurationLimit(7200, "h")).to.eql(2);
    });

    it('Returns correct value for day unit', () => {
        expect(Duration.convertDurationLimit(86400, "d")).to.eql(1);
    });

});