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

const MdcTextField = ({
    id,
    type='text',
    label,
    name,
    value,
    on_change,
}) => (
        <div className='mdc-textfield'>
            <input id={id} name={name}
                   type={type}
                   value={value}
                   onChange={on_change}
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            {label ?
            <label>{name}</label>
            :
            undefined
            }
        </div>
    );

module.exports = {
    TextField,
    FieldGroup,
    MdcTextField,
};
