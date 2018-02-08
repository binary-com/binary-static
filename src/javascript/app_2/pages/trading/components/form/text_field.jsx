import React from 'react';

class TextField extends React.PureComponent {
    render() {
        return <input type='text' {...this.props} />;
    }
}

class FieldGroup extends React.PureComponent {
    render() {
        return (
            <fieldset>
                <TextField {...this.props} />
            </fieldset>
        );
    }
}

class InputField extends React.PureComponent {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.state = {
            value: this.props.value,
        };
    }

    update(e) {
        this.setState({value: e.target.value});
        this.props.onChange(e);
    }

    render() {
        return (
            <div className='input-field'>
                {this.props.label ?
                    <label htmlFor={this.props.name} className='input-label'>{this.props.label}</label>
                :
                undefined
                }
                <input
                    type={this.props.type}
                    name={this.props.name}
                    step={this.props.is_currency ? '0.01' : undefined}
                    className={this.props.class1 || undefined}
                    placeholder={this.props.placeholder || undefined}
                    disabled={this.props.is_disabled}
                    value={this.state.value}
                    onChange={this.update}
                    required={this.props.required || undefined}
                />
                {this.props.helper ?
                    <span className='input-helper'>{this.props.helper}</span>
                :
                  undefined
                }
            </div>
        );
    }

}

module.exports = {
    TextField,
    FieldGroup,
    InputField,
};
