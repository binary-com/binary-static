var japanese_client = require('../country_base').japanese_client;

function generateBirthDate() {
    var days    = document.getElementById('dobdd'),
        months  = document.getElementById('dobmm'),
        year    = document.getElementById('dobyy');

    if (document.getElementById('dobdd').length > 1) return;

    // days
    dropDownNumbers(days, 1, 31);
    // months
    dropDownMonths(months, 1, 12);
    var currentYear = new Date().getFullYear();
    var startYear = currentYear - 100;
    var endYear = currentYear - 17;
    // years
    dropDownNumbers(year, startYear, endYear);
    if (japanese_client()) {
        days.options[0].innerHTML = page.text.localize('Day');
        months.options[0].innerHTML = page.text.localize('Month');
        year.options[0].innerHTML = page.text.localize('Year');
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
    var months = [
        page.text.localize('Jan'),
        page.text.localize('Feb'),
        page.text.localize('Mar'),
        page.text.localize('Apr'),
        page.text.localize('May'),
        page.text.localize('Jun'),
        page.text.localize('Jul'),
        page.text.localize('Aug'),
        page.text.localize('Sep'),
        page.text.localize('Oct'),
        page.text.localize('Nov'),
        page.text.localize('Dec'),
    ];
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
