import PropTypes         from 'prop-types';
import React             from 'react';
import { Link }          from 'react-router-dom';
import { localize }      from '_common/localize';
import Button            from 'App/Components/Form/button.jsx';
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
                <Button
                    className='secondary orange'
                    has_effect
                    text={localize('Trade now')}
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
            }
        </div>
    </React.Fragment>
);

EmptyStatementMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyStatementMessage;
