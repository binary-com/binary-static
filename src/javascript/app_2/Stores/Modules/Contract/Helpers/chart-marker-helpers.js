import extend                  from 'extend';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

export const createMarkerConfig = (marker_type, x, y, content_config) => (
    extend(true, {}, MARKER_TYPES_CONFIG[marker_type], {
        marker_config: {
            x: +x,
            y,
        },
        content_config,
    })
);
