import classNames        from 'classnames';
import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import React             from 'react';
import AccountSwitcher   from '../../Elements/account_switcher.jsx';
import { IconArrow }     from '../../../../Assets/Common';
import { localize }      from '../../../../../_common/localize';
import Client            from '../../../../../_common/base/client_base';

const AccountInfo = ({ balance, currency, loginid, is_dialog_on, toggleDialog }) => {
    const account_type = !(Client.get('is_virtual', loginid)) && currency ? Client.getAccountTitle(loginid) : localize('Demo');
    return (
        <div className='acc-balance'>
            <div className='acc-switcher-container'>
                <div className={classNames('acc-info', { 'show': is_dialog_on })} onClick={toggleDialog}>
                    <p className='acc-balance-type'>{localize('[_1] Account', [(account_type || '')])}</p>
                    <p className='acc-balance-id'>{loginid}</p>
                    <IconArrow className='select-arrow' />
                </div>
                <CSSTransition
                    in={is_dialog_on}
                    timeout={400}
                    classNames='acc-switcher-wrapper'
                    unmountOnExit
                >
                    <div className='acc-switcher-wrapper'>
                        <AccountSwitcher
                            is_visible={is_dialog_on}
                            toggle={toggleDialog}
                        />
                    </div>
                </CSSTransition>
            </div>
            { typeof balance !== 'undefined' &&
                <p className='acc-balance-amount'>
                    <i><span className={`symbols ${(currency || '').toLowerCase()}`}/></i>
                    {balance}
                </p>
            }
        </div>
    );
};

AccountInfo.propTypes = {
    balance     : PropTypes.string,
    currency    : PropTypes.string,
    loginid     : PropTypes.string,
    is_dialog_on: PropTypes.bool,
    toggleDialog: PropTypes.func,
};

export { AccountInfo };
