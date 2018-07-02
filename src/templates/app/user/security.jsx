import React from 'react';

const Column = ({
    className,
    header,
    id,
    image,
    text,
    url,
}) => (
    <div className={`gr-3 gr-6-m gr-parent ${className}`} id={id}>
        <div className='gr-8 gr-padding-10'>
            <a href={it.url_for(`user/security/${url}`)}>
                <img className='responsive' src={it.url_for(`images/pages/settings/${image}.svg`)} />
            </a>
        </div>
        <div className='gr-12'>
            <h4><a href={it.url_for(`user/security/${url}`)}>{header}</a></h4>
            <p>{text}</p>
        </div>
    </div>
);

const Security = () => (
    <React.Fragment>
        <div className='invisible' id='settings_container'>
            <h1>{it.L('Security')}</h1>

            <div className='gr-row'>
                <Column className='invisible' id='change_password' url='change_passwordws' image='account_password' header={it.L('Account Password')} text={it.L('Change your main login password.')} />

                <Column className='real invisible' url='cashier_passwordws' image='cashier_password' header={it.L('Cashier Password')} text={it.L('Change the password used for deposits and withdrawals.')} />

                <Column className='real invisible' url='self_exclusionws' image='self-exclusion' header={it.L('Self Exclusion')} text={it.L('Facility that allows you to set limits on your account.')} />

                <Column className='real invisible' url='limitsws' image='limits' header={it.L('Limits')} text={it.L('View your trading and withdrawal limits.')} />

                <Column className='ja-hide' url='iphistoryws' image='iphistory' header={it.L('Login History')} text={it.L('View your login history.')} />

                <Column className='ja-hide' url='api_tokenws' image='api-token' header={it.L('API Token')} text={it.L('API token for third party applications.')} />

                <Column className='ja-hide' url='authorised_appsws' image='applications' header={it.L('Authorised Applications')} text={it.L('Manage your authorised applications.')} />

                <Column url='two_factor_authentication' image='2fa' header={it.L('Two-Factor Authentication')} text={it.L('Enable two-factor authentication for an extra layer of security.')} />
            </div>
        </div>
    </React.Fragment>
);

export default Security;
