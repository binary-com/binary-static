import classNames from 'classnames';
import moment     from 'moment';
import React      from 'react';
import PropTypes  from 'prop-types';
import Tooltip    from '../elements/tooltip.jsx';

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

// ToDo:
// - Refactor Last Digit to keep the children as array type.
//   Currently last_digit.jsx returns object (React-Element) as 'children'
//   props type.
Fieldset.propTypes = {
    children: PropTypes.array,
    header : PropTypes.string,
    icon   : PropTypes.string,
    time   : PropTypes.object,
    tooltip: PropTypes.string,
};

export default Fieldset;
