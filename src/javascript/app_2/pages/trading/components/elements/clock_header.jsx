import React from 'react';
import moment from 'moment';

class ClockHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: '',
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ time: moment().toDate().toGMTString() });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.setState({ time: '' });
    }

    render() {
        return (
            <div className='clock-header'>
                <span className='field-info left'>{this.props.header}</span>
                <span className='field-info right'>{this.state.time}</span>
            </div>
        );
    }
}

export default ClockHeader;
