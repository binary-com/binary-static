import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from '_common/localize';
import {
    Icon,
    IconBack,
    IconCountryFlag }  from 'Assets/Common';
import {
    getAllowedLanguages,
    getURL }           from 'Utils/Language';

const LanguageDialog = ({ hide, is_visible, is_settings_on }) => {
    const language_dialog_class = classNames('settings-dialog__language-dialog-container', {
        'settings-dialog__language-dialog-container--show': is_visible && is_settings_on,
    });

    return (
        <div className={language_dialog_class}>
            <div className='settings-dialog__language-header' onClick={hide}>
                <Icon icon={IconBack} className='settings-dialog__arrow-back' />
                <span>{localize('language')}</span>
            </div>
            <div className='settings-dialog__language-container'>
                {Object.keys(getAllowedLanguages()).map(key => (
                    <React.Fragment key={key}>
                        <div className='settings-dialog__language-row'>
                            <a className='settings-dialog__language-link' href={getURL(key)} >
                                <Icon
                                    icon={IconCountryFlag}
                                    className={'settings-dialog__language-row-flag settings-dialog__language-flag'}
                                    type={key.replace(/(\s|_)/, '-').toLowerCase()}
                                />
                                <span className='settings-dialog__language-name'>{getAllowedLanguages()[key]}</span>
                            </a>
                        </div>
                    </React.Fragment>
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
