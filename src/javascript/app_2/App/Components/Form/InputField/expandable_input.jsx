import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

class ExpandableInput extends React.Component {
    handleExpand = () => {
        const textContainer = document.querySelector(`.${this.props.input_class}`);
        const textareaSize = textContainer.querySelector(`.${this.props.input_resizer_class}`);
        const input = textContainer.querySelector('input');
        textareaSize.innerHTML = `${input.value} \n`;
    };

    componentDidMount() {
        this.handleExpand();
    }

    componentDidUpdate() {
        this.handleExpand();
    }

    render() {
        const { input_class, input_resizer_class, children } = this.props;

        return (
            <div className={`expandable-input ${input_class}`}>
                {children}
                <div className={`input-size ${input_resizer_class}`} />
            </div>
        );
    }
}

ExpandableInput.propTypes = {
    children           : PropTypes.node,
    input_class        : PropTypes.string,
    input_resizer_class: PropTypes.string,
};

export default observer(ExpandableInput);
