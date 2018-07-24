import {
    action,
    computed,
    observable }        from 'mobx';
import {
    getDetailsExpiry,
    getDetailsInfo }    from './Helpers/details';
import {
    getDisplayStatus,
    getFinalPrice,
    getIndicativePrice,
    isEnded }           from './Helpers/logic';
import BaseStore        from '../../base_store';
import { WS }           from '../../../Services';

export default class ContractStore extends BaseStore {
    @observable contract_id;
    @observable contract_info = observable.object({});

    // -------------------
    // ----- Actions -----
    // -------------------
    @action.bound
    onMount(contract_id) {
        this.contract_id = contract_id;

        if (contract_id) {
            WS.subscribeProposalOpenContract(this.contract_id, this.updateProposal, true);
        }
    }

    @action.bound
    onUnmount = () => {
        WS.forgetAll('proposal_open_contract');
        this.contract_id   = null;
        this.contract_info = {};
    };

    @action.bound
    updateProposal(response) {
        this.contract_info = response.proposal_open_contract;
    }

    // ---------------------------
    // ----- Computed values -----
    // ---------------------------
    @computed
    get details_expiry() {
        return getDetailsExpiry(this);
    }

    @computed
    get details_info() {
        return getDetailsInfo(this.contract_info);
    }

    @computed
    get display_status() {
        return getDisplayStatus(this.is_ended, this.contract_info.profit);
    }

    @computed
    get final_price() {
        return getFinalPrice(this.contract_info);
    }

    @computed
    get indicative_price() {
        return getIndicativePrice(this);
    }

    @computed
    get is_ended() {
        return isEnded(this.contract_info);
    }
};
