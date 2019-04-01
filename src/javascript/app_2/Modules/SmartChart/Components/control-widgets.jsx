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
import React          from 'react';

const ControlWidgets = () => (
    <React.Fragment>
        <CrosshairToggle />
        <ChartTypes />
        <StudyLegend />
        <Comparison />
        <DrawTools />
        <Views />
        <Share />
        <Timeperiod />
        <ChartSize />
    </React.Fragment>
);

export default ControlWidgets;
