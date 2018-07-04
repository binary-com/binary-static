import classnames   from 'classnames';
import moment       from 'moment';
import PropTypes    from 'prop-types';
import React        from 'react';
import DatePicker   from '../../../components/form/date_picker.jsx';
import { connect }  from '../../../Stores/connect';
import { localize } from '../../../../_common/localize';

const Filter = ({
    date_from,
    date_to,
    handleDateChange,
    is_mobile,
    today,
}) => (
    <div className={classnames('statement-filter', { 'mobile-only': is_mobile, 'desktop-only': !is_mobile })}>
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

Filter.propTypes = {
    date_from       : PropTypes.string,
    date_to         : PropTypes.string,
    server_time     : PropTypes.object,
    handleDateChange: PropTypes.func,
    is_mobile       : PropTypes.bool,
    today           : PropTypes.string,
};

export default connect(
    ({ modules, common }, {is_mobile}) => ({
        is_mobile,
        className       : classnames(),
        date_from       : modules.statement.date_from,
        date_to         : modules.statement.date_to,
        handleDateChange: modules.statement.handleDateChange,
        today           : moment(common.server_time).format('YYYY-MM-DD'),
    })
)(Filter);
