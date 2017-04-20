import moment from 'moment';
import { dateValueChanged } from '../common_functions';
import { toISOFormat } from '../string_util';
import DatePicker from '../../components/date_picker';

const generateBirthDate = () => {
    const date_of_birth = '#date_of_birth';
    DatePicker.init({
        selector : date_of_birth,
        minDate  : -100 * 365,
        maxDate  : -18 * 365 - 5,
        yearRange: '-100:-18',
    });
    $(date_of_birth)
        .attr('data-value', toISOFormat(moment()))
        .change(function() {
            return dateValueChanged(this, 'date');
        })
        .val('');
};

module.exports = generateBirthDate;
