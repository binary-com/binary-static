import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import IconCheck         from 'Images/app_2/portfolio/ic-check.svg';
import IconCross         from 'Images/app_2/portfolio/ic-cross.svg';
import { localize }      from '_common/localize';

const ResultOverlay = ({
    id,
    onClose,
    result,
}) => (
    <CSSTransition
        in={!!(result)}
        timeout={250}
        classNames={{
            enter    : 'positions-drawer-card__result--enter',
            enterDone: 'positions-drawer-card__result--enter-done',
            exit     : 'positions-drawer-card__result--exit',
        }}
        unmountOnExit
    >
        <div className={classNames('positions-drawer-card__result', {
            'positions-drawer-card__result--won' : (result === 'won'),
            'positions-drawer-card__result--lost': (result === 'lost'),
        })}
        >
            <span className={classNames('result__caption', {
                'result__caption--won' : (result === 'won'),
                'result__caption--lost': (result === 'lost'),
            }
            )}
            >
                {result ? localize(result) : null}
                {
                    (result === 'won') ?
                        <IconCheck className='result__icon' />
                        :
                        <IconCross className='result__icon' />
                }
            </span>
            <span
                className='result__close-btn'
                onClick={() => onClose(id)}
            />
        </div>
    </CSSTransition>
);

ResultOverlay.propTypes = {
    id     : PropTypes.number,
    onClose: PropTypes.func,
    result : PropTypes.string,
};

export default ResultOverlay;
