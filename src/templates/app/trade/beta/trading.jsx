import React from 'react';
import Analysis from './analysis.jsx';
import Loading from '../../../_common/components/loading.jsx';

const Trading = () => (
    <React.Fragment>
        <div id='trading_socket_container_beta' className='tab-menu-wrap gr-row'>
            <div className='gr-12'>
                <div id='notifications_wrapper'></div>
                <div id='loading_container' className='overlay_container'></div>

                <div className='gr-row'>
                    <div className='gr-6 gr-5-t gr-hide-p'>
                        <div id='guideBtn'></div>
                    </div>
                    <div className='gr-6 gr-7-t gr-12-p gr-12-m' id='contract_symbol_container'>
                        <select id='contract_markets'></select>
                        <div>
                            <select id='underlying'></select>
                            <span className='unicode-info-icon' id='symbol_tip' target=''>&#9432;</span>
                            <span id='spot'></span>
                            <span id='trading_worm_chart'></span>
                        </div>
                    </div>
                </div>

                <div className='gr-row' id='contract_form_content_wrapper'>
                    <div className='col-analyse gr-6 gr-5-t gr-12-p gr-12-m'>
                        <Analysis />
                    </div>
                    <div className='col-trade gr-6 gr-7-t gr-12-p gr-12-m'>
                        <div className='content-tab-container'>
                            <div id='contract_market_form_container'>
                                <ul className='nav tm-ul follow-default' id='contract_form_name_nav'></ul>
                            </div>
                            <div id='contract_container' className='col row'>
                                <div id='loading_container3' className='overlay_container'></div>
                                <div id='contract_form_container' className='col'>
                                    <div id='contract_form_content' className='gr-gutter'>
                                        <form id='websocket_form'>
                                            <div className='row' id='date_start_row'>
                                                <div className='col form_label' id='start_time_label'>{it.L('Start time')}</div>
                                                <div className='big-col'>
                                                    <select id='date_start'></select>
                                                </div>
                                            </div>
                                            <div className='row' id='expiry_row'>
                                                <div className='col form_label'>
                                                    <select id='expiry_type'></select>
                                                </div>
                                                <div className='big-col'>
                                                    <div id='expiry_type_duration'>
                                                        <input id='duration_amount' type='number' className='small_width_input' autoComplete='off' />
                                                        <label></label>
                                                        <select id='duration_units' className='medium_width_input'></select>
                                                        <span id='duration_tooltip_wrapper'>
                                                            <span id='duration_tooltip' data-balloon={it.L('minimum available duration')}>{it.L('min')}</span>
                                                            <span id='duration_minimum'></span>
                                                            <span id='duration_maximum' className='invisible'></span>
                                                        </span>
                                                    </div>
                                                    <div id='expiry_type_endtime'>
                                                        <input id='expiry_date' readOnly='readonly' type='text' autoComplete='off' />
                                                        <input id='expiry_time' type='text' autoComplete='off' />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row barrier_class' id='barrier_row'>
                                                <div className='col form_label'>
                                                    <label htmlFor='H' id='barrier_label'>
                                                        <span id='barrier_tooltip' data-balloon={it.L('Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received')} data-balloon-length='xlarge'>{it.L('Barrier offset')}</span>
                                                        <span id='barrier_span'>{it.L('Barrier')}</span>
                                                    </label>
                                                </div>
                                                <div className='big-col'>
                                                    <input id='barrier' type='text' name='H' autoComplete='off' />
                                                    <span id='indicative_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge'></span>
                                                </div>
                                            </div>
                                            <div className='row barrier_class' id='high_barrier_row'>
                                                <div className='col form_label'>
                                                    <label htmlFor='H' id='barrier_high_label'>
                                                        <span id='barrier_high_tooltip' data-balloon={it.L('Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received')} data-balloon-length='xlarge'>{it.L('High barrier offset')}</span>
                                                        <span id='barrier_high_span'>{it.L('High barrier')}</span>
                                                    </label>
                                                </div>
                                                <div className='big-col'>
                                                    <input id='barrier_high' type='text' name='H' autoComplete='off' />
                                                    <span id='indicative_high_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge'></span>
                                                </div>
                                            </div>
                                            <div className='row barrier_class' id='low_barrier_row'>
                                                <div className='col form_label'>
                                                    <label htmlFor='L' id='barrier_low_label'>
                                                        <span id='barrier_low_tooltip' data-balloon={it.L('Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received')} data-balloon-length='xlarge'>{it.L('Low barrier offset')}</span>
                                                        <span id='barrier_low_span'>{it.L('Low barrier')}</span>
                                                    </label>
                                                </div>
                                                <div className='big-col'>
                                                    <input id='barrier_low' type='text' name='L' autoComplete='off' />
                                                    <span id='indicative_low_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge'></span>
                                                </div>
                                            </div>
                                            <div className='row' id='prediction_row'>
                                                <div className='col form_label'>
                                                    <label htmlFor='prediction' id='prediction_label'>{it.L('Last Digit Prediction')}</label>
                                                </div>
                                                <div className='big-col'>
                                                    <select id='prediction' className='small_width_input'>
                                                        { Array.from(new Array(10)).map((x, idx) => (
                                                            <option key={idx} value={idx}>{idx}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row' id='payout_row'>
                                                <div className='col form_label'>
                                                    <select id='amount_type'>
                                                        <option value='payout' id='payout_option'>{it.L('Payout')}</option>
                                                        <option value='stake' id='stake_option'>{it.L('Stake')}</option>
                                                    </select>
                                                </div>
                                                <div className='row-inner big-col'>
                                                    <div className='col-inner'>
                                                        <select id='currency' className='small_width_input'></select>
                                                        <input id='amount' type='text' step='any' maxLength='10' defaultValue='10' className='medium_width_input' autoComplete='off' />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='contract_prices_container'>
                            <div id='contract_confirmation_container' className='overlay_container col'>
                                <a className='close' id='close_confirmation_container'></a>
                                <div id='confirmation_message_container'>
                                    <div id='confirmation_message'>
                                        <h3 id='contract_purchase_heading'></h3>
                                        <div id='contract_purchase_contents'>
                                            <div id='contract_purchase_brief'></div>
                                            <div className='gr-12'>
                                                <div className='gr-row'>
                                                    <div className='gr-4 gr-12-m' id='contract_purchase_profit_list'>
                                                        <div id='chart-values'>
                                                            <table>
                                                                <tr>
                                                                    <td id='chart_values_tick'>{it.L('Tick')}</td>
                                                                    <td id='chart_values_tick_value'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td id='chart_values_time'>{it.L('Time')}</td>
                                                                    <td id='chart_values_time_value'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td id='chart_values_price'>{it.L('Price')}</td>
                                                                    <td id='chart_values_price_value'></td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div id='contract-values'>
                                                            <table>
                                                                <tr>
                                                                    <td id='contract_purchase_cost'></td>
                                                                    <td id='contract_purchase_cost_value'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td id='contract_purchase_payout'></td>
                                                                    <td id='contract_purchase_payout_value'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td id='contract_purchase_barrier'></td>
                                                                    <td id='contract_purchase_barrier_value'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td id='contract_purchase_profit'></td>
                                                                    <td id='contract_purchase_profit_value'></td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div className='contract_purchase_reference gr-hide-m'></div>
                                                    </div>
                                                    <div className='gr-8 gr-12-m gr-no-gutter' id='contract_purchase_description_section'>
                                                        <div id='contract_purchase_descr'></div>
                                                        <button id='contract_purchase_button' className='button open_contract_details'>{it.L('View Details')}</button>
                                                        <div id='contract_purchase_spots'>
                                                            <div id='current_tick_number'></div>
                                                            <div id='current_tick_spot'></div>
                                                            <div id='last_digits_list' className='gr-row'></div>
                                                        </div>
                                                        <div id='tick_chart'></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button id='contract_purchase_new_trade' className='button gr-hide gr-show-m'>{it.L('New Trade')}</button>
                                            <div className='contract_purchase_reference gr-hide gr-show-m'></div>
                                            <div className='invisible' id='contract_purchase_balance'></div>
                                        </div>
                                    </div>
                                    <div id='confirmation_error'>
                                        <h3 id='confirmation_error_heading'>{it.L('There was an error')}</h3>
                                        <div id='confirmation_error_contents' className='center-text'></div>
                                    </div>
                                </div>
                                <div id='confirmation_message_endelement'></div>
                            </div>
                            <div className='gr-row' id='contracts_list'>
                                <div id='loading_container2' className='overlay_container gr-12'><div></div></div>
                                <div className='gr-6 gr-12-m price-left'>
                                    <div className='price_container' id='price_container_top'>
                                        <div className='price_wrapper'>
                                            <div className='gr-row'>
                                                <div className='gr-5 align-start'>
                                                    <h4 className='contract_heading'></h4>
                                                </div>
                                                <div className='amount_wrapper gr-7 align-start'>
                                                    <div className='stake_wrapper'>
                                                        <div className='stake'></div>
                                                        <div className='contract_amount'></div>
                                                    </div>
                                                    <div className='payout_wrapper'>
                                                        <div className='payout'></div>
                                                        <div className='contract_payout'></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='gr-row'>
                                                <div className='contract_purchase button gr-12 clear'>
                                                    <button className='purchase_button contract_description no-underline' id='purchase_button_top' data-balloon-length='medium' value='purchase'>{it.L('Purchase')}</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col price_comment'></div>
                                        <div className='col contract_error'></div>
                                    </div>
                                </div>
                                <div className='gr-6 gr-12-m price-right'>
                                    <div className='price_container' id='price_container_bottom'>
                                        <div className='price_wrapper'>
                                            <div className='gr-row'>
                                                <div className='gr-5 align-start'>
                                                    <h4 className='contract_heading'></h4>
                                                </div>
                                                <div className='amount_wrapper gr-7 align-start'>
                                                        <div className='stake_wrapper'>
                                                            <div className='stake'></div>
                                                            <div className='contract_amount'></div>
                                                        </div>
                                                        <div className='payout_wrapper'>
                                                            <div className='payout'></div>
                                                            <div className='contract_payout'></div>
                                                        </div>
                                                </div>
                                            </div>
                                            <div className='gr-row'>
                                                <div className='contract_purchase button gr-12 clear'>
                                                    <button className='purchase_button contract_description no-underline' id='purchase_button_bottom' data-balloon-length='medium' value='purchase'>{it.L('Purchase')}</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col price_comment'></div>
                                        <div className='col contract_error'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id='all_prices'></div>
        <div id='trading_init_progress'>
            <Loading />
        </div>
    </React.Fragment>
);

export default Trading;
