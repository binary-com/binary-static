import classNames   from 'classnames';
import moment       from 'moment';
import PropTypes    from 'prop-types';
import React        from 'react';
import DatePicker   from '../../../App/Components/Form/date_picker.jsx';
import { connect }  from '../../../Stores/connect';
import { localize } from '../../../../_common/localize';

const Filter = ({
    date_from,
    date_to,
    handleDateChange,
    today,
    should_center,
    use_native_pickers,
}) => (
    <div className={classNames('statement-filter', { 'statement-filter--center': should_center })}>
        <div className='statement-filter__content'>
            <span className='statement-filter__label'>{localize('Filter by date:')}</span>
            <DatePicker
                name='date_from'
                initial_value={date_from}
                placeholder={localize('Start date')}
                startDate={date_to || today}
                maxDate={date_to || today}
                onChange={handleDateChange}
                is_nativepicker={use_native_pickers}
            />
            <span className='statement-filter__dash'>&mdash;</span>
            <DatePicker
                name='date_to'
                initial_value={date_to}
                placeholder={localize('End date')}
                startDate={today}
                minDate={date_from}
                maxDate={today}
                showTodayBtn
                onChange={handleDateChange}
                is_nativepicker={use_native_pickers}
            />
        </div>
    </div>
);

Filter.propTypes = {
    date_from         : PropTypes.string,
    date_to           : PropTypes.string,
    server_time       : PropTypes.object,
    handleDateChange  : PropTypes.func,
    should_center     : PropTypes.bool,
    use_native_pickers: PropTypes.bool,
    today             : PropTypes.string,
};

export default connect(
    ({ common, modules, ui }) => ({
        today           : moment(common.server_time).format('YYYY-MM-DD'),
        date_from       : modules.statement.date_from,
        date_to         : modules.statement.date_to,
        handleDateChange: modules.statement.handleDateChange,
    })
)(Filter);
