import { observer }   from 'mobx-react';
import PropTypes      from 'prop-types';
import React          from 'react';
import InfoBoxExpired from './info_box_expired.jsx';
import InfoBoxGeneral from './info_box_general.jsx';
import { isEnded }    from '../../../../Stores/Modules/Contract/Helpers/logic';

const InfoBox = ({ contract_info }) => {
    const is_ended    = isEnded(contract_info);
    const InfoBoxLive = InfoBoxGeneral; // /digit/.test(contract_info.contract_type) ? InfoBoxDigit : InfoBoxGeneral;

    return (
        <div className='info-box'>
            { is_ended ?
                <InfoBoxExpired contract_info={contract_info} />
                :
                <InfoBoxLive contract_info={contract_info} />
            }
        </div>
    );
};

InfoBox.propTypes = {
    contract_info: PropTypes.object,
};

export default observer(InfoBox);
