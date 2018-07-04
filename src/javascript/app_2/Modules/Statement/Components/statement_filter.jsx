import classnames from 'classnames';
import moment     from 'moment';
import PropTypes  from 'prop-types';
import React      from 'react';
import DatePicker from '../../../components/form/date_picker.jsx';
import {localize} from '../../../../_common/localize';
import {connect}  from '../../../Stores/connect';

const Filter = ({
    date_from,
    date_to,
    handleDateChange,
    is_mobile,
    today,
    className,
}) => (
    <div className={classnames('statement-filter', className)}>
        <div className='statement-filter__content container'>
            <span className='statement-filter__label'>{localize('Filter by date:')}</span>
            <DatePicker
                name='date_from'
                initial_value=''
                placeholder={localize('Start date')}
                startDate={date_to || today}
                maxDate={date_to || today}
                onChange={handleDateChange}
                is_nativepicker={is_mobile}
            />
            <span className='statement-filter__dash'>&mdash;</span>
            <DatePicker
                name='date_to'
                initial_value=''
                placeholder={localize('End date')}
                startDate={today}
                minDate={date_from}
                maxDate={today}
                showTodayBtn
                onChange={handleDateChange}
                is_nativepicker={is_mobile}
            />
        </div>
    </div>
);

export default connect(
    ({ modules, common }, {is_mobile}) => ({
        is_mobile       : is_mobile,
        date_from       : modules.statement.date_from,
        date_to         : modules.statement.date_to,
        handleDateChange: modules.statement.handleDateChange,
        today           : moment(common.server_time).format('YYYY-MM-DD'),
        className       : classnames({ 'mobile-only' : is_mobile, 'desktop-only': !is_mobile }),
    })
)(Filter);
