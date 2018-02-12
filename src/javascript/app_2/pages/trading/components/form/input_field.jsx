import React from 'react';

class InputField extends React.PureComponent {
    render() {
        return (
            <div className={`input-field ${this.props.className ? this.props.className : ''} ${this.props.is_currency ? 'icon' : ''}`}>
                {!!this.props.label &&
                    <label htmlFor={this.props.name} className='input-label'>{this.props.label}</label>
                }
                {this.props.is_currency ?
                    <i>{this.props.is_currency}</i>
                :
                undefined
                }
                <input
                    type={this.props.type}
                    name={this.props.name}
                    step={this.props.is_currency ? '0.01' : undefined}
                    placeholder={this.props.placeholder || undefined}
                    disabled={this.props.is_disabled}
                    defaultValue={this.props.value}
                    onChange={this.props.onChange}
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

export default InputField;
