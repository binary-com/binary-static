import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import ErrorComponent    from 'App/Components/Elements/Errors';
import { connect }       from 'Stores/connect';
import ContractDetails   from './contract_details.jsx';
import InfoBox           from './info_box.jsx';

const SmartChart = React.lazy(() => import('Modules/SmartChart'));

const Contract = ({
    is_mobile,
    error_message,
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
                    <ErrorComponent message={error_message} />
                    :
                    <div className='trade-container'>
                        <div className='chart-container'>
                            {symbol &&
                                <React.Suspense fallback={<div>Loading... </div>}>
                                    <SmartChart
                                        InfoBox={<InfoBox />}
                                        symbol={symbol}
                                        {...chart_config}
                                        updateChartType={updateChartType}
                                        updateGranularity={updateGranularity}
                                    />
                                </React.Suspense>
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
    chart_config : PropTypes.object,
    error_message: PropTypes.string,
    has_error    : PropTypes.bool,
    is_mobile    : PropTypes.bool,
    match        : PropTypes.object,
    symbol       : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        chart_config     : modules.contract.chart_config,
        error_message    : modules.contract.error_message,
        has_error        : modules.contract.has_error,
        updateChartType  : modules.contract.updateChartType,
        updateGranularity: modules.contract.updateGranularity,
        is_mobile        : ui.is_mobile,
        symbol           : modules.contract.contract_info.underlying,
    }),
)(Contract);
