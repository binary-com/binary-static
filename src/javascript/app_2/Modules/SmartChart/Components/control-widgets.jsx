import {
    ChartSize,
    ChartTypes,
    Comparison,
    CrosshairToggle,
    DrawTools,
    Share,
    StudyLegend,
    Timeperiod,
    Views }           from 'smartcharts-beta';
import PropTypes      from 'prop-types';
import React          from 'react';

const ControlWidgets = ({
    updateChartType,
}) => (
    <React.Fragment>
        <CrosshairToggle />
        <ChartTypes onChange={updateChartType} />
        <StudyLegend />
        <Comparison />
        <DrawTools />
        <Views />
        <Share />
        <Timeperiod />
        <ChartSize />
    </React.Fragment>
);

ControlWidgets.propTypes = {
    updateChartType: PropTypes.func,
};

export default ControlWidgets;
