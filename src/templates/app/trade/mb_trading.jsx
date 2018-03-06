import React from 'react';
import Analysis from './analysis.jsx';
import Loading from '../../_common/components/loading.jsx';
import Portfolio from '../user/portfolio.jsx';

const BuySellTemplate = () => (
    <React.Fragment>
        <div className='buy-price gr-12 gr-no-gutter-left'>
            <button className='price-button'>
                <span className='value-wrapper'>
                    <span className='dynamics' />
                    <span className='value' />
                </span>
                <span className='base-value invisible' />
            </button>
        </div>
        <div className='sell-price gr-12 gr-no-gutter-left'>
            <span className='price-wrapper'>
                <span className='value' />
                <span className='base-value invisible' />
            </span>
        </div>
    </React.Fragment>
);

const PayoutItem = ({
    className = '',
    hint,
    hint_class = '',
    text,
    value,
}) => (
    <div className={`${className} gr-3 nowrap`} value={value} unselectable='on'>
        {text}
        {hint && <div className={`hint ${hint_class}`}>{hint}</div>}
    </div>
);

const FormItem = ({
    class_current = '',
    class_list = '',
    className,
    exclude_current,
    exclude_list,
    id,
    children,
}) => (
    <div id={id} className={className}>
        {!exclude_current && <div className={`current ${class_current}`} />}
        {!exclude_list && <div className={`list invisible ${class_list}`}>{children}</div>}
    </div>
);

const MBTrading = () => (
    <React.Fragment>
        <div id='main_loading' className='center-text'>
            <Loading />
        </div>
        <div id='mb-trading-wrapper' className='mb-trading-wrapper gr-centered gr-12-p gr-12-m invisible'>
            <div className='gr-row'>

                <div className='gr-7 gr-12-m gr-12-p gr-order-2-m gr-order-2-p' id='chart_wrapper'>
                    <p className='error-msg' id='chart-error' />
                    <div id='trade_live_chart'>
                        <div id='webtrader_chart' />
                    </div>
                </div>

                <div className='gr-5 gr-12-m gr-12-p gr-no-gutter-left gr-gutter-left-p gr-gutter-left-m'>
                    <div id='mb_trading' className='gr-12'>

                        <div id='notifications_wrapper' className='gr-row' />

                        <div id='panel'>
                            <div className='gr-row selection_wrapper'>
                                <div id='trading_status' className='gr-4 gr-no-gutter-left'>
                                    <div className='gr-row'>
                                        <div className='gr-6 gr-no-gutter'>
                                            <a className='button-secondary trading-status' href='javascript:;'>
                                                <span className='selected' id='allow' />
                                            </a>
                                        </div>
                                        <div className='gr-6 gr-no-gutter'>
                                            <a className='button-secondary trading-status' href='javascript:;'>
                                                <span id='disallow' />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className='trade_form gr-8 gr-no-gutter-left'>
                                    <FormItem id='underlying' className='gr-12' class_current='gr-row' class_list='gr-row' />
                                </div>
                            </div>

                            <div className='gr-row selection_wrapper'>
                                <div className='trade_form gr-4 gr-no-gutter-left'>
                                    <div className='invisible ja-show' id='currency_wrapper'>
                                        <FormItem id='currency' />
                                        <FormItem id='payout' exclude_list class_list='gr-12' />
                                    </div>
                                    <div className='ja-hide gr-12'>
                                        <div id='payout_amount'>{it.L('Payout')}</div>
                                        <div className='gr-row'>
                                            <FormItem id='currency' className='gr-3 gr-no-gutter' class_current='gr-row' class_list='gr-3 gr-no-gutter' />
                                            <input className='gr-9 center-text' type='text' id='payout' maxLength='15' />
                                        </div>
                                    </div>
                                </div>
                                <div className='gr-8 gr-no-gutter-left'>
                                    <div className='trade_form'>
                                        <FormItem id='period' class_list='gr-12' />
                                    </div>
                                    <div className='trade_form'>
                                        <FormItem id='category' class_list='gr-12' />
                                    </div>
                                    <div className='trade_form no-margin'>
                                        <FormItem id='payout_list' className='invisible gr-12' exclude_current class_list='gr-row'>
                                            <PayoutItem value='+1'     text='+1'         className='plus' />
                                            <PayoutItem value='+10'    text='+10'        className='plus' />
                                            <PayoutItem value='50'     text='50' />
                                            <PayoutItem value='100'    text='100'        hint={it.L('(max)')} hint_class='invisible ja-show' />
                                            <PayoutItem value='-1'     text='-1'         className='minus' />
                                            <PayoutItem value='-10'    text='-10'        className='minus' />
                                            <PayoutItem value='ok'     text={it.L('OK')} className='green' />
                                            <PayoutItem value='cancel' text={it.L('Cancel')} />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='price-table gr-row'>
                            <div id='disable-overlay' className='invisible' />
                            <div className='prices-wrapper gr-12'>
                                <div className='gr-row heading'>
                                    <div className='gr-4 barrier align-self-center'>{it.L('Barrier')}</div>
                                    <div className='gr-4 buy-price gr-no-gutter-left'>
                                        {it.L('Buy Price')}
                                        <div className='hint sell-price'>{it.L('Sell Price')}</div>
                                    </div>
                                    <div className='gr-4 buy-price gr-no-gutter-left'>
                                        {it.L('Buy Price')}
                                        <div className='hint sell-price'>{it.L('Sell Price')}</div>
                                    </div>
                                </div>
                                <div className='price-rows' />
                            </div>
                            <div id='loading-overlay' className='invisible'>
                                <Loading />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Analysis no_graph />

            <div id='open_positions_container'>
                <Portfolio />
            </div>

            <div id='templates' className='invisible'>
                <div className='gr-row price-row'>
                    <div className='gr-4 barrier' />
                    <div className='gr-4'>
                        <BuySellTemplate />
                    </div>
                    <div className='gr-4'>
                        <BuySellTemplate />
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default MBTrading;
