/*
 * Handles start time display
 *
 * It process `Contract.startDates` in case of forward
 * starting contracts and populate the start time select
 * box
 */

function compareStartDate(a,b) {
    'use strict';
    if (a.date < b.date)
        return -1;
    if (a.date > b.date)
        return 1;
    return 0;
}

function displayStartDates() {
    'use strict';

    var startDates = Contract.startDates();

    if (startDates) {
        var target= document.getElementById('date_start'),
            fragment =  document.createDocumentFragment(),
            option = document.createElement('option'),
            content = document.createTextNode(Content.localize().textNow);

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        option.setAttribute('value', 'now');
        option.appendChild(content);
        fragment.appendChild(option);

        startDates.sort(compareStartDate);

        startDates.forEach(function (start_date) {
            var a = moment.unix(start_date.open).utc();
            var b = moment.unix(start_date.close).utc();

            var ROUNDING = 5 * 60 * 1000;
            var start = moment();
            start = moment(Math.ceil((+start) / ROUNDING) * ROUNDING).utc();

            if (moment(a, 'YYYY MM DD').isSame(moment(start ,'YYYY MM DD'), 'day')) {
                a = start;
            }

            while(a.isBefore(b)) {
                option = document.createElement('option');
                option.setAttribute('value', a.utc().unix());
                content = document.createTextNode(a.format('HH:mm ddd'));
                option.appendChild(content);
                fragment.appendChild(option);
                a.add(5, 'minutes');
            }
        });
        target.appendChild(fragment);
    } else {
        document.getElementById('date_start_row').style.display = 'none';
    }
}
