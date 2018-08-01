import {
    action,
    computed,
    observable,
    toJS }                 from 'mobx';
import { setChartBarrier } from './Helpers/chart';
import {
    getDetailsExpiry,
    getDetailsInfo }       from './Helpers/details';
import {
    getDisplayStatus,
    getFinalPrice,
    getIndicativePrice,
    isEnded }              from './Helpers/logic';
import BaseStore           from '../../base_store';
import { WS }              from '../../../Services';
import { isEmptyObject }   from '../../../../_common/utility';

export default class ContractStore extends BaseStore {
    @observable contract_id;
    @observable contract_info = observable.object({});

    // -------------------
    // ----- Actions -----
    // -------------------
    @action.bound
    onMount(contract_id) {
        this.contract_id = contract_id;
        this.smart_chart = this.root_store.modules.smart_chart;
        this.smart_chart.is_contract_mode = true;

        if (contract_id) {
            WS.subscribeProposalOpenContract(this.contract_id, this.updateProposal, true);
        }
    }

    @action.bound
    onUnmount = () => {
        WS.forgetAll('proposal_open_contract');
        this.contract_id   = null;
        this.contract_info = {};
        this.smart_chart.removeBarriers();
        this.smart_chart.is_contract_mode = false;
    };

    @action.bound
    updateProposal(response) {
        const contract_info = response.proposal_open_contract;

        if (isEmptyObject(toJS(this.contract_info))) { // set on the first response
            setChartBarrier(this.smart_chart, contract_info);
        }

        this.contract_info = contract_info;
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
