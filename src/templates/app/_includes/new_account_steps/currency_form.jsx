import React from 'react';

const Currencies = ({ text, id }) => (
    <React.Fragment>
        <div className='section-divider gr-padding-20 gr-padding-10-m gr-row invisible' id={`${id}_currencies`}>
            <div className='align-self-center border-bottom-light-gray' />
            <div className='faded'>{text}</div>
            <div className='align-self-center border-bottom-light-gray' />
        </div>
        <div className='gr-8 gr-10-p gr-9-m gr-centered invisible'>
            <div className='gr-row gr-padding-20 gr-parent currency_list' id={`${id}_currency_list`} />
        </div>
    </React.Fragment>
);

const CurrencyForm = () => (
    <div id='set_currency'>
        <div className='center-text select_currency'>
            <form id='currency_step_form'>
                <div id='currency'>
                    <Currencies id='fiat' text={it.L('Fiat currencies')} />
                    <p className='hint set_currency_hint'>{it.L('You will not be able to change currency once you have made a deposit.')}</p>
                    <Currencies id='crypto' text={it.L('Cryptocurrencies')} />
                </div>

                <p className='invisible error-msg center-text' />
                <div className='align-end' id='submit_section'>
                    <button className='button' type='submit'>{it.L('Next')}</button>
                </div>
            </form>
        </div>
    </div>
);

export default CurrencyForm;
