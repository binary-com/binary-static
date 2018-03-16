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
    };

    switchLanguage = (lang) => {
        this.setState({
            active_language: lang,
        });
    };

    render() {
        const language_list_collapsed = {
            // visibility needed in style props as workaround for briefly flashing hidden elements in css
            display: this.state.is_collapsed ? 'inline-block' : 'none',
        };

        const isLanguageActive = (lang) => lang.id === this.state.active_language.id;

        return (
            <React.Fragment>
                <div className='drawer-item' onClick={this.toggleLanguageList}>
                    <span className={`parent-item ${this.state.active_language.id || ''}`}>
                        {localize('Language')} : {this.state.active_language.name}
                    </span>
                </div>
                <div
                    className='lang-switcher-list'
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
                                className={`lang-switcher-language ${isLanguageActive(language) ? 'active' : ''}`}
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

// TODO: Remove defaultProps
LanguageSwitcher.defaultProps = {
    languages: [
        { id: 'EN',    name: 'English' },
        { id: 'DE',    name: 'Deutsch' },
        { id: 'FR',    name: 'Français' },
        { id: 'ID',    name: 'Indonesia' },
        { id: 'IT',    name: 'Italiano' },
        { id: 'JA',    name: '日本語' },
        { id: 'PL',    name: 'Polish' },
        { id: 'PT',    name: 'Português' },
        { id: 'RU',    name: 'Русский' },
        { id: 'TH',    name: 'Thai' },
        { id: 'VI',    name: 'Tiếng Việt' },
        { id: 'ZH_CN', name: '简体中文' },
        { id: 'ZH_TW', name: '繁體中文' },
    ],
};

export default LanguageSwitcher;
