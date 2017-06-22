const moment           = require('moment');
const getStartDateNode = require('./common_independent').getStartDateNode;
const Contract         = require('./contract');
const Defaults         = require('./defaults');
const Durations        = require('./duration');
const localize         = require('../../base/localize').localize;
const State            = require('../../base/storage').State;

/*
 * Handles start time display
 *
 * It process `Contract.startDates` in case of forward
 * starting contracts and populate the start time select
 * box
 */

const StartDates = (() => {
    'use strict';

    let has_now = 0;
    State.remove('is_start_dates_displayed');

    const compareStartDate = (a, b) => (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));

    const displayStartDates = () => {
        const start_dates = Contract.startDates();

        if (start_dates && start_dates.list && start_dates.list.length) {
            const target = getStartDateNode();
            const fragment = document.createDocumentFragment();
            const row = document.getElementById('date_start_row');
            let option,
                content;

            row.style.display = 'flex';

            while (target && target.firstChild) {
                target.removeChild(target.firstChild);
            }

            if (start_dates.has_spot) {
                option = document.createElement('option');
                content = document.createTextNode(localize('Now'));
                option.setAttribute('value', 'now');
                option.appendChild(content);
                fragment.appendChild(option);
                has_now = 1;
            } else {
                has_now = 0;
            }

            start_dates.list.sort(compareStartDate);
            const default_start = Defaults.get('date_start') || 'now';

            $('#time_start_row').setVisibility(default_start !== 'now');

            let first,
                selected,
                day,
                $duplicated_option,
                duplicated_length;
            start_dates.list.forEach((start_date) => {
                let a = moment.unix(start_date.open).utc();
                const b = moment.unix(start_date.close).utc();

                const rounding = 5 * 60 * 1000;
                const start = moment.utc();

                if (b.isAfter(start)) {
                    if (moment(start).isAfter(moment(a))) {
                        a = start;
                    }

                    a = moment(Math.ceil((+a) / rounding) * rounding).utc();
                    day = a.format('ddd');
                    $duplicated_option = $(fragment).find(`option:contains(${day})`);
                    duplicated_length = $duplicated_option.length;
                    if (duplicated_length && !new RegExp(localize('Session')).test($duplicated_option.text())) {
                        $($duplicated_option[0]).text(`${$duplicated_option.text()} - ${localize('Session')} ${duplicated_length}`);
                    }

                    option = document.createElement('option');
                    option.setAttribute('value', a.utc().unix());
                    option.setAttribute('data-end', b.unix());
                    content = document.createTextNode(day + ($duplicated_option.length ? ` - ${localize('Session')} ${duplicated_length + 1}` : ''));
                    if (option.value >= default_start && !selected) {
                        selected = true;
                        option.setAttribute('selected', 'selected');
                    }
                    if (typeof first === 'undefined' && !has_now) {
                        first = a.utc().unix();
                    }
                    option.appendChild(content);
                    fragment.appendChild(option);
                }
            });
            target.appendChild(fragment);
            Defaults.set('date_start', target.value);
            State.set('is_start_dates_displayed', true);
            if (first) {
                Durations.onStartDateChange(first);
            }
        } else {
            State.remove('is_start_dates_displayed');
            document.getElementById('date_start_row').style.display = 'none';
            Defaults.remove('date_start');
        }
    };

    return {
        display: displayStartDates,
        disable: () => { getStartDateNode().setAttribute('disabled', 'disabled'); },
        enable : () => { getStartDateNode().removeAttribute('disabled'); },
    };
})();

module.exports = {
    StartDates: StartDates,
};
