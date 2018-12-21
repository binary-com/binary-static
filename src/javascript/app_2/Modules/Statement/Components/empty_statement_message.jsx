import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { IconStatement } from 'Assets/Header/NavBar';
import { routes }        from 'Constants/index';
import { ButtonLink }    from 'App/Components/Routes';

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
                <ButtonLink
                    className='secondary orange'
                    to={routes.trade}
                >
                    <span>{localize('Trade now')}</span>
                </ButtonLink>
            }
        </div>
    </React.Fragment>
);

EmptyStatementMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyStatementMessage;
