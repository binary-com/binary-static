var japanese_client = require('../country_base').japanese_client;
var localize = require('../../base/localize').localize;

function generateBirthDate() {
    var days   = document.getElementById('dobdd'),
        months = document.getElementById('dobmm'),
        year   = document.getElementById('dobyy');

    if (!days || document.getElementById('dobdd').length > 1) return;

    // days
    dropDownNumbers(days, 1, 31);
    // months
    dropDownMonths(months, 1, 12);
    // years
    var currentYear = new Date().getFullYear(),
        startYear = currentYear - 100,
        endYear   = currentYear - 17;
    dropDownNumbers(year, startYear, endYear);

    if (japanese_client()) {
        days.options[0].innerHTML   = localize('Day');
        months.options[0].innerHTML = localize('Month');
        year.options[0].innerHTML   = localize('Year');
    }
}

// append numbers to a drop down menu, eg 1-30
function dropDownNumbers(select, startNum, endNum) {
    select.appendChild(document.createElement('option'));

    for (var i = startNum; i <= endNum; i++) {
        var option = document.createElement('option');
        option.text = i;
        option.value = i;
        select.appendChild(option);
    }
}

function dropDownMonths(select, startNum, endNum) {
    var months = localize(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    select.appendChild(document.createElement('option'));
    for (var i = startNum; i <= endNum; i++) {
        var option = document.createElement('option');
        if (i <= '9') {
            option.value = '0' + i;
        } else {
            option.value = i;
        }
        for (var j = i; j <= i; j++) {
            option.text = months[j - 1];
        }
        select.appendChild(option);
    }
}

module.exports = {
    generateBirthDate: generateBirthDate,
};
