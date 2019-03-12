import PropTypes              from 'prop-types';
import React                  from 'react';
import { localize }           from '_common/localize';
import MediaItem, {
    MediaDescription,
    MediaHeading,
    MediaIcon,
}                             from 'App/Components/Elements/Media';
import Localize               from 'App/Components/Elements/localize.jsx';
import Checkbox               from 'App/Components/Form/Checkbox';
import { connect }            from 'Stores/connect';

const PurchaseSettings = ({
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
                <MediaIcon />
                <div className='media__form'>
                    <Checkbox
                        value={is_purchase_confirmed}
                        label={localize('Purchase confirmation')}
                        onClick={togglePurchaseConfirmation}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
        <MediaItem>
            <MediaHeading>
                <Localize str='Purchase Lock' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon />
                <div className='media__form'>
                    <Checkbox
                        value={is_purchase_locked}
                        label={localize('Purchase Lock')}
                        onClick={togglePurchaseLock}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
    </div>
);

PurchaseSettings.propTypes = {
    is_purchase_confirmed     : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    togglePurchaseConfirmation: PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
};

export default connect(({ ui }) => (
    {
        is_purchase_confirmed     : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
        togglePurchaseLock        : ui.togglePurchaseLock,
    }
))(PurchaseSettings);
