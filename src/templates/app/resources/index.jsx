import React from 'react';

const Column = ({
    header,
    image,
    ja_hide,
    text,
    url,
}) => (
    <div className={`gr-3 gr-6-m gr-parent${ja_hide ? ' ja-hide' : ''}`}>
        <div className='gr-8 gr-padding-10'>
            <a href={it.url_for(`resources/${url}`)}>
                <img className='responsive' src={it.url_for(`images/pages/resources/${image}-icon.svg`)} />
            </a>
        </div>
        <div className='gr-12'>
            <h4><a href={it.url_for(`resources/${url}`)}>{header}</a></h4>
            <p>{text}</p>
        </div>
    </div>
);

const Resources = () => (
    <React.Fragment>
        <h1>{it.L('Resources')}</h1>
        <p>{it.L('Do you want to learn more about the markets and how to trade them? Check out the resources below.')}</p>
        <div className='gr-row'>
            <Column
                header={it.L('Asset Index')}
                image='asset-index'
                ja_hide='1'
                text={it.L('View the full list of assets, contract types and durations.')}
                url='asset_indexws'
            />

            <Column
                header={it.L('Trading Times')}
                image='trading-times'
                text={it.L('View the operating hours of the markets you can trade.')}
                url='market_timesws'
            />
        </div>
    </React.Fragment>
);

export default Resources;
