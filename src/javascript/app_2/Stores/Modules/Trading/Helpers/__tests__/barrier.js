import { expect }              from 'chai';
import React                   from 'react';
import { buildBarriersConfig } from '../barrier';

describe('buildBarriersConfig', () => {
    it('Returns Undefined it contract has no barriers', () => {
        const contract = {
            "barrier_category":"euro_atm",
            "contract_category":"callput",
            "contract_category_display":"Up\/Down",
            "contract_display":"Higher",
            "contract_type":"CALL",
            "exchange_name":"FOREX",
            "expiry_type":"daily",
            "market":"forex",
            "max_contract_duration":"365d",
            "min_contract_duration":"1d",
            "sentiment":"up",
            "start_type":"spot",
            "submarket":"major_pairs",
            "underlying_symbol":"frxAUDJPY"
        };

        expect(buildBarriersConfig(contract)).to.eql(undefined);
    });

    it('Returns barriers with added values when contract has barrier but equals to zero', () => {
        const contract = {
            "barrier_category":"euro_atm",
            "barriers":0,
            "contract_category":"callput",
            "contract_category_display":"Up\/Down",
            "contract_display":"Higher",
            "contract_type":"CALL",
            "exchange_name":"FOREX",
            "expiry_type":"daily",
            "market":"forex",
            "max_contract_duration":"365d",
            "min_contract_duration":"1d",
            "sentiment":"up",
            "start_type":"spot",
            "submarket":"major_pairs",
            "underlying_symbol":"frxAUDJPY"
        };
        expect(buildBarriersConfig(contract)).to.eql(undefined);
    });

    it('Returns barriers with including empty object when contract has barriers but not values', () => {
        const contract = {
            "barrier_category":"euro_atm",
            "barriers":1,
            "contract_category":"callput",
            "contract_category_display":"Up\/Down",
            "contract_display":"Higher",
            "contract_type":"CALL",
            "exchange_name":"FOREX",
            "expiry_type":"daily",
            "market":"forex",
            "max_contract_duration":"365d",
            "min_contract_duration":"1d",
            "sentiment":"up",
            "start_type":"spot",
            "submarket":"major_pairs",
            "underlying_symbol":"frxAUDJPY"
        };
        expect(buildBarriersConfig(contract)).to.eql({
            count: 1,
            daily: {},
        });
    });

    it('Returns barriers with added values when contract has barriers', () => {
        const contract = {
            "barrier_category":"euro_atm",
            "barriers":1,
            "low_barrier": 22,
            "barrier": 33,
            "high_barrier": 44,
            "contract_category":"callput",
            "contract_category_display":"Up\/Down",
            "contract_display":"Higher",
            "contract_type":"CALL",
            "exchange_name":"FOREX",
            "expiry_type":"daily",
            "market":"forex",
            "max_contract_duration":"365d",
            "min_contract_duration":"1d",
            "sentiment":"up",
            "start_type":"spot",
            "submarket":"major_pairs",
            "underlying_symbol":"frxAUDJPY"
        };
        expect(buildBarriersConfig(contract)).to.eql({
            count: 1,
            daily: {
                "low_barrier": 22,
                "barrier": 33,
                "high_barrier": 44,
            },
        });
    });

    it('Returns barriers with some of the values when contract has barriers and some of the values', () => {
        const contract = {
            "barrier_category":"euro_atm",
            "barriers":1,
            "low_barrier": 22,
            "barrier": 33,
            "contract_category":"callput",
            "contract_category_display":"Up\/Down",
            "contract_display":"Higher",
            "contract_type":"CALL",
            "exchange_name":"FOREX",
            "expiry_type":"daily",
            "market":"forex",
            "max_contract_duration":"365d",
            "min_contract_duration":"1d",
            "sentiment":"up",
            "start_type":"spot",
            "submarket":"major_pairs",
            "underlying_symbol":"frxAUDJPY"
        };
        expect(buildBarriersConfig(contract)).to.eql({
            count: 1,
            daily: {
                "low_barrier": 22,
                "barrier": 33,
            },
        });
    });
});
