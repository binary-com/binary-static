import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from '_common/localize';
import { Icon }        from 'Assets/Common';
import { IconReports } from 'Assets/Header/NavBar';
import { routes }      from 'Constants/index';
import { ButtonLink }  from 'App/Components/Routes';

const EmptyOpenPositionsMessage = ({ has_selected_date }) => (
    <React.Fragment>
        <div className='empty-open-positions'>
            <Icon icon={IconReports} className='empty-open-positions__icon' />
            <span className='empty-open-positions__text'>
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
                    className='btn--secondary btn--secondary--orange'
                    to={routes.trade}
                >
                    <span>{localize('Trade now')}</span>
                </ButtonLink>
            }
        </div>
    </React.Fragment>
);

EmptyOpenPositionsMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyOpenPositionsMessage;
