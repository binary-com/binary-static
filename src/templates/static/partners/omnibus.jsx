import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const Box = ({ image, header, text }) => (
    <div className='gr-4 gr-12-p gr-12-m gr-parent'>
        <div className='box gr-gutter gr-padding-10'>
            <img className='responsive gr-padding-20' src={it.url_for(`images/pages/omnibus/${image}.svg`)} />
            <strong>{header}</strong>
            <p>{text}</p>
        </div>
    </div>
);

const Steps = ({ has_arrow, text }) => {
    const arrow = has_arrow ? <img className='responsive' src={it.url_for('images/pages/omnibus/arrow-down.svg')} />: '';
    return (
        <div className='steps gr-12 gr-12-p gr-12-m gr-parent'>
            <p className='center-text'>{text}</p>
            {arrow}
        </div>
    );
};

const Omnibus = () => (
    <React.Fragment>
        <div className='container'>
            <div className='static_full'>
                <h1>{it.L('Omnibus account')}</h1>
                <p>{it.L('Are you a licensed and regulated broker with a large database of active traders? Manage your database more efficiently by consolidating all your client accounts under an omnibus master account. This allows you to keep their individual identities private at the same time.')}</p>
            </div>
        </div>

        <SeparatorLine className='gr-parent gr-padding-20' invisible />

        <div className='fill-bg-color center-text gr-padding-20'>
            <h2 className='gr-padding-20 gr-child'>{it.L('Key features')}</h2>
            <div className='container gr-row'>
                <Box image='trade' header={it.L('More efficient')} text={it.L('Trade on behalf of your clients through one account.')} />
                <Box image='low-fees' header={it.L('Lower fees')} text={it.L('Reduce fees associated with deposits and withdrawals.')} />
                <Box image='privacy' header={it.L('Privacy')} text={it.L('Maintain complete anonymity of your clients.')} />
            </div>
        </div>

        <div className='container gr-padding-30 gr-child'>
            <h2 className='center-text'>{it.L('How it works')}</h2>
            <SeparatorLine className='gr-parent' invisible />
            <Steps has_arrow text={it.L('Create your own white-label application with the omnibus facility, plus all the features supported by our extensive API library. We won’t know who your clients are and vice versa')} />
            <Steps has_arrow text={it.L('Create sub-accounts to record transactions you make on behalf of your clients')} />
            <Steps has_arrow text={it.L('Customise individual access for clients who wish to trade for themselves')} />
            <Steps has_arrow text={it.L('Transfer funds between your omnibus master account and sub-accounts')} />
            <Steps text={it.L('All deposits and withdrawals are made through your omnibus master account')} />
        </div>

        <div className='container'>
            <p className='center-text'>{it.L('Interested in our omnibus account facility? [_1]Contact us now and apply as an omnibus broker[_2].', '<a href="mailto:marketing@binary.com">', '</a>')}</p>
            <SeparatorLine className='gr-parent gr-padding-20' invisible />
        </div>
    </React.Fragment>
);

export default Omnibus;
