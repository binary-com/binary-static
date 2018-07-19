import classNames      from 'classnames';
import moment          from 'moment';
import React           from 'react';
import DatePickerInput from './date_picker_input.jsx';
import ArrowHead       from '../../Elements/arrowhead.jsx';
import Calendar        from '../../Elements/Calendar';
import {
    formatDate,
    daysFromTodayTo }  from '../../../../Utils/Date';

class DatePicker extends React.PureComponent {
    state = {
        value                : '',
        is_datepicker_visible: false,
        is_close_btn_visible : false,
    };

    componentWillReceiveProps({ value, mode }) {
        if (value === this.state.value) return;
        this.updateDatePickerValue(value, mode);
    }

    componentWillMount() {
        document.addEventListener('click', this.onClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside, true);
    }

    handleVisibility = () => {
        this.setState({ is_datepicker_visible: !this.state.is_datepicker_visible });
    }

    onClickOutside = (e) => {
        if (!this.mainNode.contains(e.target) && this.state.is_datepicker_visible) {
            this.setState({ is_datepicker_visible: false });
            if (this.props.mode !== 'duration') {
                this.updateDatePickerValue(formatDate(this.state.value));
            }
        }
    }

    onMouseEnter = () => {
        if (this.state.value && (!('is_clearable' in this.props) || this.props.is_clearable)) {
            this.setState({ is_close_btn_visible: true });
        }
    }

    onMouseLeave = () => {
        this.setState({ is_close_btn_visible: false });
    }

    onSelectCalendar = (selected_date, is_datepicker_visible) => {
        let value = selected_date;
        if (!moment.utc(value).isValid) { value = ''; }

        if (this.props.mode === 'duration') {
            this.updateDatePickerValue(daysFromTodayTo(value), 'duration');
        } else {
            this.updateDatePickerValue(value);
        }
        this.setState({ is_datepicker_visible });
    }

    onChangeInput = (e) => {
        const value = e.target.value;
        this.updateDatePickerValue(value, this.props.mode);
    }

    clearDatePickerInput = () => {
        this.setState({ value: '' }, this.updateStore);
        this.calendar.resetCalendar();
    };

    // TODO: handle cases where user inputs date before min_date and date after max_date
    updateDatePickerValue = (value, mode) => {
        this.setState({ value }, this.updateStore);
        
        // update Calendar
        const { date_format, start_date } = this.props;
        const new_date = (mode === 'duration') ? moment.utc().add(value, 'days').format(date_format) : value;
        if (moment.utc(new_date, date_format).isValid() || !new_date) {
            if (!new_date) {
                const current_date = moment.utc(start_date).format(date_format);
                this.calendar.setState({ 
                    calendar_date: current_date,
                    selected_date: current_date,
                });
            } else {
                this.calendar.setState({ 
                    calendar_date: formatDate(new_date),
                    selected_date: formatDate(new_date),
                }); 
            }
        }
    }
    
    // update MobX store
    updateStore = () => {
        const { name, onChange } = this.props;
        if (onChange) {
            onChange({ target: { name, value: this.state.value } });
        }
    };

    render() {
        if (this.props.is_nativepicker) {
            return (
                <div ref={node => { this.mainNode = node; }} className='datepicker-container'>
                    <input
                        id={this.props.name}
                        name={this.props.name}
                        className='datepicker-display'
                        type='date'
                        value={this.state.value}
                        min={this.props.min_date}
                        max={this.props.max_date}
                        onChange={(e) => {
                            // fix for ios issue: clear button doesn't work
                            // https://github.com/facebook/react/issues/8938
                            const target = e.nativeEvent.target;
                            function iosClearDefault() { target.defaultValue = ''; }
                            window.setTimeout(iosClearDefault, 0);

                            this.onSelectCalendar(e.target.value);
                        }}
                    />
                    <label className='datepicker-native-overlay' htmlFor={this.props.name}>
                        {this.state.value || this.props.placeholder}
                        <ArrowHead className='datepicker-native-overlay__arrowhead' />
                    </label>
                </div>
            );
        }

        return (
            <div ref={node => { this.mainNode = node; }} className='datepicker-container'>
                <div
                    className='datepicker-display-wrapper'
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                >
                    <DatePickerInput 
                        class_name='datepicker-display'
                        mode={this.props.mode}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        onClick={this.handleVisibility}
                        is_read_only={true}
                        value={this.state.value}
                    />
                    <span
                        className={classNames('picker-calendar-icon', {
                            show: !this.state.is_close_btn_visible,
                        })}
                        onClick={this.handleVisibility}
                    />
                    <span
                        className={classNames('close-circle-icon', {
                            show: this.state.is_close_btn_visible,
                        })}
                        onClick={this.clearDatePickerInput}
                    />
                </div>
                <div
                    className={classNames('datepicker-calendar', {
                        show: this.state.is_datepicker_visible,
                    })}
                >
                    <Calendar
                        ref={node => { this.calendar = node; }}
                        onSelect={this.onSelectCalendar}
                        {...this.props}
                    > 
                        <DatePickerInput 
                            class_name='calendar-input'
                            mode={this.props.mode}
                            name={this.props.name}
                            onChange={this.onChangeInput}
                            placeholder={this.props.placeholder}
                            is_read_only={'is_read_only' in this.props ? this.props.is_read_only : false}
                            value={this.state.value}
                        />
                    </Calendar>
                </div>
            </div>
        );
    }
}

DatePicker.defaultProps = {
    date_format: Calendar.defaultProps.date_format,
    mode       : 'date',
};

DatePicker.propTypes = {
    ...DatePickerInput.propTypes,
    ...Calendar.propTypes,
};

export default DatePicker;
