import { observer }         from 'mobx-react';
import PropTypes            from 'prop-types';
import React                from 'react';

class ExpandableInput extends React.Component {
    componentDidMount() {
        const textContainer = document.querySelector(`.${this.props.className}`);
        const textareaSize = textContainer.querySelector(`.${this.props.className}-size`);
        const input = textContainer.querySelector('input');

        const autoSize = () => {
            textareaSize.innerHTML = `${input.value} \n`;
        };
        autoSize();
        input.addEventListener('input', autoSize);
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
