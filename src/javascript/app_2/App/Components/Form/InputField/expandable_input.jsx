import { observer }         from 'mobx-react';
import PropTypes            from 'prop-types';
import React                from 'react';

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
    children : PropTypes.node,
    className: PropTypes.string,
};

export default observer(ExpandableInput);
