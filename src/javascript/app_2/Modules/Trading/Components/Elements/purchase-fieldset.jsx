import classNames     from 'classnames';
import React          from 'react';
import PropTypes      from 'prop-types';
// import { localize }   from '_common/localize';
// import { PopConfirm } from 'App/Components/Elements/PopConfirm';
import Tooltip        from 'App/Components/Elements/tooltip.jsx';
import Fieldset       from 'App/Components/Form/fieldset.jsx';
import ContractInfo   from 'Modules/Trading/Components/Form/Purchase/contract-info.jsx';
// import PurchaseLock   from 'Modules/Trading/Components/Form/Purchase/PurchaseLock';
import PurchaseButton from 'Modules/Trading/Components/Elements/purchase-button.jsx';

class PurchaseFieldset extends React.Component {
    constructor(props) {
        super(props);
        this.should_use_blur_animation = false;
    }

    componentDidUpdate() {
        this.should_use_blur_animation = true;
    }

    render() {
        const purchase_button = (
            <PurchaseButton
                currency={this.props.currency}
                info={this.props.info}
                is_contract_mode={this.props.is_contract_mode}
                is_disabled={this.props.is_disabled}
                is_high_low={this.props.is_high_low}
                is_loading={this.props.is_loading}
                onClickPurchase={this.props.onClickPurchase}
                should_use_blur_animation={this.should_use_blur_animation}
                type={this.props.type}
            />
        );

        return (
            <Fieldset
                className='trade-container__fieldset purchase-container__option'
            >
                {/* {(is_purchase_locked && index === 0) && */}
                {/* <PurchaseLock onClick={togglePurchaseLock} /> */}
                {/* } */}
                <React.Fragment>
                    <ContractInfo
                        basis={this.props.basis}
                        currency={this.props.currency}
                        proposal_info={this.props.info}
                        has_increased={this.props.info.has_increased}
                        is_loading={this.props.is_loading}
                        is_visible={!this.props.is_contract_mode}
                    />
                    <div
                        className={classNames('btn-purchase__shadow-wrapper', { 'btn-purchase__shadow-wrapper--disabled': (this.props.is_proposal_error || this.props.is_disabled) })}
                        onMouseEnter={() => { this.props.onHoverPurchase(true, this.props.type); }}
                        onMouseLeave={() => { this.props.onHoverPurchase(false); }}
                    >
                        {this.props.is_proposal_error &&
                        <Tooltip message={this.props.info.message} alignment='left' className='tooltip--error-secondary' />
                        }
                        {
                            // is_purchase_confirm_on ?
                            //     <PopConfirm
                            //         alignment='left'
                            //         cancel_text={localize('Cancel')}
                            //         confirm_text={localize('Purchase')}
                            //         message={localize('Are you sure you want to purchase this contract?')}
                            //     >
                            //         {purchase_button}
                            //     </PopConfirm>
                            //     :
                            purchase_button
                        }
                    </div>
                </React.Fragment>
            </Fieldset>
        );
    }
}

PurchaseFieldset.propTypes = {
    basis            : PropTypes.string,
    currency         : PropTypes.string,
    // index            : PropTypes.number,
    info             : PropTypes.object,
    is_contract_mode : PropTypes.bool,
    is_disabled      : PropTypes.bool,
    is_high_low      : PropTypes.bool,
    is_loading       : PropTypes.bool,
    is_proposal_error: PropTypes.bool,
    // is_purchase_confirm_on: PropTypes.bool,
    // is_purchase_locked    : PropTypes.bool,
    onClickPurchase  : PropTypes.func,
    onHoverPurchase  : PropTypes.func,
    // togglePurchaseLock    : PropTypes.func,
    type             : PropTypes.string,
};

export default PurchaseFieldset;
