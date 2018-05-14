import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const LandingPage = () => (
    <div className='center-text static_full'>
        <h1>{it.L('{JAPAN ONLY}Welcome to [_1]', it.website_name)}</h1>
        <h3>{it.L('{JAPAN ONLY}We have opened a virtual account for you and credited it with ¥1,000,000 of virtual money.')}</h3>
        <p>{it.L('{JAPAN ONLY}You are welcome to use this account to practice trading and to familiarize yourself with our trading platform.')}</p>

        <SeparatorLine className='gr-padding-10' invisible />

        <div className='box bordered gr-10 gr-centered'>
            <p>{it.L('{JAPAN ONLY}You can apply to open a real money account at any time by clicking the:')}</p>
            <div className='upgrademessage'>
                <a className='pulser invisible' />
            </div>
            <p>{it.L('{JAPAN ONLY}At the top of the page as shown above.')}</p>
            <p>{it.L('{JAPAN ONLY}Or, if you want to apply straight away, please click the button below:')}</p>

            <div className='gr-row gr-centered gr-parent gr-padding-20'>
                <a className='button gr-gutter' href={it.url_for('new_account/japanws')}>
                    <span>{it.L('{JAPAN ONLY}Apply for Real Money Account')}</span>
                </a>
                <a className='button button-secondary' href={it.url_for('multi_barriers_trading')}>
                    <span>{it.L('{JAPAN ONLY}Proceed to Virtual Account')}</span>
                </a>
            </div>
        </div>

        <SeparatorLine className='gr-padding-10' invisible />
    </div>
);

export default LandingPage;
