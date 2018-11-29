import React        from 'react';
import { localize } from '_common/localize';
import { Icon404 }  from './Icon404.jsx';
import Button       from '../../../App/Components/Form/button.jsx';
import ErrorBox     from '../../../App/Components/Elements/ErrorBox';

const Page404 = () => (
    <div className='page-error-container'>
        <ErrorBox
            header={localize('Page not found')}
            icon={<Icon404 />}
            message={localize('Sorry, we couldn\'t find the page you are looking for.')}
        >
            <Button
                className='secondary orange'
                has_effect
                text={localize('Go to trade page')}
            />
        </ErrorBox>
    </div>
);

export default Page404;
