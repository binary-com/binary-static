import React from 'react';
import moment from 'moment';

class ClockHeader extends React.Component {
    render() {
        return (
            <div className={`clock-header ${this.props.className ? this.props.className : ''}`}>
                <span className='field-info left'>{this.props.header}</span>
                <span className='field-info right'>{moment(this.props.time || undefined).utc().format('YYYY-MM-DD HH:mm:ss')} GMT</span>
            </div>
        );
    }
}

export default ClockHeader;
