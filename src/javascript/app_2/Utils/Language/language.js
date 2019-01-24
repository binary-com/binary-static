import { get, getAll, urlFor } from '_common/language';

export const currentLanguage = get();

export const getAllowedLanguages = () => {
    // TODO Remove all language frome exclude_languages except for ACH when design is ready.
    const exclude_languages = [
        'ACH',
        'DE',
        'ES',
        'FR',
        'ID',
        'IT',
        'PL',
        'PT',
        'RU',
        'TH',
        'VI',
        'ZH_CN',
        'ZH_TW',
    ];
    const language_list = Object.keys(getAll())
        .filter(key => !(exclude_languages.includes(key)))
        .reduce((obj, key) => {
            obj[key] = getAll()[key];
            return obj;
        }, {});

    return language_list;
};

export const getURL = lang => urlFor(lang);
