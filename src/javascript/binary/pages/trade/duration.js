/*
 * Handles duration processing display
 *
 * It process `Contract.durations()` and display them according to
 * the current `Contract.form()` and `Contract.barriers()`
 *
 * It also populate expiry type select box i.e Durations and Endtime select
 *
 */
function displayDurations(startType) {
    'use strict';

    var durations = Contract.durations();
    if (durations === false) {
        document.getElementById('expiry_row').style.display = 'none';
        return false;
    }

    var target = document.getElementById('duration_units'),
        formName = Contract.form(),
        barrierCategory = Contract.barrier(),
        fragment = document.createDocumentFragment(), durationContainer = {};

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var key in durations) {
        if (durations.hasOwnProperty(key)) {
            for (var form in durations[key][formName]) {
                if (durations[key][formName].hasOwnProperty(form)) {
                    var obj = {};
                    if (barrierCategory) {
                        obj = durations[key][formName][barrierCategory];
                    } else {
                        obj = durations[key][formName][form];
                    }
                    for (var type in obj) {
                        if (obj.hasOwnProperty(type)) {
                            if (startType) {
                                if (startType === type) {
                                    if(!durationContainer.hasOwnProperty(startType)) {
                                        durationContainer[key] = obj[startType];
                                    }
                                }
                            } else {
                                if(!durationContainer.hasOwnProperty(type)) {
                                    durationContainer[key] = obj[type];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var duration_list = {};
    for (var duration in durationContainer) {
        if(durationContainer.hasOwnProperty(duration)) {
            var min = durationContainer[duration]['min_contract_duration'],
                textMapping = durationTextValueMappings(min);

            var option, content;
            if (duration === 'intraday') {
                switch (textMapping['value']) {
                    case 's':
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.appendChild(content);
                        duration_list[textMapping['value']]=option;
                        option = document.createElement('option');
                        content = document.createTextNode(Content.localize().textDurationMinutes);
                        option.setAttribute('value', 'm');
                        option.setAttribute('data-minimum', 1);
                        option.setAttribute('selected', 'selected');
                        option.appendChild(content);
                        duration_list['m']=option;
                        option = document.createElement('option');
                        content = document.createTextNode(Content.localize().textDurationHours);
                        option.setAttribute('value', 'h');
                        option.setAttribute('data-minimum', 1);
                        option.appendChild(content);
                        duration_list['h']=option;
                        break;
                    case 'm':
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.setAttribute('selected', 'selected');
                        option.appendChild(content);
                        duration_list[textMapping['value']]=option;
                        option = document.createElement('option');
                        content = document.createTextNode(Content.localize().textDurationHours);
                        option.setAttribute('value', 'h');
                        option.setAttribute('data-minimum', 1);
                        option.appendChild(content);
                        duration_list['h']=option;
                        break;
                    case 'h':
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.appendChild(content);
                        duration_list[textMapping['value']]=option;
                        break;
                    default :
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.appendChild(content);
                        duration_list[textMapping['value']]=option;
                        break;
                }
            } else if (duration === 'daily') {
                option = document.createElement('option');
                content = document.createTextNode(textMapping['text']);
                option.setAttribute('value', textMapping['value']);
                option.setAttribute('data-minimum', textMapping['min']);
                option.appendChild(content);
                duration_list[textMapping['value']]=option;
            } else if (duration === 'tick') {
                option = document.createElement('option');
                content = document.createTextNode(textMapping['text']);
                option.setAttribute('value', textMapping['value']);
                option.setAttribute('data-minimum', textMapping['min']);
                option.appendChild(content);
                duration_list[textMapping['value']]=option;
            }
            
        }
    }
    var list = Object.keys(duration_list).sort(function(a,b){
        if(durationOrder(a)>durationOrder(b)){
            return 1;
        }
        else{
            return -1;
        }
    });
    for(var k=0; k<list.length; k++){
        var d = list[k];
        if(duration_list.hasOwnProperty(d)){
            target.appendChild(duration_list[d]);
        }
    }

    durationPopulate();
}

function durationTextValueMappings(str) {
    'use strict';
    var mapping = {
        s : Content.localize().textDurationSeconds,
        m : Content.localize().textDurationMinutes,
        h : Content.localize().textDurationHours,
        d : Content.localize().textDurationDays,
        t : Content.localize().textDurationTicks
    };

    var arry = str ? str.toString().match(/[a-zA-Z]+|[0-9]+/g) : [],
        obj = {};

    if (arry.length > 1) {
        obj['value'] = arry[1];
        obj['text'] = mapping[arry[1]];
        obj['min'] = arry[0];
    } else {
        obj['value'] = 't';
        obj['text'] = mapping['t'];
        obj['min'] = arry[0];
    }

    return obj;
}

function durationPopulate() {
    'use strict';

    var unit = document.getElementById('duration_units');
    if (isVisible(unit)) {
        var unitValue = unit.options[unit.selectedIndex].getAttribute('data-minimum');
        document.getElementById('duration_amount').value = unitValue;
        document.getElementById('duration_minimum').textContent = unitValue;
        displayExpiryType(unit.value);
    } else {
        displayExpiryType();
    }

    // we need to call it here as for days we need to show absolute barriers
    Barriers.display();
}

function displayExpiryType(unit) {
    'use strict';

    var target = document.getElementById('expiry_type'),
        fragment = document.createDocumentFragment();

    var current_selected = target.value || 'duration',
        id = current_selected,
        hideId = (current_selected === 'duration') ? 'endtime' : 'duration';

    id = document.getElementById('expiry_type_' + id);
    if (id) {
        id.style.display = 'flex';
    }
    // need to hide the non selected one
    hideId = document.getElementById('expiry_type_' + hideId);
    if (hideId) {
        hideId.style.display = 'none';
    }

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    var option = document.createElement('option'),
        content = document.createTextNode(Content.localize().textDuration);

    option.setAttribute('value', 'duration');
    if (current_selected === 'duration') {
        option.setAttribute('selected', 'selected');
    }
    option.appendChild(content);
    fragment.appendChild(option);

    if (unit !== 't') {
        option = document.createElement('option');
        content = document.createTextNode(Content.localize().textEndTime);
        option.setAttribute('value', 'endtime');
        if (current_selected === 'endtime') {
            option.setAttribute('selected', 'selected');
        }
        option.appendChild(content);
        fragment.appendChild(option);
    }
    target.appendChild(fragment);
}
