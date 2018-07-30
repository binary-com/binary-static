import classnames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import ReactDOM   from 'react-dom';
import { InkBar } from './inkbar.jsx';

const withInkBar = (Component) => {
    class ComponentWithInkBar extends React.Component {
        state = {
            left : 0,
            width: 0,
        };

        componentDidMount() {
            this.node = ReactDOM.findDOMNode(this); // eslint-disable-line
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

        componentWillMount() {
            window.addEventListener('resize', this.updateInkbarPosition);
        }

        componentWillUnMount() {
            window.removeEventListener('resize', this.updateInkbarPosition);
            this.clearInkBar();
        }

        onClick = (e) => {
            if (!e.target) return;
            this.updateInkbarPosition(e.target.closest('a'));
        }

        clearInkBar = () => {
            this.setState({
                left : 0,
                width: 0,
            });
        }

        updateInkbarPosition = (el) => {
            if (!el) return;
            const { offsetLeft: left, offsetWidth: width } = el;
            if (this.state.width !== width) {
                this.setState({ width });
            }
            if (this.state.left !== left) {
                this.setState({ left });
            }
        }

        render() {
            const { className, ...other_props } = this.props;
            const props = {
                className: classnames('with-inkbar', className),
                ...other_props,
            };

            return (
                <Component {...props}>
                    { 
                        React.Children.map(this.props.children, child => (
                            React.cloneElement(child, {
                                onClick: this.onClick,
                            })
                        ))
                    }
                    <InkBar left={this.state.left} width={this.state.width} />
                </Component>
            );
        }
    };

    ComponentWithInkBar.propTypes = {
        className: PropTypes.string,
        children : PropTypes.array,
    };
    return ComponentWithInkBar;
};

export default withInkBar;