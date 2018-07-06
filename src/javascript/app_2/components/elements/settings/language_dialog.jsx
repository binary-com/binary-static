import classNames                  from 'classnames';
import React                       from 'react';
import PropTypes                   from 'prop-types';
import { localize }                from '../../../../_common/localize';
import { connect }                 from '../../../store/connect';
import { getAll as getLanguages,
         urlFor as getLanguageURL } from '../../../../_common/language';

class LanguageDialog extends React.Component {
    render() {
        const language_dialog_class = classNames('language-dialog-container', {
            'show': this.props.is_visible,
        });
        // TO-DO - Simplify and refactor, get supported languages from config
        const supported_languages = ['EN', 'PT', 'DE', 'RU', 'FR','TH', 'ID', 'VI','IT', 'ZH_CN', 'ES', 'ZH_TW', 'PL'];
        const language_list = Object.keys(getLanguages())
          .filter(key => supported_languages.includes(key))
          .reduce((obj, key) => {
              obj[key] = getLanguages()[key];
              return obj;
          }, {});
        return (
            <div className={language_dialog_class}>
                <a className='language-header' href='javascript:;' onClick={this.props.hide}>
                    <svg className='arrow-back' xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
                        <path fill='#333' fillRule='nonzero' d='M3.6 8.5L7 12.2a.5.5 0 1 1-.8.6l-4-4.5a.5.5 0 0 1 0-.6l4-4.5a.5.5 0 0 1 .8.6L3.6 7.5h9.9a.5.5 0 1 1 0 1H3.6z'/>
                    </svg>
                    <span>{localize('language')}</span>
                </a>
                <div className='language-container'>
                    {Object.keys(language_list).map(key => (
                        <React.Fragment key={key}>
                            <div className='language-row'>
                                <a href={getLanguageURL(key)} >
                                    <i className={`flag ic-flag-${key.replace(/(\s|_)/, '-').toLowerCase()}`} />
                                    <span>{language_list[key]}</span>
                                </a>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }
};

LanguageDialog.propTypes = {
    is_visible: PropTypes.bool,
    hide      : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        is_visible: ui.is_language_dialog_on,
        hide      : ui.hideLanguageDialog,
    })
)(LanguageDialog);
