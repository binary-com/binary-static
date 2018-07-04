import React           from 'react';
import PropTypes       from 'prop-types';
import SettingsControl from './settings_control.jsx';
import { connect }     from '../../../store/connect';

class Chart extends React.PureComponent {
    render() {
        return (
            <div className='tab-content'>
                <div className='chart-setting-container'>
                    <SettingsControl name='position' toggle={this.props.toggleChartLayout}/>
                    <SettingsControl name='asset information' />
                    <SettingsControl name='scale countdown' />
                </div>
            </div>
        );
    }
};

Chart.propTypes = {
    toggleChartLayout: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        toggleChart: ui.toggleChartLayout,
    })
)(Chart);
