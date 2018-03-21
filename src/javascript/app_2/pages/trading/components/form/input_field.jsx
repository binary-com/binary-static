import React from 'react';

class InputField extends React.PureComponent {
    handleFocus = (e) => {
        // mobile soft keyboard covers input in chrome and uc browser
        const el = e.target;

        const handleResize = () => {
            if (el) {
                window.setTimeout(() => {
                    el.scrollIntoView();
                }, 100);
            }
            window.removeEventListener('resize', handleResize, false);
        };
        window.addEventListener('resize', handleResize, false);

        // remove listener if resize was not fired (iOS)
        window.setTimeout(() => {
            window.removeEventListener('resize', handleResize, false);
        }, 1000);
    }

    render() {
        return (
            <div className={`input-field ${this.props.className ? this.props.className : ''}`}>
                {!!this.props.label &&
                    <label htmlFor={this.props.name} className='input-label'>{this.props.label}</label>
                }
                {!!this.props.prefix &&
                    <i><span className={`symbols ${this.props.prefix.toLowerCase()}`} /></i>
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
                    onFocus={this.props.is_nativepicker && this.handleFocus}
                />
                {!!this.props.helper &&
                    <span className='input-helper'>{this.props.helper}</span>
                }
            </div>
        );
    }
}

export default InputField;
