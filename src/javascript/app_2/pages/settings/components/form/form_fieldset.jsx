import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class FormFieldSet extends PureComponent {
    state = {
        visibilty: false,
    }

    // To-Do: OnClick -> password visibility clickable.
    onPasswordVisibilityClick = () => {
        this.setState({visibilty: !this.state.visibility});
    };

    renderSymbol = () => {
        const { helper } = this.props;
        if (helper==='dollar') {
            return (<i className='settings__dollar'/>);
        } else if (helper==='dropdown') {
            return (<i className='settings__dropdown'/>);
        } else if (helper==='pw') {
            if (this.state.visibility) {
                return (<i className='settings__pw_unhide' onClick={this.onPasswordVisibilityClick}/>);
            }
            return (<i className='settings__pw_hide' onClick={this.onPasswordVisibilityClick}/>);
        }
        return <i/>;
    };

    render() {
        const {
            label_name,
            value,
            onChange,
            name,
            type,
            helper,
        } = this.props;
        const inputClassName = `${helper==='dollar' ?
            'settings__content_form__dollar_input' :
            'settings__content_form__input'}`;
        return (
            <fieldset className='settings__content_form__input_container'>
                <label className='settings__content_form__input_label'>{ label_name }</label>
                <div className='settings__content_form__input_box'>
                    { this.renderSymbol() }
                    <input
                        type={type}
                        className={inputClassName}
                        name={name}
                        placeholder='Text Here'
                        value={value}
                        onChange={onChange}
                        data-lpignore
                    />
                </div>
            </fieldset>
        );
    }
}

FormFieldSet.propTypes = {
    helper    : PropTypes.string,
    label_name: PropTypes.string,
    name      : PropTypes.string,
    onChange  : PropTypes.func,
    type      : PropTypes.string,
    value     : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};
