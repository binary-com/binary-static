import {
    AssetInformation,
    ChartTitle }      from '@binary-com/smartcharts';
import PropTypes      from 'prop-types';
import React          from 'react';

const TopWidgets = ({
    is_title_enabled = true,
    onSymbolChange,
}) => (
    <React.Fragment>
        <ChartTitle enabled={is_title_enabled} onChange={onSymbolChange} />
        <AssetInformation />
    </React.Fragment>
);

TopWidgets.propTypes = {
    is_title_enabled: PropTypes.bool,
    onSymbolChange  : PropTypes.func,
};

export default TopWidgets;
