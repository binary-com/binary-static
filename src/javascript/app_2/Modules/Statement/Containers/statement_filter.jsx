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
    is_mobile,
    today,
}) => (
    <div className={classNames('statement-filter', { 'mobile-only': is_mobile, 'desktop-only': !is_mobile })}>
        <div className='statement-filter__content container'>
            <span className='statement-filter__label'>{localize('Filter by date:')}</span>
            <DatePicker
                name='date_from'
                placeholder={localize('Start date')}
                start_date={date_to || today}
                max_date={date_to || today}
                onChange={handleDateChange}
                value={date_from}
                is_nativepicker={is_mobile}
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
    ({ common, modules, ui }) => ({
        today           : moment(common.server_time).format('YYYY-MM-DD'),
        date_from       : modules.statement.date_from,
        date_to         : modules.statement.date_to,
        handleDateChange: modules.statement.handleDateChange,
        is_mobile       : ui.is_mobile,
    })
)(Filter);
