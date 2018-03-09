import React from 'react';
import { localize } from '../../../../../_common/localize';

class Popover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    render() {
        const extendedChildren = React.Children.map(this.props.children, child => (
            React.cloneElement(child, {
                onMouseEnter: () => this.setState({ open: true }),
                onMouseLeave: () => this.setState({ open: false }),
            })
        ));

        return (
            <React.Fragment>
                <div ref={node => this.ref = node} className={`popover ${this.state.open ? 'open' : ''}`}>
                    {this.props.title && <div className='popover-title'>{localize(this.props.title)}</div>}
                    <div className='popover-subtitle'>{localize(this.props.subtitle)}</div>
                    <span className='popover-arrow'/>
                </div>
                { extendedChildren }
            </React.Fragment>
        );
    }
}

export default Popover;