import classNames   from 'classnames';
import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from '../../../../_common/localize';

// TO-DO - Simplify this into object / Get enabled languages object from config
const LanguageDialog = ({ hide, is_open }) => {
    const language_dialog_class = classNames('language-dialog-container', {
        'show': is_open,
    });
    return (
        <div className={language_dialog_class}>
            <a className='language-header' href='javascript:;' onClick={hide}><span>{localize('Language')}</span></a>
            <div className='language-container'>
                <div className='language-row'>
                    <i className='ic-flag-en' />
                    <span>English</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-pt' />
                    <span>Português</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-de' />
                    <span>Deutsch</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-ru' />
                    <span>Русский</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-fr' />
                    <span>Français</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-th' />
                    <span>Thai</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-id' />
                    <span>Indonesia</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-vi' />
                    <span>Tiếng Việt</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-it' />
                    <span>Italiano</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-zh' />
                    <span>简体中文</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-es' />
                    <span>Espana</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-tw' />
                    <span>繁體中文</span>
                </div>
                <div className='language-row'>
                    <i className='ic-flag-pl' />
                    <span>Polish</span>
                </div>
            </div>
        </div>
    );
};

LanguageDialog.propTypes = {
    onClick: PropTypes.func,
    is_open: PropTypes.bool,
    hide   : PropTypes.func,
};

export default LanguageDialog;
