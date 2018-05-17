import React from 'react';
import classNames from 'classnames';
import Button from '../../../components/form/button.jsx';
import Popover from '../../../components/elements/popover.jsx';
import Tooltip from '../../../components/elements/tooltip.jsx';
import { connect } from '../../../store/connect';
import { localize } from '../../../../_common/localize';
import Url from '../../../../_common/url';

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
            <span className='payout'>
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

const Stake = ({ amount, symbol, status }) => {
    const stake_text_class    = classNames('symbols', symbol);
    const amount_status_class = classNames('amount', status);
    return (
        <React.Fragment>
            <h4 className='purchase-stake-header'>{localize('Stake')}:</h4>
            <div className={amount_status_class}>
                <span className={stake_text_class}/>
                <span>
                    {amount}
                </span>
            </div>
        </React.Fragment>
    );
};

// TO-DO - Replace return amount, profit amount, stake amount, payout amoun, and tooltip message
const Purchase = ({
    trade_types,
}) =>  (
    <fieldset>
        {Object.keys(trade_types).map((type, idx) => (
            <React.Fragment key={idx}>
                <div className='purchase-option'>
                    <div className='box'>
                        <Return amount='78.8' />
                        <NetProfit amount='220.39' symbol='usd' />
                    </div>
                    <div className='box'>
                        <Stake amount='260.36' symbol='usd' type={trade_types[type]} status='up'/>
                        <Payout amount='500.00' symbol='usd' />
                    </div>
                    <div>
                        <Tooltip
                            alignment='left'
                            message={localize('Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-04-04.')}
                        >
                            <Popover
                                subtitle='Test PopOver'
                            >
                                <Button
                                    id={`purchase_${type}`}
                                    icon={Url.urlForStatic(`images/trading_app/purchase/ic_dark_${trade_types[type].toLowerCase()}.svg`) || undefined}
                                    className='primary green'
                                    has_effect
                                    text={trade_types[type]}
                                />
                            </Popover>
                        </Tooltip>
                    </div>
                </div>
                <hr className={(idx === Object.keys(trade_types).length - 1 ? 'hide' : null)} />
            </React.Fragment>
        ))}
    </fieldset>
);

export default connect(
    ({trade}) => ({
        trade_types: trade.trade_types,
    })
)(Purchase);
