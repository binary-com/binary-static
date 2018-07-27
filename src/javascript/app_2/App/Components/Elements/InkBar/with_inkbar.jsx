import classnames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import ReactDOM   from 'react-dom';
import InkBar     from './inkbar.jsx';

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

        onClick = (e) => {
            if (!e.target) return;
            this.updateInkbarPosition(e.target.closest('a'));
        }

        updateInkbarPosition = (el) => {
            if (!el) return;
            this.setState({ 
                left : el.offsetLeft,
                width: el.offsetWidth,
            });
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