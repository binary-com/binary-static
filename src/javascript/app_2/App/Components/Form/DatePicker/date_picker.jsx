import classNames      from 'classnames';
import { observer }    from 'mobx-react';
import React           from 'react';
import {
    IconArrow,
    IconCalendar,
    IconClear }        from 'Assets/Common';
import InputField      from 'App/Components/Form/input_field.jsx';
import {
    addDays,
    daysFromTodayTo,
    formatDate,
    isDateValid,
    toMoment }         from 'Utils/Date';
import { localize }    from '_common/localize';
import Calendar        from '../../Elements/Calendar';

class DatePicker extends React.Component {
    state = {
        value                : '',
        is_datepicker_visible: false,
        is_clear_btn_visible : false,
    };

    componentDidMount() {
        document.addEventListener('click', this.onClickOutside, true);
        const { mode, value } = this.props;
        if (mode === 'duration') {
            this.updateDatePickerValue(this.props.duration_d);
        } else {
            this.updateDatePickerValue(formatDate(value, 'DD MMM YYYY'));
        }
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
            if (!!this.state.value && this.props.mode !== 'duration') {
                this.updateDatePickerValue(formatDate(this.state.value));
            }
        }
    }

    onMouseEnter = () => {
        if (this.state.value && (!('is_clearable' in this.props) || this.props.is_clearable)) {
            this.setState({ is_clear_btn_visible: true });
        }
    }

    onMouseLeave = () => {
        this.setState({ is_clear_btn_visible: false });
    }

    onSelectCalendar = (selected_date, is_datepicker_visible) => {
        let value = selected_date;
        if (!isDateValid(value)) { value = ''; }

        if (this.props.mode === 'duration') {
            this.updateDatePickerValue(daysFromTodayTo(value));
        } else {
            this.updateDatePickerValue(formatDate(value, 'DD MMM YYYY'));
        }
        this.setState({ is_datepicker_visible });
    }

    onChangeInput = (e) => {
        const value = e.target.value;
        this.updateDatePickerValue(value);
        this.props.onChange(e);
    }

    clearDatePickerInput = () => {
        this.setState({ value: null }, this.updateStore);
        this.calendar.resetCalendar();
    };

    // TODO: handle cases where user inputs date before min_date and date after max_date
    updateDatePickerValue = (value) => {
        const { date_format, mode, start_date } = this.props;
        this.setState({ value }, this.updateStore);

        // update Calendar
        const new_date = (mode === 'duration') ? addDays(toMoment(), value) : value;
        if (this.calendar && (isDateValid(new_date) || !new_date)) {
            if (!new_date) {
                const current_date = formatDate(start_date, date_format);
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

    renderInputField = () => {
        const { is_read_only, mode, name, error_messages, max_value, min_value } = this.props;
        let { placeholder } = this.props;
        let type, onChange, is_incrementable;

        switch (mode) {
            case 'duration':
                onChange = this.onChangeInput;
                type = 'number';
                is_incrementable = this.props.is_incrementable;
                break;
            default:
                placeholder = placeholder || localize('Select a date');
                type = 'text';
                is_incrementable = false;
        }

        return (
            <InputField
                className='datepicker__input'
                data-tip={false}
                data-value={this.state.value}
                error_messages={error_messages}
                is_incrementable={is_incrementable}
                is_read_only={is_read_only}
                max_value={max_value}
                min_value={min_value}
                name={name}
                onChange={onChange}
                onClick={this.handleVisibility}
                placeholder={placeholder}
                type={type}
                value={this.state.value}
            />
        );
    };

    render() {
        if (this.props.is_nativepicker) {
            return (
                <div ref={node => { this.mainNode = node; }} className='datepicker'>
                    <input
                        id={this.props.name}
                        name={this.props.name}
                        className='datepicker__input'
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
                    <label className='datepicker__native-overlay' htmlFor={this.props.name}>
                        {this.state.value || this.props.placeholder}
                        <IconArrow className='datepicker__native-overlay__arrowhead' />
                    </label>
                </div>
            );
        }

        return (
            <div
                id={this.props.id}
                ref={node => { this.mainNode = node; }}
                className='datepicker'
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                { this.renderInputField() }
                {
                    this.props.mode !== 'duration' &&
                    <React.Fragment>
                        <IconCalendar
                            className={classNames('datepicker__icon datepicker__icon--calendar', {
                                'datepicker__icon--is-hidden': this.state.is_clear_btn_visible,
                            })}
                            onClick={this.handleVisibility}
                        />
                        <IconClear
                            className={classNames('datepicker__icon datepicker__icon--clear', {
                                'datepicker__icon--is-hidden': !this.state.is_clear_btn_visible,
                            })}
                            onClick={this.state.is_clear_btn_visible ? this.clearDatePickerInput : undefined}
                        />
                    </React.Fragment>
                }
                <div
                    className={classNames('datepicker__picker', {
                        'datepicker__picker--show'                           : this.state.is_datepicker_visible,
                        [`datepicker__picker--align-${this.props.alignment}`]: this.props.alignment,
                    })}
                >
                    <Calendar
                        ref={node => { this.calendar = node; }}
                        onSelect={this.onSelectCalendar}
                        {...this.props}
                    />
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
    ...Calendar.propTypes,
};

export default observer(DatePicker);
