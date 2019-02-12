import classNames           from 'classnames';
import { observer }         from 'mobx-react';
import React                from 'react';
import { CSSTransition }    from 'react-transition-group';
import PropTypes from "prop-types";

class ExpandableInput extends React.Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        let textContainer, textareaSize, input;

        const autoSize = () => {
            textareaSize.innerHTML = input.value + '\n';
        };

        document.addEventListener('DOMContentLoaded', () => {
            textContainer = document.querySelector(`.${this.props.className}`);
            textareaSize = textContainer.querySelector(`.${this.props.className}-size`);
            input = textContainer.querySelector('input');

            autoSize();
            input.addEventListener('input', autoSize);
        })
    }

    render() {
        const { className, children } = this.props;

        return (
            <div className={`expandable-input ${className}`}>
                {children}
                <div className={`input-size ${className}-size`} />
            </div>
        );
    }
}

ExpandableInput.propTypes = {
    className: PropTypes.string,
    children : PropTypes.node,
};

export default observer(ExpandableInput);
