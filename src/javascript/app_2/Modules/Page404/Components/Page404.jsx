import React          from 'react';
import { Link }       from 'react-router-dom';
import { routes }     from 'Constants/index';
import { localize }   from '_common/localize';
import { Icon404 }    from './Icon404.jsx';
import Button         from '../../../App/Components/Form/button.jsx';
import ErrorBox       from '../../../App/Components/Elements/ErrorBox';

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
            >
                <Link
                    to={routes.trade}
                    style={{
                        display : 'block',
                        height  : '100%',
                        width   : '100%',
                        position: 'absolute',
                        left    : '0',
                        top     : '0',
                    }}
                />
            </Button>
        </ErrorBox>
    </div>
);

export default Page404;
