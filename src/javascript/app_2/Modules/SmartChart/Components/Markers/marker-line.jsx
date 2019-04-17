import classNames         from 'classnames';
import { observer }       from 'mobx-react';
import PropTypes          from 'prop-types';
import React              from 'react';
import { Icon }           from 'Assets/Common';
import { IconEndTimeSVG } from 'Assets/Contract/icon-end-time.jsx';

const MarkerLine = ({
    label,
    line_style,
}) => (
    <div className={classNames('chart-marker-line__wrapper', `chart-marker-line--${line_style}`)}>
        <div className='chart-marker-line__label'>{label}</div>
        <Icon
            icon={IconEndTimeSVG}
            className={classNames('chart-marker-line__icon', {
                'chart-marker-line__icon--won' : this.props.status === 'won',
                'chart-marker-line__icon--lost': this.props.status === 'lost',
            })}
        />
    </div>
);

MarkerLine.propTypes = {
    label     : PropTypes.string,
    line_style: PropTypes.string,
};
export default observer(MarkerLine);
