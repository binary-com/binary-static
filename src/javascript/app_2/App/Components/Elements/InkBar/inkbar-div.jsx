import classnames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import { InkBar } from './inkbar.jsx';

class InkBarDiv extends React.Component {
    constructor(props) {
        super(props);
        window.addEventListener('resize', this.updateInkbarPosition);
        this.state = {
            left : 0,
            width: 0,
        };
    }

    componentDidMount() {
        if (!this.node) return;
        this.updateInkbarPosition(this.node.querySelector('a[class="active"]'));
    }

    componentDidUpdate() {
        const active_el = this.node.querySelector('a[class="active"]');
        if (active_el) {
            this.updateInkbarPosition(active_el);
        } else if (this.state.left !== 0 || this.state.width !== 0) {
            this.clearInkBar(); // clear InkBar when active element doesn't exist
        }
    }

    componentWillUnMount() {
        window.removeEventListener('resize', this.updateInkbarPosition);
        this.clearInkBar();
    }

    onClick = (e) => {
        if (!e.target) return;
        this.updateInkbarPosition(e.target.closest('a'));
    };

    clearInkBar = () => {
        this.setState({
            left : 0,
            width: 0,
        });
    };

    updateInkbarPosition = (el) => {
        if (!el) return;
        const { offsetLeft: left, offsetWidth: width } = el;
        if (this.state.width !== width) {
            this.setState({ width });
        }
        if (this.state.left !== left) {
            this.setState({ left });
        }
    };

    render() {
        const { className, ...other_props } = this.props;
        const props = {
            className: classnames('has-inkbar', className),
            ...other_props,
        };

        return (
            <div ref={(node) => this.node = node} {...props}>
                {
                    React.Children.map(this.props.children, child => (
                        React.cloneElement(child, {
                            onClick: this.onClick,
                        })
                    ))
                }
                <InkBar left={this.state.left} width={this.state.width} />
            </div>
        );
    }
}

InkBarDiv.propTypes = {
    children : PropTypes.array,
    className: PropTypes.string,
};

export default InkBarDiv;
