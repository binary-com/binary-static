import { observer }   from 'mobx-react';
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import InfoBoxExpired from './info_box_expired.jsx';
import InfoBoxGeneral from './info_box_general.jsx';
import { isEnded }    from '../../../../Stores/Modules/Contract/Helpers/logic';

const InfoBox = ({ contract_info }) => {
    const is_ended    = isEnded(contract_info);
    const InfoBoxLive = InfoBoxGeneral; // /digit/.test(contract_info.contract_type) ? InfoBoxDigit : InfoBoxGeneral;
    const is_general_visible_class = classNames({ 'show': !is_ended });
    const is_expired_visible_class = classNames({ 'show': !!is_ended });
    const box_class = classNames('info-box', {
        'ended': !!is_ended,
    });

    return (
        <div className={box_class}>
            {!!contract_info &&
                <React.Fragment>
                    <InfoBoxExpired
                        contract_info={contract_info}
                        className={is_expired_visible_class}
                    />
                    <InfoBoxLive
                        contract_info={contract_info}
                        className={is_general_visible_class}
                    />
                </React.Fragment>
            }
        </div>
    );
};

InfoBox.propTypes = {
    contract_info: PropTypes.object,
};

export default observer(InfoBox);
