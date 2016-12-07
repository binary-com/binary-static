var appendTextValueChild = require('../common_functions').appendTextValueChild;

function create_language_drop_down(languages) {
    var language_select_element = document.getElementById('language_select');
    if (!language_select_element || language_select_element.children.length !== 0) return;
    languages.sort(function(a, b) {
        if (a === 'EN' || a < b) {
            return -1;
        }

        return 1;
    });
    for (var i = 0; i < languages.length; i++) {
        if (languages[i] !== 'JA') {
            appendTextValueChild(language_select_element, map_code_to_language(languages[i]), '', '', languages[i]);
        }
    }
    $('#language_select .' + page.language()).attr('selected', 'selected');
    $('#language_select').removeClass('invisible');
}

function map_code_to_language(code) {
    var map = page.all_languages();
    return map[code];
}

module.exports = {
    create_language_drop_down: create_language_drop_down,
};
