import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { IconArrow }     from 'Assets/Common';
import { localize }      from '_common/localize';
import {
    epochToMoment,
    toGMTFormat }        from 'Utils/Date';
import ResultDetailsItem from './result-details-item.jsx';

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
                <div className={classNames('result-details__wrapper', {
                    'result-details__wrapper--is-open': this.state.is_open,
                })}
                >
                    <div className='result-details__grid'>
                        <ResultDetailsItem
                            label={localize('Reference ID')}
                            value={id_sell}
                        />
                        <ResultDetailsItem
                            label={localize('Duration')}
                            value={tick_count ? `${tick_count} ${localize('ticks')}` : `${duration} ${duration_unit}`}
                        />
                    </div>
                    <div className='result-details__grid'>
                        <ResultDetailsItem
                            label={localize('Barrier')}
                            value={barrier || ' - '}
                        />
                        <ResultDetailsItem
                            label={localize('Entry spot')}
                            value={entry_spot || ' - '}
                        />
                    </div>
                    <div className='result-details__grid'>
                        <ResultDetailsItem
                            label={localize('Start time')}
                            value={toGMTFormat(epochToMoment(contract_start_time))}
                        />
                        <ResultDetailsItem
                            label={localize('End time')}
                            value={toGMTFormat(epochToMoment(contract_end_time))}
                        />
                    </div>
                </div>
                <div
                    className={classNames('result-details__toggle', {
                        'result-details__toggle--is-open': this.state.is_open,
                    })}
                    onClick={this.toggleDetails}
                >
                    <IconArrow />
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
