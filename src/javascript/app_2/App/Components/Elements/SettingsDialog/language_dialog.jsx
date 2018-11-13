import classNames              from 'classnames';
import PropTypes               from 'prop-types';
import React                   from 'react';
import { Redirect }            from 'react-router-dom';
import { localize }            from '_common/localize';
import { IconBack }            from 'Assets/Common';
import { getAllowedLanguages } from 'Utils/Language';
import { connect }             from '../../../../Stores/connect';

class LanguageDialog extends React.Component {
    state = {
        redirect_url: false,
    };

    switchLanguageTo = ({ key, setLanguage }) => {
        // fetch language file
        const languageTexts = document.createElement('script');
        languageTexts.async = true;
        languageTexts.src   = `/js/app_2/texts/${  key.toLowerCase()  }.js`;
        document.body.appendChild(languageTexts);
        setLanguage(key);
        this.setState({
            redirect_url: `/${  key.toLowerCase()  }/app/statement`,
        });
    };

    render() {
        const language_dialog_class = classNames('language-dialog-container', {
            'show': this.props.is_visible && this.props.is_settings_on,
        });

        if (this.state.redirect_url) {
            console.log(this.state.redirect_url);//eslint-disable-line
            return (
                <Redirect to={this.state.redirect_url} />
            );
        }

        return (
            <div className={language_dialog_class}>
                <div className='language-header' onClick={this.props.hide}>
                    <IconBack className='arrow-back' />
                    <span>{localize('language')}</span>
                </div>
                <div className='language-container'>
                    {Object.keys(getAllowedLanguages()).map(key => (
                        <React.Fragment key={key}>
                            <div className='language-row'>
                                <button onClick={this.switchLanguageTo.bind(this, {
                                    key,
                                    setLanguage: this.props.setLanguage,
                                })}
                                >
                                    <i className={`flag ic-flag-${key.replace(/(\s|_)/, '-').toLowerCase()}`} />
                                    <span>{getAllowedLanguages()[key]}</span>
                                </button>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }

}

LanguageDialog.propTypes = {
    hide          : PropTypes.func,
    is_settings_on: PropTypes.bool,
    is_visible    : PropTypes.bool,
};

const language_dialog = connect(({ common }) => ({ setLanguage: common.setLanguage }))(LanguageDialog);
export default language_dialog;
