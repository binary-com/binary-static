import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import ErrorComponent    from 'App/Components/Elements/Errors';
import { connect }       from 'Stores/connect';
import ContractDetails   from './contract_details.jsx';
import InfoBox           from './info_box.jsx';
import SmartChart        from '../../SmartChart';

const Contract = ({
    is_mobile,
    has_error,
    match,
    symbol,
    chart_config,
    updateChartType,
    updateGranularity,
}) => {
    const form_wrapper_class = is_mobile ? 'mobile-wrapper' : 'sidebar-container desktop-only';
    return (
        <React.Fragment>
            {
                has_error ?
                    <ErrorComponent message={localize('Unknown Error!')} />
                    :
                    <div className='trade-container'>
                        <div className='chart-container notice-msg'>
                            { symbol &&
                                <SmartChart
                                    InfoBox={<InfoBox />}
                                    symbol={symbol}
                                    {...chart_config}
                                    updateChartType={updateChartType}
                                    updateGranularity={updateGranularity}
                                />
                            }
                        </div>
                        <div className={form_wrapper_class}>
                            <CSSTransition
                                in={!has_error}
                                timeout={400}
                                classNames='contract-wrapper'
                                unmountOnExit
                            >
                                <div className='contract-wrapper'>
                                    <ContractDetails
                                        contract_id={match.params.contract_id}
                                        key={match.params.contract_id}
                                    />
                                </div>
                            </CSSTransition>
                        </div>
                    </div>
            }
        </React.Fragment>
    );
};

Contract.propTypes = {
    chart_config: PropTypes.object,
    has_error   : PropTypes.bool,
    is_mobile   : PropTypes.bool,
    match       : PropTypes.object,
    symbol      : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        chart_config     : modules.contract.chart_config,
        has_error        : modules.contract.has_error,
        updateChartType  : modules.contract.updateChartType,
        updateGranularity: modules.contract.updateGranularity,
        is_mobile        : ui.is_mobile,
        symbol           : modules.contract.contract_info.underlying,
    })
)(Contract);
