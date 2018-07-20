import classNames   from 'classnames';
import moment       from 'moment';
import PropTypes    from 'prop-types';
import React        from 'react';
import DatePicker   from '../../../App/Components/Form/DatePicker';
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
                placeholder={localize('Start date')}
                start_date={date_to || today}
                max_date={date_to || today}
                onChange={handleDateChange}
                value={date_from}
                is_nativepicker={use_native_pickers}
            />
            <span className='statement-filter__dash'>&mdash;</span>
            <DatePicker
                name='date_to'
                placeholder={localize('End date')}
                start_date={today}
                min_date={date_from}
                max_date={today}
                has_today_btn
                onChange={handleDateChange}
                value={date_to}
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
    ({ common, modules }) => ({
        today           : moment(common.server_time).format('YYYY-MM-DD'),
        date_from       : modules.statement.date_from,
        date_to         : modules.statement.date_to,
        handleDateChange: modules.statement.handleDateChange,
    })
)(Filter);
