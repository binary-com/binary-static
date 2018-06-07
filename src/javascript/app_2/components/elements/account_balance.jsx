import React               from 'react';
import Client              from '../../../_common/base/client_base';
import { formatMoney }     from '../../../_common/base/currency_base';
import { connect }         from '../../store/connect';
import Button              from '../form/button.jsx';
import { localize }        from '../../../_common/localize';
import { redirectToLogin } from '../../../_common/base/login';

export const AccountBalance = connect(
    ({ client }) => ({
        balance: client.balance,
    })
)(({
    balance,
}) => {
    const loginid      = Client.get('loginid');
    const currency     = Client.get('currency');
    const upgrade_info = Client.getBasicUpgradeInfo();
    const can_upgrade  = upgrade_info.can_upgrade || upgrade_info.can_open_multi;

    return (
        <div className='acc-balance-container'>
            {Client.isLoggedIn() ?
                <React.Fragment>
                    <div className='acc-balance'>
                        <p className='acc-balance-accountid'>{loginid}</p>
                        {typeof balance !== 'undefined' &&
                            <p className='acc-balance-amount'>
                                <i><span className={`symbols ${(currency || '').toLowerCase()}`}/></i>
                                {formatMoney(currency, balance, true)}
                            </p>
                        }
                    </div>
                    {can_upgrade &&
                        <Button
                            id='acc-balance-btn'
                            className='primary orange'
                            has_effect
                            text={localize('Upgrade')}
                            // onClick={onClickUpgrade} TODO
                        />
                    }
                </React.Fragment> :
                <Button
                    className='primary green'
                    has_effect
                    text={localize('Login')}
                    onClick={redirectToLogin}
                />
            }
        </div>
    );
});
