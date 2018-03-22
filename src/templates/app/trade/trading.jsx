import React from 'react';
import Analysis from './analysis.jsx';
import Portfolio from '../user/portfolio.jsx';
import Loading from '../../_common/components/loading.jsx';

const Trading = () => (
    <React.Fragment>
        <div id='trading_socket_container' className='tab-menu-wrap'>
            <div id='notifications_wrapper' />
            <div id='loading_container' className='overlay_container' />
            <a id='deposit_btn_trade' className='client_real invisible gr-hide-m button' href={it.url_for('cashier/forwardws?action=deposit')}>
                <span>
                    <img src={it.url_for('images/common/plus.svg')} />
                    {it.L('Deposit')}
                </span>
            </a>
            <div className='client_virtual invisible'>
                <div id='upgrade_btn_trade' className='invisible upgrademessage gr-hide-m'>
                    <a className='button' />
                </div>
            </div>
            <div className='client_virtual client_logged_out invisible' id='guideBtn' />
            <div className='row' id='contract_symbol_container'>
                <div id='contract_markets_container'>
                    <select id='contract_markets' />
                </div>
                <div>
                    <select id='underlying' />
                    <span className='unicode-info-icon' id='symbol_tip' target=''>&#9432;</span>
                    <span id='spot' />
                    <span id='trading_worm_chart' />
                </div>
                <ul id='market_menu' />
            </div>
            <div className='row clear' id='contract_form_content_wrapper'>
                <div className='col row-inner'>
                    <div id='contract_market_form_container'>
                        <ul className='nav tm-ul follow-default' id='contract_form_name_nav' />
                    </div>
                    <div id='contract_container' className='col row'>
                        <div id='loading_container3' className='overlay_container' />
                        <div id='contract_form_container' className='col'>
                            <div id='contract_form_content' className='gr-gutter'>
                                <form id='websocket_form'>
                                    <div className='row' id='date_start_row'>
                                        <div className='col form_label' id='start_time_label'>{it.L('Start time')}</div>
                                        <div className='big-col'>
                                            <select id='date_start' />
                                            <div id='time_start_row' className='invisible'>
                                                <input type='text' id='time_start' autoComplete='off' readOnly='readonly' className='medium_width_input' />
                                                <span className='gr-gutter-left'>GMT</span>
                                            </div>
                                            <div>
                                                <div className='hint invisible'>{it.L('Asset open hours:')} <span id='asset_open_hours' /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' id='expiry_row'>
                                        <div className='col form_label'>
                                            <select id='expiry_type' />
                                        </div>
                                        <div className='big-col'>
                                            <div id='expiry_type_duration'>
                                                <input id='duration_amount' type='number' className='small_width_input' autoComplete='off' /><label />
                                                <select id='duration_units' className='medium_width_input' />
                                            </div>
                                            <div id='duration_wrapper' className='hint'>
                                                <span id='duration_tooltip'>{it.L('The minimum duration is')}</span> <span id='duration_minimum' /> <span id='duration_unit' />
                                                <span id='duration_maximum' className='invisible' />
                                            </div>
                                            <div id='expiry_type_endtime'>
                                                <input id='expiry_date' type='text' readOnly='readonly' autoComplete='off' />
                                                <div id='expiry_time_row'>
                                                    <input id='expiry_time' type='text' autoComplete='off' readOnly='readonly' className='medium_width_input' />
                                                    <span className='gr-gutter-left'>GMT</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row barrier_class' id='barrier_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='H' id='barrier_label'>
                                                <span id='barrier_tooltip'  data-balloon={it.L('Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received')} data-balloon-length='xlarge'>{it.L('Barrier offset')}</span>
                                                <span id='barrier_span'>{it.L('Barrier')}</span>
                                            </label>
                                        </div>
                                        <div className='big-col'>
                                            <input id='barrier' type='text' name='H' autoComplete='off' />
                                            <span id='indicative_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge' />
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
                                            <span id='indicative_high_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge' />
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
                                            <span id='indicative_low_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge' />
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
                                    <div className='row' id='multiplier_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='multiplier' id='multiplier_label'>{it.L('Multiplier')}</label>
                                        </div>
                                        <div className='row-inner big-col'>
                                            <div className='col-inner'>
                                                <select className='currency small_width_input' />
                                                <input type='text' defaultValue='1' step='any' maxLength='10' name='multiplier' id='multiplier' className='small_width_input' />
                                            </div>
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
                                                <select className='currency small_width_input' />
                                                <input id='amount' type='text' step='any' maxLength='10' defaultValue='10' className='medium_width_input' autoComplete='off' />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div id='open_positions_container'>
                                <Portfolio />
                            </div>
                        </div>
                    </div>
                </div>
                <div id='contract_prices_container' className='col row-inner'>
                    <div id='contract_confirmation_container' className='overlay_container col'>
                        <a className='close' id='close_confirmation_container' />
                        <div id='confirmation_message_container'>
                            <div id='confirmation_message'>
                                <h3 id='contract_purchase_heading' />
                                <div id='contract_purchase_descr' />
                                <div className='row' id='contract_purchase_profit_list'>
                                    <div className='col' id='contract_purchase_payout' />
                                    <div className='col' id='contract_purchase_cost' />
                                    <div className='col' id='contract_purchase_profit' />
                                </div>
                                <div id='contract_purchase_barrier' />
                                <div id='contract_purchase_reference' />
                                <div className='button'>
                                    <span id='contract_purchase_button' className='button open_contract_details' />
                                </div>
                                <div id='contract_purchase_spots' />
                                <div id='tick_chart' />
                                <div id='contract_purchase_balance' />
                            </div>
                            <div id='confirmation_error' />
                        </div>
                        <div id='confirmation_message_endelement' />
                    </div>
                    <div className='row-inner' id='contracts_list'>
                        <div id='loading_container2' className='overlay_container' />
                        <div className='col price_container row-inner' id='price_container_top'>
                            <div className='col gr-row'>
                                <div className='price_wrapper row'>
                                    <h4 className='contract_heading' />
                                    <span className='amount_wrapper'>
                                        <div className='amount_wrapper_div'>
                                            <div className='stake_wrapper'>
                                                <span className='stake' />
                                                <span className='contract_amount' />
                                            </div>
                                            <div className='payout_wrapper'>
                                                <span className='payout' />
                                                <span className='contract_payout' />
                                            </div>
                                        </div>
                                        <div className='contract_purchase button'>
                                            <span className='purchase_button contract_description no-underline' id='purchase_button_top' data-balloon-length='xlarge' value='purchase'>{it.L('Purchase')}</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className='col price_comment' />
                            <div className='col contract_error' />
                        </div>
                        <div className='col price_container row-inner' id='price_container_bottom'>
                            <div className='col gr-row'>
                                <div className='price_wrapper row'>
                                    <h4 className='contract_heading' />
                                    <span className='amount_wrapper'>
                                        <div className='amount_wrapper_div'>
                                            <div className='stake_wrapper'>
                                                <span className='stake' />
                                                <span className='contract_amount' />
                                            </div>
                                            <div className='payout_wrapper'>
                                                <span className='payout' />
                                                <span className='contract_payout' />
                                            </div>
                                        </div>
                                        <div className='contract_purchase button'>
                                            <span className='purchase_button contract_description no-underline' id='purchase_button_bottom' data-balloon-length='xlarge' value='purchase'>{it.L('Purchase')}</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className='col price_comment' />
                            <div className='col contract_error' />
                        </div>
                        <div className='col price_container row-inner' id='price_container_middle'>
                            <div className='col gr-row'>
                                <div className='price_wrapper row'>
                                    <h4 className='contract_heading' />
                                    <span className='amount_wrapper'>
                                        <div className='amount_wrapper_div'>
                                            <div className='stake_wrapper'>
                                                <span className='stake' />
                                                <span className='contract_amount' />
                                            </div>
                                            <div className='payout_wrapper'>
                                                <span className='multiplier' />
                                                <span className='contract_multiplier' />
                                            </div>
                                        </div>
                                        <div className='contract_purchase button'>
                                            <span className='purchase_button no-underline' id='purchase_button_middle' data-balloon-length='xlarge' value='purchase'>{it.L('Purchase')}</span>
                                        </div>
                                    </span>
                                </div>
                                <div className='contract_longcode' />
                            </div>
                            <div className='col price_comment' />
                            <div className='col contract_error' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id='all_prices' />
        <Analysis />
        <div id='trading_init_progress'>
            <Loading />
        </div>
    </React.Fragment>
);

export default Trading;
