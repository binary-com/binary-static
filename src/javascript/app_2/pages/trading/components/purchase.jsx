import React from 'react';
// import classNames from 'classnames';
import Button from '../../../components/form/button.jsx';
import { connect } from '../../../store/connect';
import Tooltip from '../../../components/elements/tooltip.jsx';
import { localize } from '../../../../_common/localize';

const NetProfit = ({ amount, symbol }) => (
    <React.Fragment>
        <h4 className='net-profit-header'>{localize('Net Profit')}:</h4>
        <div className='amount'>
            <span className={`symbols ${symbol}`} />
            <span>
                {amount}
            </span>
        </div>
    </React.Fragment>
);

const Payout = ({ amount, symbol }) => (
    <React.Fragment>
        <h4 className='payout-header'>{localize('Payout')}:</h4>
        <div className='amount'>
            <span className={`symbols ${symbol}`} />
            <span>
                {amount}
            </span>
        </div>
    </React.Fragment>
);

const Return = ({ amount }) => (
    <React.Fragment>
        <h4 className='purchase-return-header'>{localize('Return')}:</h4>
        <span className='purchase-return'>{amount}%</span>
    </React.Fragment>
);

const Stake = ({ amount, symbol, type }) => (
    <React.Fragment>
        <h4 className='purchase-stake-header'>{localize('Stake')}:</h4>
        <div className='amount'>
            <span className={`symbols ${symbol} suffix--${type}`}/>
            <span>
                {amount}
            </span>
        </div>
    </React.Fragment>
);

const Purchase = ({
    trade_types,
}) =>  (
    <fieldset>
        {Object.keys(trade_types).map((type, idx) => (
            <div key={idx} className='purchase-option'>
                <div className='box'>
                    <Return amount='78.8' />
                    <NetProfit amount='220.39' symbol='usd' />
                </div>
                <div className='box'>
                    <Stake amount='260.36' symbol='usd' type={trade_types[type]}/>
                    <Payout amount='500.00' symbol='usd' />
                </div>
                <div>
                    <Tooltip
                        alignment='left'
                        message={localize('Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-04-04.')}
                    >
                        <Button
                            id={`purchase_${type}`}
                            className='primary green'
                            has_effect
                            text={trade_types[type]}
                        />
                    </Tooltip>
                </div>
            </div>
        ))}
    </fieldset>
);

export default connect(
    ({trade}) => ({
        trade_types: trade.trade_types,
    })
)(Purchase);
