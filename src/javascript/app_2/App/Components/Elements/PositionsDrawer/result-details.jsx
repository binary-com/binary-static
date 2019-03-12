import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import { IconArrow }     from 'Assets/Common';
import { localize }      from '_common/localize';
import {
    epochToMoment,
    toGMTFormat }        from 'Utils/Date';

class ResultDetails extends React.PureComponent {
    state = {
        is_open: false,
    };

    toggleDetails = () => {
        this.setState({ is_open: !this.state.is_open });
    }

    render() {
        const {
            barrier,
            contract_end_time,
            contract_start_time,
            duration,
            duration_unit,
            entry_spot,
            has_result,
            id_sell,
            tick_count,
        } = this.props;
        if (!has_result) return null;
        return (
            <React.Fragment>
                <div className='result-details__separator' />
                <CSSTransition
                    in={this.state.is_open}
                    timeout={250}
                    classNames={{
                        enter    : 'result-details__wrapper--enter',
                        enterDone: 'result-details__wrapper--enter-done',
                        exit     : 'result-details__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='result-details__wrapper'>
                        <div className='result-details__grid'>
                            <div className='result-details__item'>
                                <span className='result-details__label'>
                                    {localize('Reference ID')}
                                </span>
                                <span className='result-details__value'>
                                    {id_sell}
                                </span>
                            </div>
                            <div className='result-details__item'>
                                <span className='result-details__label'>
                                    {localize('Duration')}
                                </span>
                                <span className='result-details__value'>
                                    {tick_count ? `${tick_count} ${localize('ticks')}` : `${duration} ${duration_unit}`}
                                </span>
                            </div>
                        </div>
                        <div className='result-details__grid'>
                            <div className='result-details__item'>
                                <span className='result-details__label'>
                                    {localize('Barrier')}
                                </span>
                                <span className='result-details__value'>
                                    {barrier.toFixed(2)}
                                </span>
                            </div>
                            <div className='result-details__item'>
                                <span className='result-details__label'>
                                    {localize('Entry spot')}
                                </span>
                                <span className='result-details__value'>
                                    {entry_spot.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className='result-details__grid'>
                            <div className='result-details__item'>
                                <span className='result-details__label'>
                                    {localize('Start time')}
                                </span>
                                <span className='result-details__value'>
                                    {toGMTFormat(epochToMoment(contract_start_time))}
                                </span>
                            </div>
                            <div className='result-details__item'>
                                <span className='result-details__label'>
                                    {localize('End time')}
                                </span>
                                <span className='result-details__value'>
                                    {toGMTFormat(epochToMoment(contract_end_time))}
                                </span>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                <div
                    className={classNames('result-details__toggle', {
                        'result-details__toggle--is-open': this.state.is_open,
                    })}
                    onClick={this.toggleDetails}
                >
                    <IconArrow className='result-details__select-arrow' />
                </div>
            </React.Fragment>
        );
    }
}

ResultDetails.propTypes = {
    barrier          : PropTypes.number,
    contract_end_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    contract_start_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration     : PropTypes.number,
    duration_unit: PropTypes.string,
    entry_spot   : PropTypes.number,
    has_result   : PropTypes.bool,
    id_sell      : PropTypes.number,
    tick_count   : PropTypes.number,
};

export default ResultDetails;
