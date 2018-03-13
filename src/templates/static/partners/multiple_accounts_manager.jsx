import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const BoxInner = ({ className = '', image, text }) => (
    <div className={`gr-4 gr-12-m center-text ${className}`}>
        <img className='gr-4 gr-2-m gr-centered' src={it.url_for(`images/pages/mam/${image}.svg`)}/>
        <p>{text}</p>
    </div>
);

const Box = ({ className = '', children }) => (
    <div className={`gr-12 ${className}`}>
        <div className='gr-row'>
            {children}
        </div>
    </div>
);

const Step = ({ image, circle_no, header, text }) => {
    const circle = circle_no ? <div className='circle'>{circle_no}</div> : '';
    return (
        <div className='step'>
            <div className='border-bottom' />
            {circle}
            <div className='gr-padding-20 gr-gutter'>
                <div className='center-text'>
                    <img className='gr-4 gr-8-m gr-centered' src={it.url_for(`images/pages/mam/${image}.svg`)} />
                </div>
                <div className='gr-padding-20 gr-child'><strong>{header}</strong></div>
                <p className='no-margin gr-padding-10'>{text}</p>
            </div>
        </div>
    );
};

const MultipleAccountsManager = () => (
    <React.Fragment>
        <div className='static_full'>
            <div className='container'>
                <h1>{it.L('Multiple Accounts Manager (MAM) for MetaTrader 5 (MT5)')}</h1>
                <p>{it.L('Assign and manage multiple sub-accounts seamlessly via one interface – the Multiple Accounts Manager (MAM).')}</p>
                <p>{it.L('The MAM tool is ideal for money managers who want to easily manage multiple client accounts. It gives you the ability to simultaneously view, track, and trade on behalf of all MT5 client accounts under your control.')}</p>
            </div>
        </div>

        <div className='gr-padding-30'>
            <div className='fill-bg-color box-inlay-borders'>
                <div className='gr-padding-30 center-text container'>
                    <h2>{it.L('Key features')}</h2>

                    <SeparatorLine invisible className='gr-parent gr-padding-20' />

                    <Box className='border-bottom'>
                        <BoxInner
                            className='border-right-top'
                            image='deposit'
                            text={it.L('Client\'s deposits or withdrawals are immediately reflected in the corresponding master account balance in real time')}
                        />
                        <BoxInner
                            className='border-right-top'
                            image='methods'
                            text={it.L('Use a variety of allocation methods (e.g equity, balance, even, and lot) to distribute trade volumes')}
                        />
                        <BoxInner
                            image='tools'
                            text={it.L('Access all available tools and features for trading on MT5, including Expert Advisors (EAs), charts, and order types')}
                        />
                    </Box>

                    <Box className='border-bottom'>
                        <BoxInner
                            className='border-right-top gr-padding-20 gr-child'
                            image='info'
                            text={it.L('View essential information for open positions associated with each login ID – including order type (buy/sell), open time, open price, SL, TP, swap, and profit')}
                        />
                        <BoxInner
                            className='border-right-top gr-padding-20 gr-child'
                            image='exclude'
                            text={it.L('Use multiple exclusion rules to temporarily exclude client accounts from allocations without affecting their current positions')}
                        />
                        <BoxInner
                            className='gr-padding-30 gr-child'
                            image='manage'
                            text={it.L('View all the information you need to manage your client list – including login ID, group, leverage, balance, equity, and margin')}
                        />
                    </Box>

                    <Box>
                        <BoxInner
                            className='border-right-top gr-padding-30 gr-child'
                            image='money'
                            text={it.L('Instant, daily, and monthly commissions available to money managers')}
                        />
                        <BoxInner
                            className='border-right-top gr-padding-20 gr-child'
                            image='trade'
                            text={it.L('Clients\' trade allocations start from 0.01 lots')}
                        />
                        <BoxInner
                            className='gr-padding-20 gr-child'
                            image='close'
                            text={it.L('Clients can close out trades')}
                        />
                    </Box>

                </div>
            </div>
        </div>

        <div className='container'>
            <h2 className='center-text'>{it.L('How it works')}</h2>

            <SeparatorLine invisible className='gr-parent gr-padding-30' />

            <div className='steps'>
                <Step
                    image='talktous'
                    header={it.L('Talk to us')}
                    text={it.L('Learn how to set up and authenticate your master account, link sub accounts, and more.')}
                    circle_no='1'
                />
                <Step
                    image='download'
                    header={it.L('Download MAM')}
                    text={it.L('Download the MAM application after setup is completed. Log in with your master account credentials.')}
                    circle_no='2'
                />
                <Step
                    image='monitor'
                    header={it.L('Manage sub accounts')}
                    text={it.L('Monitor and manage your client list, set allocations and exclusions for individual sub accounts, and more.')}
                    circle_no='3'
                />
            </div>

            <div className='center-text'>
                <div className='gr-parent gr-padding-20'>
                    <a className='button' href='https://s3.amazonaws.com/binary-mt5/binarycom_mam.rar' rel='noopener noreferrer'><span>{it.L('Download Now')}</span></a>
                </div>
                <p>{it.L('Interested in our MAM tool for MetaTrader 5? Contact us at [_1] for more info.', '<a href="mailto:marketing@binary.com">marketing@binary.com</a>')}</p>
            </div>
        </div>
    </React.Fragment>

);

export default MultipleAccountsManager;
