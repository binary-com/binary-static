import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

const MarkerLine = ({
    label,
    line_style,
}) => (
    <div className={classNames('chart-marker-line__wrapper', `chart-marker-line--${line_style}`)}>
        <div className='chart-marker-line__label'>{label}</div>
    </div>
);

MarkerLine.propTypes = {
    label     : PropTypes.string,
    line_style: PropTypes.string,
};
export default observer(MarkerLine);
