import PropTypes from 'prop-types';
import React     from 'react';

class DigitSelector extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(item) {
        if (+item.target.getAttribute('data-value') !== this.props.selected_digit) {
            this.props.onChange({ target: { name: this.props.name, value: +item.target.getAttribute('data-value') } });
        }
    }

    render() {
        return (
            <div className='digit-selector center-text'>
                {[...Array(10).keys()].map(i =>
                    <div
                        key={i}
                        className={`digit-selection${this.props.selected_digit === i ? ' selected' : ''}`}
                        data-value={i}
                        onClick={this.handleSelect}
                    >
                        {i}
                    </div>
                )}
            </div>
        );
    }
}

DigitSelector.propTypes = {
    name          : PropTypes.string,
    onChange      : PropTypes.func,
    selected_digit: PropTypes.number,
};

export default DigitSelector;
