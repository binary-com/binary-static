import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import React             from 'react';
import ContractDetails   from './contract_details.jsx';
import InfoBox           from '../Containers/info_box.jsx';
import SmartChart        from '../../SmartChart';
import ErrorComponent    from '../../../App/Components/Elements/Errors';
import { connect }       from '../../../Stores/connect';
import { localize }      from '../../../../_common/localize';

const Contract = ({
    chart_config = {},
    is_mobile,
    has_error,
    match,
    symbol,
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
                                    InfoBox={InfoBox}
                                    symbol={symbol}
                                    {...chart_config}
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
    is_mobile   : PropTypes.bool,
    has_error   : PropTypes.bool,
    match       : PropTypes.object,
    symbol      : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        chart_config: modules.contract.chart_config,
        has_error   : modules.contract.has_error,
        symbol      : modules.contract.contract_info.underlying,
        is_mobile   : ui.is_mobile,
    })
)(Contract);
