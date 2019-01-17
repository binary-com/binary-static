import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import Money             from 'App/Components/Elements/money.jsx';
import Tooltip           from 'App/Components/Elements/tooltip.jsx';
import { IconPriceMove } from 'Assets/Trading/icon_price_move.jsx';

class ContractInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            previous_price      : null,
            icon_type           : null,
            proposal_info_req_id: null,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const previous_price       = state.previous_price;
        const proposal_info_req_id = props.proposal_info_req_id;

        if (proposal_info_req_id && proposal_info_req_id !== state.proposal_info_req_id) {
            let icon_type = null;
            const price   = props.proposal_info[props.contract_basis.value];
            if (price !== previous_price) {
                icon_type = price > previous_price ? 'profit' : 'loss';
            }
            return {
                icon_type,
                previous_price: price,
                proposal_info_req_id,
            };
        }
        return {
            icon_type: state.icon_type,
            previous_price,
            proposal_info_req_id,
        };
    }

    render() {
        return (
            <React.Fragment>
                {(this.props.proposal_info.has_error || !this.props.proposal_info.id) ?
                    <div className={this.props.proposal_info.has_error ? 'error-info-wrapper' : ''}>
                        <span>{this.props.proposal_info.message}</span>
                    </div>
                    :
                    <div className='purchase-info-wrapper'>
                        <div className='info-wrapper'>
                            <div>{localize('[_1]', this.props.contract_basis.text)}</div>
                            <div>
                                <Money
                                    amount={this.props.proposal_info[this.props.contract_basis.value]}
                                    currency={this.props.currency}
                                />
                            </div>
                            <div className='icon_price_move_container'>
                                { this.state.icon_type && <IconPriceMove type={this.state.icon_type} /> }
                            </div>
                        </div>
                        <span className='purchase-tooltip'>
                            <Tooltip alignment='left' icon='info' message={this.props.proposal_info.message} />
                        </span>
                    </div>
                }
            </React.Fragment>
        );
    }
}

ContractInfo.propTypes = {
    barrier_count       : PropTypes.number,
    basis               : PropTypes.string,
    contract_basis      : PropTypes.object,
    currency            : PropTypes.string,
    proposal_info       : PropTypes.object,
    proposal_info_req_id: PropTypes.number,
};

export default ContractInfo;
