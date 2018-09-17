import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { isDeepEqual }   from '_common/utility';
import ErrorComponent    from 'App/Components/Elements/Errors';
import { connect }       from 'Stores/connect';
import ContractDetails   from './contract_details.jsx';
import InfoBox           from './info_box.jsx';
import SmartChart        from '../../SmartChart';

class Contract extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: { ...this.props.chart_config },
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isDeepEqual(nextProps, this.props) || !isDeepEqual(nextState, this.state);
    }

    componentDidUpdate() {
        if (!isDeepEqual(this.props.chart_config, this.state.chart)) {
            this.setState({ chart: { ...this.props.chart_config } });
        }
    }

    updateChartType = (chart_type) => {
        this.setState({ chart: { ...this.state.chart, chart_type } });
    }

    updateGranularity = (granularity) => {
        this.setState({ chart: { ...this.state.chart, granularity } });
    }

    render() {
        const {
            is_mobile,
            has_error,
            match,
            symbol,
        } = this.props;
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
                                        {...this.state.chart}
                                        updateChartType={this.updateChartType}
                                        updateGranularity={this.updateGranularity}
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
    }
}

Contract.propTypes = {
    chart_config: PropTypes.object,
    has_error   : PropTypes.bool,
    is_mobile   : PropTypes.bool,
    match       : PropTypes.object,
    symbol      : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        chart_config: modules.contract.chart_config,
        has_error   : modules.contract.has_error,
        is_mobile   : ui.is_mobile,
        symbol      : modules.contract.contract_info.underlying,
    })
)(Contract);
