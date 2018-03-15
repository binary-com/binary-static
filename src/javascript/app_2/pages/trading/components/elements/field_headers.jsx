import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Tooltip from './tooltip.jsx';


class FieldHeader extends React.PureComponent {
    render() {
        const field_left_class = classNames('field-info left', { icon: this.props.icon }, this.props.icon);
        return (
            <div className='fieldset-header'>
                <span className={field_left_class}>{this.props.header}</span>
                <span className='field-info right'>
                    <Tooltip
                        alignment='left'
                        is_icon
                        message={this.props.tooltip || 'Message goes here.'}
                    />
                </span>
            </div>
        );
    }
}

class ClockHeader extends React.PureComponent {
    render() {
        const clock_header_class = classNames('clock-header', this.props.className);
        const field_left_class = classNames('field-info left', { icon: this.props.icon }, this.props.icon);
        const header_time = moment(this.props.time || undefined).utc().format('YYYY-MM-DD HH:mm:ss');
        return (
            <div className={clock_header_class}>
                <span className={field_left_class}>{this.props.header}</span>
                <span className='field-info right'>
                    {header_time} GMT
                    <Tooltip message={this.props.tooltip ||  'Message goes here.'} is_icon alignment='left' />
                </span>
            </div>
        );
    }
}

module.exports = {
    ClockHeader,
    FieldHeader,
};
