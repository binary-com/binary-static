import React, { Component } from 'react';
import PropTypes            from 'prop-types';

class CheckBox extends Component {
    state = {
        isChecked: false,
    }

    toggleCheckBoxChange = () => {
        const { handleCheckBoxChange, label } = this.props;
        this.setState({isChecked: !this.state.isChecked});
        handleCheckBoxChange(label);
    }

    render() {
        const { label } = this.props;
        const { isChecked } = this.state;

        return (
            <label>
                <input
                    type='checkbox'
                    value={label}
                    checked={isChecked}
                    onChange={this.toggleCheckBoxChange}
                />
                <span className='settings__checkbox_text'>{label}</span>
            </label>
        );
    }
}

CheckBox.propTypes = {
    label               : PropTypes.string.isRequired,
    handleCheckBoxChange: PropTypes.func.isRequired,
};

export default CheckBox;
