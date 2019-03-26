import PropTypes                from 'prop-types';
import React                    from 'react';
import { localize }             from '_common/localize';
import MediaItem, {
    MediaDescription,
    MediaHeading,
    MediaIcon,
}                                from 'App/Components/Elements/Media';
import Localize                  from 'App/Components/Elements/localize.jsx';
import Checkbox                  from 'App/Components/Form/Checkbox';
import ConfirmationDisabledLight from 'Images/app_2/settings/confirmation-disabled.svg';
import ConfirmationEnabledLight  from 'Images/app_2/settings/confirmation-enabled.svg';
import ConfirmationDisabledDark  from 'Images/app_2/settings/dark/confirmation-disabled.svg';
import ConfirmationEnabledDark   from 'Images/app_2/settings/dark/confirmation-enabled.svg';
import LockDisabledDark          from 'Images/app_2/settings/dark/lock-disabled.svg';
import LockEnabledDark           from 'Images/app_2/settings/dark/lock-enabled.svg';
import LockDisabledLight         from 'Images/app_2/settings/lock-disabled.svg';
import LockEnabledLight          from 'Images/app_2/settings/lock-enabled.svg';
import { connect }               from 'Stores/connect';

const PurchaseSettings = ({
    is_dark_mode,
    is_purchase_confirmed,
    is_purchase_locked,
    togglePurchaseConfirmation,
    togglePurchaseLock,
}) => (
    <div className='settings-dialog__purchase'>
        <MediaItem>
            <MediaHeading>
                <Localize str='Purchase confirmation' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? ConfirmationDisabledDark : ConfirmationDisabledLight }
                    enabled={is_dark_mode ? ConfirmationEnabledDark : ConfirmationEnabledLight }
                    is_enabled={is_purchase_confirmed}
                />
                <div className='media__form'>
                    <Checkbox
                        value={is_purchase_confirmed}
                        label={localize('Require confirmation before purchasing a contract')}
                        onClick={togglePurchaseConfirmation}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
        <MediaItem>
            <MediaHeading>
                <Localize str='Purchase lock' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? LockDisabledDark : LockDisabledLight}
                    enabled={is_dark_mode ? LockEnabledDark : LockEnabledLight}
                    is_enabled={is_purchase_locked}
                />
                <div className='media__form'>
                    <Checkbox
                        value={is_purchase_locked}
                        label={localize('Lock contract purchase buttons')}
                        onClick={togglePurchaseLock}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
    </div>
);

PurchaseSettings.propTypes = {
    is_dark_mode              : PropTypes.bool,
    is_purchase_confirmed     : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    togglePurchaseConfirmation: PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
};

export default connect(({ ui }) => (
    {
        is_dark_mode              : ui.is_dark_mode_on,
        is_purchase_confirmed     : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
        togglePurchaseLock        : ui.togglePurchaseLock,
    }
))(PurchaseSettings);
