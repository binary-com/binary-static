var Contract_Beta      = require('./contract').Contract_Beta;
var Durations_Beta     = require('./duration').Durations;
var Defaults = require('../defaults').Defaults;
var moment = require('../../../../lib/moment/moment');
var Content = require('../../../common_functions/content').Content;
var State = require('../../../base/storage').State;

/*
 * Handles start time display
 *
 * It process `Contract.startDates` in case of forward
 * starting contracts and populate the start time select
 * box
 */

var StartDates_Beta = (function(){
    'use strict';

    var hasNow = 0;
    State.remove('is_start_dates_displayed');

    var compareStartDate = function(a,b) {
        if (a.date < b.date)
            return -1;
        if (a.date > b.date)
            return 1;
        return 0;
    };

    var getElement = function(){
        return document.getElementById('date_start');
    };

    var displayStartDates = function() {

        var startDates = Contract_Beta.startDates();

        if (startDates && startDates.list && startDates.list.length) {

            var target= getElement(),
                fragment =  document.createDocumentFragment(),
                row = document.getElementById('date_start_row');

            row.style.display = 'flex';

            while (target && target.firstChild) {
                target.removeChild(target.firstChild);
            }

            if(startDates.has_spot){
                var option = document.createElement('option');
                var content = document.createTextNode(Content.localize().textNow);
                option.setAttribute('value', 'now');
                $('#date_start').removeClass('light-yellow-background');
                option.appendChild(content);
                fragment.appendChild(option);
                hasNow = 1;
            }
            else{
                hasNow = 0;
            }

            startDates.list.sort(compareStartDate);

            var first;
            startDates.list.forEach(function (start_date) {
                var a = moment.unix(start_date.open).utc();
                var b = moment.unix(start_date.close).utc();

                var ROUNDING = 5 * 60 * 1000;
                var start = moment.utc();

                if(moment(start).isAfter(moment(a))){
                    a = start;
                }

                a = moment(Math.ceil((+a) / ROUNDING) * ROUNDING).utc();

                while(a.isBefore(b)) {
                    if(a.unix()-start.unix()>5*60){
                        option = document.createElement('option');
                        option.setAttribute('value', a.utc().unix());
                        if(typeof first === 'undefined' && !hasNow){
                            first = a.utc().unix();
                        }
                        content = document.createTextNode(a.format('HH:mm ddd').replace(' ', ' GMT, '));
                        if(option.value === Defaults.get('date_start')) {
                            option.setAttribute('selected', 'selected');
                        }
                        option.appendChild(content);
                        fragment.appendChild(option);
                    } 
                    a.add(5, 'minutes');
                }
            });
            target.appendChild(fragment);
            Defaults.set('date_start', target.value);
            State.set('is_start_dates_displayed', true);
            if(first){
                Durations_Beta.onStartDateChange(first);
            }
        } else {
            State.remove('is_start_dates_displayed');
            document.getElementById('date_start_row').style.display = 'none';
            Defaults.remove('date_start');
        }
    };

    return {
        display: displayStartDates,
        node   : getElement,
        disable: function() { getElement().setAttribute('disabled', 'disabled'); },
        enable : function() { getElement().removeAttribute('disabled'); },
    };
})();

module.exports = {
    StartDates_Beta: StartDates_Beta,
};
