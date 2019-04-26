import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from '_common/localize';
import { routes }      from 'Constants/index';
import { ButtonLink }  from 'App/Components/Routes';
import Localize        from 'App/Components/Elements/localize.jsx';

const EmptyTradeHistoryMessage = ({ has_selected_date }) => (
    <React.Fragment>
        <div className='empty-trade-history'>
            <span className='empty-trade-history__text'>
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
                    <Localize str={'Trade now'} />
                </ButtonLink>
            }
        </div>
    </React.Fragment>
);

EmptyTradeHistoryMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyTradeHistoryMessage;
