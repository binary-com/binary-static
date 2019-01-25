import { get, getAll, urlFor } from '_common/language';

export const currentLanguage = get();

export const getAllowedLanguages = () => {
    const exclude_languages = [
        'ACH',
    ];

    // const language_list = Object.keys(getAll())
    //     .filter(key => !(exclude_languages.includes(key)))
    //     .reduce((obj, key) => {
    //         obj[key] = getAll()[key];
    //         return obj;
    //     }, {});

    // TODO uncomment language_list and replace ['en'] when design is ready.
    return ['en'];
};

export const getURL = lang => urlFor(lang);
