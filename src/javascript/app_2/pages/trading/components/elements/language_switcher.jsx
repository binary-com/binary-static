import React from 'react';
import { localize } from '../../../../../_common/localize';

class LanguageSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_collapsed   : false,
            active_language: this.props.languages[0],
        };
    }

    toggleLanguageList = () => {
        this.setState({
            is_collapsed: !this.state.is_collapsed,
        });
    }

    switchLanguage = (lang) => {
        this.setState({
            active_language: lang,
        });
    }

    render() {
        const language_list_collapsed = {
            // visibility needed in style props as workaround for briefly flashing hidden elements in css
            visibility: `${this.state.is_collapsed ? 'visible' : 'hidden'}`,
        };

        const language_is_active = (lang) => {
            const is_active = lang.id === this.state.active_language.id;
            return is_active;
        };

        return (
            <React.Fragment>
                <div className='drawer-item' onClick={this.toggleLanguageList}>
                    <span className={`parent-item ${this.state.active_language.id||''}`}>
                        {localize('Language')} : {this.state.active_language.name}
                    </span>
                </div>
                <div
                    className={`lang-switcher-list ${this.state.is_collapsed ? 'show' : ''}`}
                    style={language_list_collapsed}
                >
                    <div className='lang-switcher-list-header' onClick={this.toggleLanguageList}>
                        <span className='lang-switcher-list-desc'>
                            {localize('Choose your language')}
                        </span>
                    </div>
                    {this.props.languages.map((language, idx) => (
                        <React.Fragment key={idx}>
                            <div
                                className={`lang-switcher-language ${language_is_active(language) ? 'active' : ''}`}
                                onClick={this.switchLanguage.bind(null, language)}
                            >
                                <p className='lang-switcher-name'>{language.name}</p>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

LanguageSwitcher.defaultProps = {
    languages: [
      { id: 'EN',  name: 'English' },
      { id: 'DE',  name: 'Deustch' },
      { id: 'ESP', name: 'Espanol' },
      { id: 'FR',  name: 'French' },
      { id: 'INA', name: 'Indonesian' },
      { id: 'ITA', name: 'Italian' },
      { id: 'JA',  name: 'Japanese' },
      { id: 'PL',  name: 'Polish' },
      { id: 'PT',  name: 'Portugese' },
      { id: 'RU',  name: 'Russian' },
      { id: 'TH',  name: 'Thai' },
      { id: 'VIE', name: 'Vietnamese' },
      { id: 'CN1', name: 'Chinese Simplified' },
      { id: 'CN2', name: 'Chinese Traditional' },
    ],
};

export default LanguageSwitcher;
