import React         from 'react';
import { localize }  from '_common/localize';
import URL           from '_common/url';
import Localize      from 'App/Components/Elements/localize.jsx';
import Button        from 'App/Components/Form/button.jsx';
import { IconWip }   from 'Assets/Common/icon-wip.jsx';

const onClick = () => {
    window.location.href = URL.websiteUrl();
};

const Wip = () => (
    <div className='work-in-progress'>
        <div className='work-in-progress__content'>
            <IconWip />
            <div className='work-in-progress__header'>
                <Localize str='Work in progress!' />
            </div>
            <div className='work-in-progress__text'>
                <Localize str='This is currently unavailable for mobile devices.' />
            </div>
            <Button
                className='work-in-progress__btn'
                classNameSpan='work-in-progress__btn--span'
                onClick={onClick}
                text={localize('Take me to SmartTrader')}
            />
        </div>
    </div>
);

export default Wip;
