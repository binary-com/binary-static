import React from 'react';
import moment from 'moment';

class ClockHeader extends React.Component {
    constructor(props) {
        super(props);
        this.setClockRef = this.setClockRef.bind(this);
        this.liveClock= this.liveClock.bind(this);
        this.state = {
            time: moment().toDate().toGMTString(),
        };
    }

    setClockRef(node) {
        this.clockRef = node;
    }

    componentDidMount() {
        if (this.clockRef) {
            this.interval = setInterval(this.liveClock, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.setState({ time: undefined });
    }

    liveClock() {
        this.setState({ time: moment().toDate().toGMTString() });
    }

    render() {
        return (
            <div className='clock-header' ref={this.setClockRef}>
                <span className='field-info left'>{this.props.header}</span>
                <span className='field-info right'>{this.state.time}</span>
            </div>
        );
    }
};

export default ClockHeader;
