import React from 'react';
import { Table } from '../../_common/components/elements.jsx';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const IcoSubscribe = () => (
    <React.Fragment>
        <h1>{it.L('[_1] Initial Coin Offering (ICO)', it.website_name)}</h1>

        <div id='ico_subscribe' className='invisible'>
            <p>{it.L('[_1] is offering up to <strong>10,000,000</strong> tokens in an open auction. You may place your bids using the form below. <a href=\'[_2]\' target=\'_blank\'>Learn more</a>', it.website_name, it.url_for('ico'))}</p>
            <p>{it.L('To place a bid, you only need to deposit 5% of the total bid value. At the end of the auction, the final price of the token will be decided and you will have two weeks to settle the remaining balance that’s due on each active bid.')}</p>
            <p>{it.L('Bids can be cancelled at any time before the end of the auction without any penalty.')}</p>
            <div className='gr-row'>
                <div className='gr-7 gr-12-p gr-12-m'>
                    <a href='#auction' className='no-ajax'>
                        <img className='responsive ico-auction' />
                    </a>
                </div>
                <div className='gr-5 gr-12-p gr-12-m border-gray border-radius'>
                    <form id='frm_ico_bid'>
                        <div className='gr-row fill-bg-color border-radius'>
                            <div className='gr-12 gr-padding-10'>
                                <h3 className='no-margin'>{it.L('Bid on the ICO:')}</h3>
                                <p className='no-margin' id='minimum_bid'></p>
                            </div>
                        </div>
                        <div className='gr-row center-text-m'>
                            <div className='gr-12 gr-padding-10'>
                                <label htmlFor='duration'>{it.L('Number of tokens')}</label>
                            </div>
                            <div className='gr-12'>
                                <div className='gr-12'>
                                    <div className='gr-row'>
                                        <input className='gr-9' type='text' id='duration' maxLength='30' autoComplete='off' />
                                        <div className='fill-bg-color gr-3'><div className='center-text margin-top'>{it.L('Tokens')}</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='gr-row center-text-m '>
                            <div className='gr-12 gr-padding-10'>
                                <label htmlFor='price'>{it.L('Price/token:')}</label>
                            </div>
                            <div className='gr-12'>
                                <div className='gr-12'>
                                    <div className='gr-row'>
                                        <input className='gr-9' type='text' id='price' maxLength='30' autoComplete='off' />
                                        <div className='fill-bg-color gr-3'><div className='center-text margin-top currency'>-</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='gr-12 align-start hint no-padding'>{it.L('Price per unit:')} <span id='price_unit'></span></div>
                        <div className='gr-12 align-start hint no-padding'>{it.L('Total:')} <span id='total'></span></div>

                        <SeparatorLine show_mobile invisible className='gr-padding-10' />

                        <div className='gr-12 align-start hint no-padding'>
                            {it.L('Initial deposit required: ')}
                            <strong id='payable_amount'></strong>
                            <span className='deposit'>
                                {it.L(' (<span class="initial_deposit_percent"></span>% of total amount)')}
                            </span>
                        </div>
                        <div className='center-text'>
                            <div id='form_error' className='error-msg invisible'></div>
                            <div className='gr-padding-10'>
                                <button id='btn_submit' type='submit'>{it.L('Place bid')}</button>
                                <div className='gr-row invisible hint' id='topup_wrapper'>
                                    <div className='gr-8 align-start error-msg'>{it.L('You have insufficient funds in your account.')}</div>
                                    <div className='gr-4 align-end'><a href={it.url_for('cashier/forwardws?action=deposit')}>{it.L('Top up in cashier')}</a></div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <SeparatorLine show_mobile invisible className='gr-padding-20' />

            <div id='ico_bids'>
                <h1>{it.L('[_1] ICO Auction Bids', it.website_name)}</h1>

                <div id='portfolio'>
                    <p className='notice-msg center-text invisible' id='error-msg'></p>

                    <div id='portfolio-loading'></div>

                    <div id='portfolio-content' className='invisible'>
                        <div id='portfolio-no-contract'>
                            <p>{it.L('You have no open bids.')}</p>
                        </div>

                        <Table scroll id='portfolio-table' tbody_id='portfolio-body' data={{
                            thead: [[
                                { className: 'ref',           text: it.L('Ref.') },
                                { className: 'payout nowrap', text: it.L('No. of Tokens') },
                                { className: 'bid',           text: it.L('Bid Price Per Token') },
                                { className: 'purchase',      text: it.L('Total Bid Price') },
                                { className: 'deposit',       text: it.L('Deposit') },
                                { className: 'details',       text: it.L('Status') },
                                { className: 'button',        text: '' },
                            ]],
                        }} />
                    </div>
                </div>
            </div>
            <SeparatorLine show_mobile invisible className='gr-padding-10' />
            <div className='faded'>
                <p className='no-margin'>{it.L('Notes:')}</p>
                <ol>
                    <li className='ico-ended-hide'>{it.L('Bids can be cancelled at any time before the end of the auction at no cost.')}</li>
                    <li>{it.L('Unsuccessful bidders will receive a full refund.')}</li>
                </ol>
            </div>
            <a href='#_' className='no-ajax img-lightbox popup' id='auction'>
                <div>
                    <img className='responsive ico-auction' />
                </div>
            </a>
        </div>

        <div className='invisible' id='ico_virtual_message'>
            <p>{it.L('The [_1] token sale has ended.', it.website_name)}</p>
        </div>

        <div className='invisible' id='ico_account_message'>
            <p>{it.L('Please select your ICO account to proceed.')}</p>
        </div>

        <div className='invisible' id='ico_account_message_real'>
            <p>{it.L('Please select your real money account to proceed.')}</p>
        </div>

        <div className='invisible' id='ico_new_account_message'>
            <p id='message_common' className='invisible'>{it.L('This feature is only available to CR clients.')}</p>
            <p id='message_gaming' className='invisible'>{it.L('The [_1] token sale has ended.', it.website_name)}</p>
            <p id='message_financial' className='invisible'>{it.L('The [_1] token sale has ended.', it.website_name)}</p>
            <p id='message_iom' className='invisible'>{it.L('The [_1] token sale has ended.', it.website_name)}</p>
        </div>

        <div className='invisible' id='feature_not_allowed'>
            <p className='center-text notice-msg'>{it.L('The [_1] token sale has ended.', it.website_name)}</p>
        </div>

        <div id='cancel_bid_confirmation' className='lightbox invisible'>
            <div className='gr-padding-30 gr-gutter'>
                <div className='gr-gutter'>
                    <div className='gr-gutter'>
                        <h1>{it.L('Cancel bid?')}</h1>
                        <p className='gr-padding-10 gr-child'>{it.L('Are you sure you want to cancel the bid?')}</p>
                        <form id='frm_confirm'>
                            <div className='center-text gr-centered'>
                                <button className='button' type='submit'>{it.L('Yes, cancel my bid')}</button>
                                <a className='button button-secondary' id='cancel' href='javascript:;'><span>{it.L('No, return to the ICO auction page')}</span></a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default IcoSubscribe;
