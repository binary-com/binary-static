import React from 'react';
import Loading from '../../_common/components/loading.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const Currencies = ({ text, id }) => (
    <React.Fragment>
        <div className='section-divider gr-padding-20 gr-row invisible' id={`${id}_currencies`}>
            <div className='align-self-center border-bottom-light-gray' />
            <div className='faded'>{text}</div>
            <div className='align-self-center border-bottom-light-gray' />
        </div>
        <div className='gr-8 gr-10-p gr-9-m gr-centered invisible'>
            <div className='gr-row gr-padding-20 gr-parent currency_list' id={`${id}_currency_list`} />
        </div>
    </React.Fragment>
);

const SetCurrency = () => (
    <React.Fragment>
        <div id='set_currency_loading'>
            <Loading />
        </div>

        <div className='invisible' id='set_currency'>
            <div className='center-text'>
                <div className='invisible' id='hide_new_account'>
                    <h1>{it.L('Select currency')}</h1>

                    <SeparatorLine show_mobile className='gr-parent gr-padding-10' invisible />
                </div>
                <div className='invisible' id='show_new_account'>
                    <img src={it.url_for('images/pages/set_currency/account-created.svg')} />
                    <div className='gr-padding-10' />
                    <h1>{it.L('Success!')}</h1>
                    <p className='margin-zero' id='congratulations_message' />
                    <p className='margin-zero'>{it.L('Make a deposit now to start trading.')}</p>

                    <SeparatorLine show_mobile className='gr-parent gr-padding-10' invisible />
                </div>

                <div id='deposit_row' className='gr-padding-10 invisible'>
                    <div>
                        <a className='button button-secondary btn_cancel inline-block-button'id='maybe_later_btn' href='javascript:;'><span>{it.L('Maybe later')}</span></a>
                        <a className='button inline-block-button' href='javascript:;'id='deposit_btn'><span>{it.L('Deposit now')}</span></a>
                    </div>
                </div>

                <div className='invisible select_currency'>
                    <p id='set_currency_text'>{it.L('Please select the currency for this account:')}</p>
                </div>
            </div>

            <div className='center-text invisible select_currency'>
                <form id='frm_set_currency'>
                    <Currencies id='fiat' text={it.L('Fiat Currency')} />
                    <Currencies id='crypto' text={it.L('Cryptocurrency')} />

                    <div className='invisible show_change_currency show_multi_account show_set_currency' id='submit_section'>
                        <a className='button button-secondary btn_cancel inline-block-button' href='javascript:;'><span>{it.L('Cancel')}</span></a>
                        <a className='button inline-block-button' id='btn_ok' href='javascript:;'><span /></a>
                    </div>
                </form>
            </div>
            <p className='invisible error-msg center-text' />
        </div>
    </React.Fragment>
);

export default SetCurrency;
