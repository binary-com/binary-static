import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';
import Tooltip    from '../elements/tooltip.jsx';

class Fieldset extends React.PureComponent {
    render() {
        const field_left_class = classNames('field-info left', { icon: this.props.icon }, this.props.icon);
        return (
            <fieldset className='trade-fieldset'>
                <div className='fieldset-header'>
                    <span className={field_left_class}>{this.props.header}</span>
                    <span className='field-info right'>
                        {!!this.props.tooltip &&
                            <Tooltip
                                alignment='left'
                                icon='info'
                                message={this.props.tooltip || 'Message goes here.'}
                            />
                        }
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
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    header : PropTypes.string,
    icon   : PropTypes.string,
    time   : PropTypes.object,
    tooltip: PropTypes.string,
};

export default Fieldset;
