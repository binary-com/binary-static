import { observer }    from 'mobx-react';
import PropTypes       from 'prop-types';
import React           from 'react';
// import { COLOR_CODES } from '../../../../Constants';

const MarkerLine = ({
    // color = COLOR_CODES.GRAY,
    label,
    // line_style,
}) => (
    <div>{label}</div>
);

MarkerLine.propTypes = {
    color     : PropTypes.string,
    label     : PropTypes.string,
    line_style: PropTypes.string,
};
export default observer(MarkerLine);
