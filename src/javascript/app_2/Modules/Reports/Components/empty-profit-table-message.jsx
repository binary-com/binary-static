import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from '_common/localize';
import { Icon }        from 'Assets/Common';
import { IconReports } from 'Assets/Header/NavBar';
import { routes }      from 'Constants/index';
import { ButtonLink }  from 'App/Components/Routes';

const EmptyProfitTableMessage = ({ has_selected_date }) => (
    <React.Fragment>
        <div className='empty-profit-table'>
            <Icon icon={IconReports} className='empty-profit-table__icon' />
            <span className='empty-profit-table__text'>
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

EmptyProfitTableMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyProfitTableMessage;
