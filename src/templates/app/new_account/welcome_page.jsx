import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const WelcomePage = () => (
    <div id='welcome_container' className='center-text static_full invisible'>
        <span className='account-created' />

        <SeparatorLine className='gr-padding-5' invisible />

        <h1>{it.L('Congratulations!')}</h1>
        <p>{it.L('You have successfully created your Virtual Account.')}</p>

        <SeparatorLine className='gr-padding-10' invisible />

        <div className='gr-8 gr-10-p gr-12-m gr-centered'>
            <div className='container gr-row box-grid'>
                <div className='gr-7 gr-12-p gr-12-m gr-padding-30 gr-parent'>
                    <div className='box border-gray gr-gutter gr-padding-10'>
                        <div>
                            <strong>{it.L('Real Account')}</strong>
                            <p className='payment-icons'>
                                <img id='USD' className='invisible' src={it.url_for('images/pages/set_currency/usd_icon.svg')} />
                                <img id='AUD' className='invisible' src={it.url_for('images/pages/set_currency/aud_icon.svg')} />
                                <img id='EUR' className='invisible' src={it.url_for('images/pages/set_currency/eur_icon.svg')} />
                                <img id='GBP' className='invisible' src={it.url_for('images/pages/set_currency/gbp_icon.svg')} />
                                <img id='BTC' className='invisible' src={it.url_for('images/pages/set_currency/btc.svg')} />
                                <img id='LTC' className='invisible' src={it.url_for('images/pages/set_currency/ltc.svg')} />
                                <img id='BCH' className='invisible' src={it.url_for('images/pages/set_currency/bch.svg')} />
                                <img id='ETH' className='invisible' src={it.url_for('images/pages/set_currency/eth_icon.svg')} />
                                <img id='ETC' className='invisible' src={it.url_for('images/pages/set_currency/etc_icon.svg')} />
                            </p>
                            <p className='font-s'>{it.L('Upgrade to a real account and start trading using a wide range of crypto and fiat currencies.')}</p>
                        </div>
                        <div className='box-item-end'>
                            <p><a id='upgrade_btn' href='javascript:;' className='button button-disabled' /></p>
                        </div>
                    </div>
                </div>
                <div className='gr-5 gr-12-p gr-12-m gr-padding-30 gr-parent'>
                    <div className='box border-gray gr-gutter gr-padding-10'>
                        <div>
                            <strong>{it.L('Virtual Account')}</strong>
                            <p className='text-orange'>{it.L('$10,000.00')}</p>
                            <p className='font-s'>{it.L('Practice your trading strategies in a risk-free environment by using virtual funds.')}</p>
                        </div>
                        <div className='box-item-end'>
                            <p><a className='button-secondary' href={it.url_for('trading')}><span>{it.L('Start trading')}</span></a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <SeparatorLine className='gr-padding-10' invisible />
    </div>
);

export default WelcomePage;
