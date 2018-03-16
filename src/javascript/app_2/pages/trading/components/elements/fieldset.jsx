import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Tooltip from './tooltip.jsx';

class Fieldset extends React.PureComponent {
    render() {
        const field_left_class = classNames('field-info left', { icon: this.props.icon }, this.props.icon);
        let header_time;
        if (this.props.time) {
            header_time = moment(this.props.time || undefined).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');
        }
        return (
            <fieldset>
                <div className='fieldset-header'>
                    <span className={field_left_class}>{this.props.header}</span>
                    <span className='field-info right'>
                        {header_time}
                        <Tooltip
                            alignment='left'
                            is_icon
                            message={this.props.tooltip || 'Message goes here.'}
                        />
                    </span>
                </div>
                {this.props.children}
            </fieldset>
        );
    }
}

export default Fieldset;
