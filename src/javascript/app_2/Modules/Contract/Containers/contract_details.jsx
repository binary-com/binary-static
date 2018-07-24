import PropTypes       from 'prop-types';
import React           from 'react';
import DetailsContents from '../Components/details_contents.jsx';
import DetailsHeader   from '../Components/details_header.jsx';
import UILoader        from '../../../App/Components/Elements/ui_loader.jsx';
import { connect }     from '../../../Stores/connect';

class ContractDetails extends React.Component {
    componentDidMount()    { this.props.onMount(this.props.contract_id); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            contract_id,
            longcode,
            transaction_ids,
        } = this.props.contract_info;

        return (
            <div className='sidebar-container'>
                { !contract_id ?
                    <UILoader/>
                    :
                    <div className='contract-container'>
                        <DetailsHeader status={this.props.display_status}/>
                        <DetailsContents
                            buy_id={transaction_ids.buy}
                            details_expiry={this.props.details_expiry}
                            details_info={this.props.details_info}
                            longcode={longcode}
                        />
                    </div>
                }
            </div>
        );
    }
}

ContractDetails.propTypes = {
    contract_id   : PropTypes.string,
    contract_info : PropTypes.object,
    details_info  : PropTypes.object,
    details_expiry: PropTypes.object,
    display_status: PropTypes.string,
    onMount       : PropTypes.func,
    onUnmount     : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        contract_info : modules.contract.contract_info,
        details_info  : modules.contract.details_info,
        details_expiry: modules.contract.details_expiry,
        display_status: modules.contract.display_status,
        onMount       : modules.contract.onMount,
        onUnmount     : modules.contract.onUnmount,
    })
)(ContractDetails);
