import React           from 'react';
import PropTypes       from 'prop-types';
import Button          from '../../../../../../App/Components/Form/button.jsx';
import { localize }    from '../../../../../../../_common/localize';

const PurchaseLock = ({ toggle }) => (
    <div className='purchase-lock-container'>
        <div className='lock-container'>
            <svg className='ic-lock' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
                <g fill='none' fillRule='evenodd' transform='translate(3 1)'>
                    <rect width='9' height='7' x='.5' y='6.5' stroke='#2A3052' rx='1'/>
                    <circle cx='5' cy='10' r='1' fill='#2A3052'/>
                    <path stroke='#2A3052' d='M5 .5C7 .5 8.5 2.1 8.5 4v2.5h-7V4C1.5 2 3.1.5 5 .5z'/>
                </g>
            </svg>
        </div>
        <h4>{localize('purchase locked')}</h4>
        <Button
            className='flat secondary orange'
            has_effect
            onClick={toggle}
            text={localize('unlock')}
        />
        <span className='lock-message'>
            {localize('You can lock/unlock the purchase button from the Settings menu')}
        </span>
    </div>
);

PurchaseLock.propTypes = {
    toggle: PropTypes.func,
};

export default PurchaseLock;
