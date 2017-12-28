import React from 'react';

const IcoInfo = () => (
    <React.Fragment>
        <h1>{it.L('[_1] ICO: Histogram of Active Bids', it.website_name)}</h1>
        <p className='center-text notice-msg invisible' id='no_bids_to_show'>{it.L('No bids to show')}</p>
        <p className='center-text notice-msg invisible' id='ico_status_error'></p>

        <div id='ico_info_loading' className='loading'></div>

        <div id='ico_info' className='invisible'>
            <div className='barChart'></div>
            <div className='y-label invisible'>
                <div className='arrow-left'></div>
                <div>{it.L('Total Bids ($USD)')}</div>
                <div className='arrow-right'></div>
            </div>
            <div className='x-label invisible'>
                <div className='arrow-left'></div>
                <div>{it.L('Bid Price Per Token ($USD)')}</div>
                <div className='arrow-right'></div>
            </div>
        </div>
        <div>
            <p>
                <a className='button-secondary' href={it.url_for('user/ico-subscribe')}>
                    <span>
                        <img src={it.url_for('images/ico/icons/arrow_back.svg')} />
                        {it.L('Back')}
                    </span>
                </a>
            </p>
        </div>
    </React.Fragment>
);

export default IcoInfo;
