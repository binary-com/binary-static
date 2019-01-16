import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import Money             from 'App/Components/Elements/money.jsx';
import Tooltip           from 'App/Components/Elements/tooltip.jsx';
import { IconPriceMove } from 'Assets/Trading/icon_price_move.jsx';

class ContractInfo extends React.PureComponent {
    constructor(props) {
        super(props);

        this.previous_price = null;
    }

    getIconType = () => {
        let icon_type = '';
        const contract_basis = this.props.contract_basis.value;
        const price = this.props.proposal_info[contract_basis];
        if (price !== this.previous_price) {
            icon_type = price > this.previous_price ? 'profit' : 'loss';
            this.previous_price = price;
        }
        return icon_type;
    };

    render() {
        const iconType = this.getIconType();

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
                                { iconType && <IconPriceMove type={iconType} /> }
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
    barrier_count : PropTypes.number,
    basis         : PropTypes.string,
    contract_basis: PropTypes.object,
    currency      : PropTypes.string,
    proposal_info : PropTypes.object,
};

export default ContractInfo;
