import React             from 'react';
import { localize }      from '_common/localize';
import { IconPortfolio } from 'Assets/Header/NavBar';

const EmptyPortfolioMessage = () => (
    // TODO: combine with statement component, once design is final
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
            <IconPortfolio className='portfolio-empty__icon' />
            <span className='portfolio-empty__text'>{localize('No running contract')}</span>
        </div>
    </div>
);

export default EmptyPortfolioMessage;
