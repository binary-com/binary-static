import React         from 'react';
import MarkerLine    from '../../../../Modules/SmartChart/Components/Markers/marker_line.jsx';
import MarkerSpot    from '../../../../Modules/SmartChart/Components/Markers/marker_spot.jsx';
import IconFlag      from '../../../../Assets/Icons/flag.jsx';
import IconEntrySpot from '../../../../Assets/Icons/entry_spot.jsx';

const MARKER_X_POSITIONER = {
    DATE: 'date',
    NONE: 'none',
};

const MARKER_Y_POSITIONER = {
    VALUE: 'value',
    NONE : 'none',
};

const MARKER_CONTENT_TYPES = {
    LINE: {
        ContentComponent: MarkerLine,
        xPositioner     : MARKER_X_POSITIONER.DATE,
        yPositioner     : MARKER_Y_POSITIONER.NONE,
    },
    SPOT: {
        ContentComponent: MarkerSpot,
        xPositioner     : MARKER_X_POSITIONER.DATE,
        yPositioner     : MARKER_Y_POSITIONER.VALUE,
    },
};

export const MARKER_TYPES_CONFIG = {
    LINE_END     : { type: 'LINE_END',      marker_config: MARKER_CONTENT_TYPES.LINE, content_config: {} },
    LINE_PURCHASE: { type: 'LINE_PURCHASE', marker_config: MARKER_CONTENT_TYPES.LINE, content_config: {} },
    LINE_START   : { type: 'LINE_START',    marker_config: MARKER_CONTENT_TYPES.LINE, content_config: {} },
    SPOT_ENTRY   : { type: 'SPOT_ENTRY',    marker_config: MARKER_CONTENT_TYPES.SPOT, content_config: { align: 'left',  icon: <IconEntrySpot /> } },
    SPOT_EXIT    : { type: 'SPOT_EXIT',     marker_config: MARKER_CONTENT_TYPES.SPOT, content_config: { align: 'right', icon: <IconFlag /> } },
};
