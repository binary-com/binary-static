const japanese_client = require('../country_base').japanese_client;
const localize        = require('../../base/localize').localize;
const elementInnerHtml = require('../../common_functions/common_functions').elementInnerHtml;


function generateBirthDate() {
    const days   = document.getElementById('dobdd'),
        months = document.getElementById('dobmm'),
        year   = document.getElementById('dobyy');

    if (!days || document.getElementById('dobdd').length > 1) return;

    // days
    dropDownNumbers(days, 1, 31);
    // months
    dropDownMonths(months, 1, 12);
    // years
    const currentYear = new Date().getFullYear(),
        startYear = currentYear - 100,
        endYear   = currentYear - 17;
    dropDownNumbers(year, startYear, endYear);

    if (japanese_client()) {
        elementInnerHtml(days.options[0], localize('Day'));
        elementInnerHtml(months.options[0], localize('Month'));
        elementInnerHtml(year.options[0], localize('Year'));
    }
}

// append numbers to a drop down menu, eg 1-30
function dropDownNumbers(select, startNum, endNum) {
    select.appendChild(document.createElement('option'));

    for (let i = startNum; i <= endNum; i++) {
        const option = document.createElement('option');
        option.text = i;
        option.value = i;
        select.appendChild(option);
    }
}

function dropDownMonths(select, startNum, endNum) {
    const months = localize(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    select.appendChild(document.createElement('option'));
    for (let i = startNum; i <= endNum; i++) {
        const option = document.createElement('option');
        if (i <= '9') {
            option.value = '0' + i;
        } else {
            option.value = i;
        }
        for (let j = i; j <= i; j++) {
            option.text = months[j - 1];
        }
        select.appendChild(option);
    }
}

module.exports = {
    generateBirthDate: generateBirthDate,
};
