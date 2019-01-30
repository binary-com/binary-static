import React             from 'react';
import { localize }      from '_common/localize';
import { IconPositions } from 'Assets/Header/NavBar';

const EmptyPositionsMessage = () => (
    // TODO: combine with statement component, once design is final
    <div className='positions-empty'>
        <IconPositions className='positions-empty__icon' />
        <span className='positions-empty__text'>{localize('No open positions.')}</span>
    </div>
);

export default EmptyPositionsMessage;
