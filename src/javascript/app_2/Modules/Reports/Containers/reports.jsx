import React       from 'react';
import { connect } from 'Stores/connect';

class Reports extends React.Component {
    render() {
        return (
            <h1>{`[WIP, test \`connect\`] Is mobile: ${this.props.is_mobile}`}</h1>
        );
    }
}

export default connect(
    ({ ui }) => ({
        is_mobile: ui.is_mobile,
    })
)(Reports);
