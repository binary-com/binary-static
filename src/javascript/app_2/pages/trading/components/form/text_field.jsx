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

class TestField extends React.PureComponent {
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
        console.log(e.target.value);
    }

    render() {
        return (
            <div className='input-field'>
                {this.props.label ?
                    <label htmlFor={this.props.name} className='input-label'>{this.props.label}</label>
                :
                undefined
                }
                <input type={this.props.type}
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

const InputField = ({
    type,
    name,
    class1,
    is_disabled,
    is_currency,
    value,
    on_change,
    label,
    placeholder,
    helper,
    required,
}) => (
        <div className='input-field'>
            {label ?
                <label htmlFor={name} className='input-label'>{label}</label>
            :
            undefined
            }
            <input type={type}
                   name={name}
                   step={is_currency ? '0.01' : undefined}
                   className={class1 || undefined}
                   placeholder={placeholder || undefined}
                   disabled={is_disabled}
                   value={value}
                   onChange={on_change}
                   required={required || undefined}
            />
            {helper ?
                <span className='input-helper'>{helper}</span>
            :
              undefined
            }
        </div>
);


module.exports = {
    TextField,
    FieldGroup,
    InputField,
    TestField,
};
