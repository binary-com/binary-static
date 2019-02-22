import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import { CSSTransition }     from 'react-transition-group';
import { localize }          from '_common/localize';

const ResultOverlay = ({
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
            </span>
            <span className='result__close-btn' />
        </div>
    </CSSTransition>
);

ResultOverlay.propTypes = {
    result: PropTypes.string,
};

export default ResultOverlay;
