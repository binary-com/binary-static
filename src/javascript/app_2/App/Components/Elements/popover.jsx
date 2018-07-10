import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '../../../../_common/localize';

class Popover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
        };
    }

    render() {
        const popover = (
            <div className={`popover ${this.state.is_open ? 'open' : ''} ${this.props.alignment ? this.props.alignment : ''}`}>
                { this.props.title && <div className='popover-title'>{localize(this.props.title)}</div> }
                { this.props.subtitle && <div className='popover-subtitle'>{localize(this.props.subtitle)}</div> }
            </div>
        );

        return (
            <React.Fragment>
                {
                    React.Children.map(this.props.children, child => (
                        React.cloneElement(child, {
                            onMouseEnter: () => this.setState({ is_open: true }),
                            onMouseLeave: () => this.setState({ is_open: false }),
                        }, popover)
                    ))
                }
            </React.Fragment>
        );
    }
}

Popover.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.object,
    subtitle : PropTypes.string,
    title    : PropTypes.string,
};

export default Popover;
