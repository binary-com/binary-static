import React        from 'react';
import PropTypes    from 'prop-types';
import SettingsControl from './settings_control.jsx';
import { connect }  from '../../../store/connect';

class General extends React.PureComponent {
    render() {
        return (
            <div className='tab-content'>
                <div className='general-setting-container'>
                    <SettingsControl name='dark mode' />
                    <SettingsControl name='language' toggle={this.props.showLanguage}/>
                </div>
            </div>
        );
    }
};

General.propTypes = {
    showLanguage: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        showLanguage: ui.showLanguageDialog,
    })
)(General);
