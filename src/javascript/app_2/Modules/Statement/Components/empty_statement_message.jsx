import PropTypes         from 'prop-types';
import React             from 'react';
import { Link }          from 'react-router-dom';
import { localize }      from '_common/localize';
import { IconStatement } from 'Assets/Header/NavBar';
import { routes }        from 'Constants/index';

const EmptyStatementMessage = ({ has_selected_date }) => (
    <React.Fragment>
        <div className='statement-empty'>
            <IconStatement className='statement-empty__icon' />
            <span className='statement-empty__text'>
                {
                    !has_selected_date ?
                        localize('Your account has no trading activity.')
                        :
                        localize('Your account has no trading activity for the selected period.')
                }
            </span>
            {
                !has_selected_date &&
                <Link
                    className='secondary orange '
                    to={routes.trade}
                >
                    {localize('Trade now')}
                </Link>
            }
        </div>
    </React.Fragment>
);

EmptyStatementMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyStatementMessage;
