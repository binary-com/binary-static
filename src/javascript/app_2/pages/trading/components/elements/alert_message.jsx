import React from 'react';
import Url from '../../../../../_common/url';

/*
    Use example:
    <AlertMessage
        type='error'
        message='This is danger'
        onClose={() => {console.log('onClose has been called')}}
    />
*/

const types = ['error', 'info', 'success', 'warning'];

class AlertMessage extends React.PureComponent {
    constructor(props) {
        super(props);

        if (types.indexOf(props.type) === -1) {
            throw new Error('Wrong type passed to AlertMessage component!');
        }
        this.state = {
            closed: false,
        };
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({
            closed: true,
        });
        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

    render() {
        if (this.state.closed) return null;

        const { type, message } = this.props;

        const closeButton = (
            <a className='alert-close' onClick={this.handleClose}>
                <img className='alert-close-icon' src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
            </a>
        );

        return (
            <div className={`alert alert-${type}`}>
                <span className='alert-icon' />
                <span className='alert-message'>{message}</span>
                {closeButton}
            </div>
        );
    }
}

export default AlertMessage;