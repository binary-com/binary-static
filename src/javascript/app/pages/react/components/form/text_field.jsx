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

module.exports = {
    TextField,
    FieldGroup,
};
