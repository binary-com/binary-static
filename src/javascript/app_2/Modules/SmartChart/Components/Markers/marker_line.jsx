import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

const MarkerLine = ({
    label,
    line_style,
}) => (
    <div className={line_style}>
        <div>{label}</div>
    </div>
);

MarkerLine.propTypes = {
    label     : PropTypes.string,
    line_style: PropTypes.string,
};
export default observer(MarkerLine);
