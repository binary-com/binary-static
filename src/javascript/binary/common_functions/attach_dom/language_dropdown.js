const Language = require('../../base/language');

let $languages,
    languageCode,
    languageText;

function createLanguageDropDown() {
    BinarySocket.wait('website_status').then((response) => {
        const languages = response.website_status.supported_languages;
        $languages = $('.languages');
        const selectLanguage = 'ul#select_language',
            $selectLanguage = $languages.find(selectLanguage);
        if ($languages.length === 0 || $selectLanguage.find('li span.language').text() !== '') return;
        languages.sort(function(a, b) {
            return (a === 'EN' || a < b) ? -1 : 1;
        });
        const displayLanguage = 'ul#display_language';
        languageCode = Language.get();
        languageText = map_code_to_language(languageCode);
        add_display_language(displayLanguage);
        add_display_language(selectLanguage);
        for (let i = 0; i < languages.length; i++) {
            $selectLanguage.append('<li class="' + languages[i] + '">' + map_code_to_language(languages[i]) + '</li>');
        }
        $selectLanguage.find('li.' + languageCode + ':eq(1)').addClass('invisible');
        Language.onChange();
        $languages.removeClass('invisible');
    });
}

function add_display_language(id) {
    $languages.find(id + ' li')
              .addClass(languageCode)
              .find('span.language')
              .text(languageText);
}

function map_code_to_language(code) {
    const map = Language.getAll();
    return map[code];
}

module.exports = createLanguageDropDown;
