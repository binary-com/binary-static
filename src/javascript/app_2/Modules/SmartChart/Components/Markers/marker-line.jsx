import classNames           from 'classnames';
import { observer }         from 'mobx-react';
import PropTypes            from 'prop-types';
import React                from 'react';
import { Icon }             from 'Assets/Common';
import { IconEndTimeSVG }   from 'Assets/Contract/icon-end-time.jsx';
import { IconStartTimeSVG } from 'Assets/Contract/icon-start-time.jsx';

const MarkerLine = ({
    label,
    line_style,
    status,
}) => (
    <div className={classNames('chart-marker-line__wrapper', `chart-marker-line--${line_style}`)}>
        <div className='chart-marker-line__label'>{label}</div>
        { label === 'End Time' &&
            <Icon
                icon={IconEndTimeSVG}
                className={classNames('chart-marker-line__icon', {
                    'chart-marker-line__icon--won' : status === 'won',
                    'chart-marker-line__icon--lost': status === 'lost',
                })}
            />
        }
        { label === 'Start Time' &&
            <Icon
                icon={IconStartTimeSVG}
                className='chart-marker-line__icon'
            />
        }
    </div>
);

MarkerLine.propTypes = {
    label     : PropTypes.string,
    line_style: PropTypes.string,
    status    : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerLine);
