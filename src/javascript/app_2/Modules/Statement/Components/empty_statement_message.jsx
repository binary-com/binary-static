import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { IconStatement } from 'Assets/Header/NavBar';
import Button            from 'App/Components/Form/button.jsx';

const EmptyStatementMessage = ({ has_selected_date }) => (
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
            <Button className='secondary orange' text={localize('Trade now')} />
        }
    </div>
);

EmptyStatementMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyStatementMessage;
