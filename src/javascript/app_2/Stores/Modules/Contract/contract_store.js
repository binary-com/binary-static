import {
    action,
    computed,
    observable }              from 'mobx';
import { createChartBarrier } from './Helpers/chart_barriers';
import { createChartMarkers } from './Helpers/chart_markers';
import {
    getDetailsExpiry,
    getDetailsInfo }          from './Helpers/details';
import {
    getChartConfig,
    getDisplayStatus,
    getEndSpot,
    getEndSpotTime,
    getFinalPrice,
    getIndicativePrice,
    isEnded,
    isSoldBeforeStart,
    isUserSold }              from './Helpers/logic';
import BaseStore              from '../../base_store';
import { WS }                 from '../../../Services';

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
        this.smart_chart.setContractMode(true);

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
        this.smart_chart.removeMarkers();
        this.smart_chart.setContractMode(false);
    };

    @action.bound
    updateProposal(response) {
        this.contract_info = response.proposal_open_contract;

        createChartBarrier(this.smart_chart, this.contract_info);
        createChartMarkers(this.smart_chart, this.contract_info, this);
    }

    // ---------------------------
    // ----- Computed values -----
    // ---------------------------
    @computed
    get chart_config() {
        return getChartConfig(this.contract_info);
    }

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
    get end_spot() {
        return getEndSpot(this.contract_info);
    }

    @computed
    get end_spot_time() {
        return getEndSpotTime(this.contract_info);
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

    @computed
    get is_sold_before_start() {
        return isSoldBeforeStart(this.contract_info);
    }

    @computed
    get is_user_sold() {
        return isUserSold(this.contract_info);
    }
};
