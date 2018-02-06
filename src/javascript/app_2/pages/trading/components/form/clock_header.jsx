import React from 'react';
import moment from 'moment';

class ClockHeader extends React.Component {
    constructor(props) {
        super(props);
        this.liveClock= this.liveClock.bind(this);
        this.state = {
            time: moment().toDate().toGMTString(),
        };
    }

    componentDidMount() {
        setInterval(this.liveClock, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.liveClock);
    }

    liveClock() {
        this.setState({ time: moment().toDate().toGMTString() });
    }

    render() {
        return (
            <div className='clock-header'>
                <span className='field-info left'>{this.props.header}</span>
                <span className='field-info right'>{this.state.time}</span>
            </div>
        );
    }
};

export default ClockHeader;
