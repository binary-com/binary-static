import { expect }                     from 'chai';
import moment                         from 'moment';
import React                          from 'react';
import { buildForwardStartingConfig } from '../start_date';

describe('buildForwardStartingConfig', () => {
    it('Returns empty object when forward_starting_options and forward_starting_dates are both empties', () => {
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
        expect(buildForwardStartingConfig(contract, {})).to.eql({});
    });

    // it('Returns', () => {
    //     const contract = {
    //         "barrier_category":"euro_atm",
    //         "barriers":0,
    //         "contract_category":"callput",
    //         "contract_category_display":"Up\/Down",
    //         "contract_display":"Higher",
    //         "contract_type":"CALL",
    //         "exchange_name":"FOREX",
    //         "expiry_type":"daily",
    //         "market":"forex",
    //         "max_contract_duration":"365d",
    //         "min_contract_duration":"1d",
    //         "sentiment":"up",
    //         "start_type":"spot",
    //         "submarket":"major_pairs",
    //         "underlying_symbol":"frxAUDJPY",
    //         "forward_starting_options":[{"close":1543363199,"date":1543276800,"open":1543276800},{"close":1543449599,"date":1543363200,"open":1543363200},{"close":1543535999,"date":1543449600,"open":1543449600}]
    //     };
    //
    //     const getSessions = (open, close) => {return { open: moment.unix(open).utc(), close: moment.unix(close).utc() }};
    //     const getText     = date => moment.unix(date).format('ddd - DD MMM, YYYY');
    //     expect(buildForwardStartingConfig(contract, {})).to.eql([
    //         {
    //             text: getText(1543276800),
    //             value: 1543276800,
    //             sessions: getSessions(1543276800,1543363199)
    //         },
    //         {
    //             text: getText(1543363200),
    //             value: 1543363200,
    //             sessions: getSessions(1543363200,1543449599)
    //         },
    //         {
    //             text: getText(1543449600),
    //             value: 1543449600,
    //             sessions: getSessions(1543449600,1543535999)
    //         }
    //     ]);
    //
    // });
});

