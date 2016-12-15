var $languages,
    languageCode,
    languageText;

function create_language_drop_down(languages) {
    $languages = $('.languages');
    var selectLanguage = 'ul#select_language',
        $selectLanguage = $languages.find(selectLanguage);
    if ($languages.length === 0 || $selectLanguage.find('li span.language').text() !== '') return;
    languages.sort(function(a, b) {
        if (a === 'EN' || a < b) {
            return -1;
        } else {
            return 1;
        }
    });
    var displayLanguage = 'ul#display_language',
        language = page.language();
    languageCode = language && language !== '' ? language : 'en';
    languageText = language && language !== '' ? map_code_to_language(language) : 'English';
    add_display_language(displayLanguage);
    add_display_language(selectLanguage);
    for (var i = 0; i < languages.length; i++) {
        if (languages[i] !== 'JA') {
            $selectLanguage.append('<li class="' + languages[i] + '">' + map_code_to_language(languages[i]) + '</li>');
        }
    }
    $selectLanguage.find('li.' + language + ':eq(1)').addClass('invisible');
    page.on_change_language();
    $('.languages').removeClass('invisible');
}

function add_display_language(id) {
    $languages.find(id + ' li')
              .addClass(languageCode)
              .find('span.language')
              .text(languageText);
}

function map_code_to_language(code) {
    var map = page.all_languages();
    return map[code];
}

module.exports = {
    create_language_drop_down: create_language_drop_down,
};
