import classNames      from 'classnames';
import React           from 'react';
import PropTypes       from 'prop-types';
import Arrowback       from '../../../Components/Elements/arrowback.jsx';
import { localize }    from '../../../../../_common/localize';
import {
    getAllowedLanguages,
    getURL,
}                      from '../../../../Utils/Language/index';

const LanguageDialog = ({ hide, is_visible, is_settings_on }) => {
    const language_dialog_class = classNames('language-dialog-container', {
        'show': is_visible && is_settings_on,
    });
    return (
        <div className={language_dialog_class}>
            <div className='language-header' onClick={hide}>
                <Arrowback className='arrow-back' />
                <span>{localize('language')}</span>
            </div>
            <div className='language-container'>
                {Object.keys(getAllowedLanguages()).map(key => (
                    <React.Fragment key={key}>
                        <div className='language-row'>
                            <a href={getURL(key)} >
                                <i className={`flag ic-flag-${key.replace(/(\s|_)/, '-').toLowerCase()}`} />
                                <span>{getAllowedLanguages()[key]}</span>
                            </a>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

LanguageDialog.propTypes = {
    is_settings_on: PropTypes.bool,
    is_visible    : PropTypes.bool,
    hide          : PropTypes.func,
};

export default LanguageDialog;
