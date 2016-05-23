/*
 * Handles start time display
 *
 * It process `Contract.startDates` in case of forward
 * starting contracts and populate the start time select
 * box
 */

var StartDates = (function(){
    'use strict';

    var hasNow = 0;
    var displayed = 0;

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

        var startDates = Contract.startDates();

        if (startDates && startDates.list.length) {

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
            displayed = 1;
            if(first){
                TradingEvents.onStartDateChange(first);            
            }
        } else {
            displayed = 0;
            document.getElementById('date_start_row').style.display = 'none';
            Defaults.remove('date_start');
        }
    };

    var setNow = function(){
        if(hasNow){
            var element = getElement();
            element.value = 'now';
            $('#date_start').removeClass('light-yellow-background');
            Defaults.set('date_start', 'now');
        }
    } ;

    return {
        display: displayStartDates,
        node: getElement,
        setNow: setNow,
        displayed: function(){ return displayed; }
    };

})();
