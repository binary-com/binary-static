import { get,
         getAll,
         urlFor } from '../../../_common/language';

export const currentLanguage = get();

export const getAllowedLanguages = () => {
    const exclude_languages = ['JA', 'ACH'];
    const language_list = Object.keys(getAll())
      .filter(key => !(exclude_languages.includes(key)))
      .reduce((obj, key) => {
          obj[key] = getAll()[key];
          return obj;
      }, {});

    return language_list;
};

export const getURL = lang => urlFor(lang);
