import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import Localize            from 'App/Components/Elements/localize.jsx';
import { IconCountryFlag } from 'Assets/Common';
import {
    getAllowedLanguages,
    getURL,
    currentLanguage,
}                          from 'Utils/Language';

const LanguageDialog = ({ hide, is_visible, is_settings_on }) => {
    const language_dialog_class = classNames('settings-dialog__language-dialog-container', {
        'settings-dialog__language-dialog-container--show': is_visible && is_settings_on,
    });

    return (
        <div className={language_dialog_class}>
            <div className='settings-dialog__language-header' onClick={hide}>
                <span>
                    <Localize str='Select language' />
                </span>
            </div>
            <div className='settings-dialog__language-container'>
                {Object.keys(getAllowedLanguages())
                    .map(key => (
                        <a
                            key={key}
                            className={classNames('settings-dialog__language-link', {
                                'settings-dialog__language-link--active': key === currentLanguage,
                            })}
                            href={getURL(key)}
                        >
                            <IconCountryFlag
                                className={'settings-dialog__language-link-flag settings-dialog__language-flag'}
                                type={key.replace(/(\s|_)/, '-').toLowerCase()}
                            />
                            <span
                                className={classNames('settings-dialog__language-name', {
                                    'settings-dialog__language-name--active': key === currentLanguage,
                                })}
                            >
                                {getAllowedLanguages()[key]}
                            </span>
                        </a>
                    ))}
            </div>
        </div>
    );
};

LanguageDialog.propTypes = {
    hide          : PropTypes.func,
    is_settings_on: PropTypes.bool,
    is_visible    : PropTypes.bool,
};

export default LanguageDialog;
