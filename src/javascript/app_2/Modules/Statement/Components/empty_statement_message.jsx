import PropTypes            from 'prop-types';
import React, { Component } from 'react';
import { Redirect }         from 'react-router-dom';
import { localize }         from '_common/localize';
import Button               from 'App/Components/Form/button.jsx';
import { IconStatement }    from 'Assets/Header/NavBar';
import { routes }           from 'Constants/index';

class EmptyStatementMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        };
    }

    setRedirect() {
        this.setState({
            redirect: true,
        });
    }

    renderRedirect() {
        return this.state.redirect &&
            <Redirect to={routes.trade} />;
    }

    render = () => (
        <React.Fragment>
            {this.renderRedirect()}
            <div className='statement-empty'>
                <IconStatement className='statement-empty__icon' />
                <span className='statement-empty__text'>
                    {
                        !this.props.has_selected_date ?
                            localize('Your account has no trading activity.')
                            :
                            localize('Your account has no trading activity for the selected period.')
                    }
                </span>
                {
                    !this.props.has_selected_date &&
                    <Button
                        className='secondary orange'
                        text={localize('Trade now')}
                        onClick={this.setRedirect.bind(this)}
                    />
                }
            </div>
        </React.Fragment>
    );
}

EmptyStatementMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyStatementMessage;
