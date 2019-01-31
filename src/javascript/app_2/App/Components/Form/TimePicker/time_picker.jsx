import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import Dialog       from './dialog.jsx';
import InputField   from '../input_field.jsx';

class TimePicker extends React.PureComponent {
    state = {
        is_open: false,
        value  : '',
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {zzzzz
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleDropDown = () => {
        this.setState({ is_open: !this.state.is_open });
    };

    handleChange = (arg) => {
        // To handle nativepicker;
        const value = typeof arg === 'object' ? arg.target.value : arg;

        if (value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value } });
        }
    };

    saveRef = (node) => {
        if (!node) return;
        if (node.nodeName === 'INPUT') {
            this.target_element = node;
            return;
        }
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            if (this.state.is_open) {
                this.setState({ is_open: false });
            }
        }
    };

    render() {
        const prefix_class = 'time-picker';
        const {
            value,
            name,
            is_nativepicker,
            placeholder,
            start_time,
            end_time,
            validation_errors,
        } = this.props;
        return (
            <div
                ref={this.saveRef}
                className={classNames(prefix_class,
                    { 'padding': this.props.padding },
                    { 'active': this.state.is_open })}
            >
                {
                    is_nativepicker
                        ? <input
                            type='time'
                            id={`${prefix_class}-input`}
                            value={value}
                            onChange={this.handleChange}
                            name={name}
                            min={start_time}
                            max={end_time}
                        />
                        : (
                            <React.Fragment>
                                <InputField
                                    error_messages={validation_errors}
                                    type='text'
                                    is_read_only
                                    id={`${prefix_class}-input`}
                                    className={classNames(`${prefix_class}-input`,
                                        { 'active': this.state.is_open })}
                                    value={value}
                                    onClick={this.toggleDropDown}
                                    name={name}
                                    placeholder={placeholder}
                                />
                                <Dialog
                                    className={classNames(
                                        { 'active': this.state.is_open },
                                        'from-left')}
                                    onChange={this.handleChange}
                                    preClass={prefix_class}
                                    start_time={start_time}
                                    end_time={end_time}
                                    value={value}
                                />
                            </React.Fragment>
                        )
                }
            </div>
        );
    }
}

TimePicker.propTypes = {
    end_time       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    is_align_right : PropTypes.bool,
    is_clearable   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    name           : PropTypes.string,
    onChange       : PropTypes.func,
    padding        : PropTypes.string,
    placeholder    : PropTypes.string,
    start_time     : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    value          : PropTypes.string,
};

export default observer(TimePicker);
