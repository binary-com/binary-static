import classNames    from 'classnames';
import React         from 'react';
import { connect }   from 'Stores/connect';
import DarkModeIcon  from 'Images/app_2/settings/img-theme-dark.svg';
import LightModeIcon from 'Images/app_2/settings/img-theme-light.svg';
import Localize      from 'App/Components/Elements/localize.jsx';

const ThemeSelectSettings = ({ is_dark_mode, toggleDarkMode }) => {
    const darkOnClick = () => {
        if (!is_dark_mode) {
            toggleDarkMode();
        }
    };

    const lightOnClick = () => {
        if (is_dark_mode) {
            toggleDarkMode();
        }
    };
    return (
        <React.Fragment>
            <div className='theme-select-settings'>
                <h4 className='theme-select-settings__title'>
                    <Localize str='Select theme' />
                </h4>
                <div className='theme-select-settings__content'>
                    <div className='theme-select-settings__option'>
                        <DarkModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': is_dark_mode,
                            })}
                            onClick={darkOnClick}
                        />
                        <p className='theme-select-settings__option__title'><Localize str='Dark mode' /></p>
                    </div>
                    <div className='theme-select-settings__option'>
                        <LightModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': !is_dark_mode,
                            })}
                            onClick={lightOnClick}
                        />
                        <p className='theme-select-settings__option__title'><Localize str='Light mode' /></p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default connect(({ ui }) => (
    {
        is_dark_mode  : ui.is_dark_mode_on,
        toggleDarkMode: ui.toggleDarkMode,
    }
))(ThemeSelectSettings);
