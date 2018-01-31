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

const InputField = ({
    type,
    name,
    class1,
    is_disabled,
    value,
    on_change,
}) => {
    const classes = `inputfield ${class1||''}`;
    return (
        <input type={type}
               name={name}
               className={classes}
               disabled={is_disabled}
               value={value}
               onChange={on_change}
        />
    );
};


module.exports = {
    TextField,
    FieldGroup,
    InputField,
};
