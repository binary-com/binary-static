import extend                 from 'extend';
import {
    action,
    computed,
    observable }              from 'mobx';
import { isEmptyObject }      from '_common/utility';
import ServerTime             from '_common/base/server_time';
import { WS }                 from 'Services';
import { ChartBarrierStore }  from './chart-barrier-store';
import { ChartMarkerStore }   from './chart-marker-store';
import { tick_chart_types }   from './Constants/chart';
import {
    barriersObjectToArray,
    isBarrierSupported }      from './Helpers/barriers';
import BaseStore              from '../../base-store';

const store_name = 'smart_chart_store';

export default class SmartChartStore extends BaseStore {
    @observable symbol;
    @observable barriers = observable.object({});
    @observable markers  = observable.object({});

    @observable is_contract_mode = false;
    @observable is_title_enabled = true;

    @observable chart_type                  = 'mountain';
    @observable granularity                 = 0;
    @observable scroll_to_left_epoch        = null;
    @observable scroll_to_left_epoch_offset = 0;
    @observable zoom;

    constructor({ root_store }) {
        const local_storage_properties = ['chart_type', 'granularity'];
        super({ root_store, local_storage_properties, store_name });
    }

    @action.bound
    updateChartType(chart_type) {
        this.chart_type = chart_type;
    }

    @action.bound
    updateGranularity(granularity) {
        this.granularity = granularity;
        if (granularity === 0 && !tick_chart_types.includes(this.chart_type)) {
            this.chart_type = 'mountain';
        }
    }

    @action.bound
    updateEpochScrollToValue(epoch) {
        this.scroll_to_left_epoch = epoch;
    }

    @action.bound
    updateEpochScrollToOffset(offset) {
        this.scroll_to_left_epoch_offset = offset;
    }

    @action.bound
    updateChartZoom(percentage) {
        this.zoom = percentage;
    }

    @action.bound
    cleanupContractChartView() {
        this.removeBarriers();
        this.removeMarkers();
        this.resetScrollZoom();
        this.setContractMode(false);
    }

    @action.bound
    resetScrollZoom() {
        this.zoom = (this.zoom === 100) ? -100 : 0;
        this.scroll_to_left_epoch = null;
        this.scroll_to_left_epoch_offset = null;
    }

    @action.bound
    setContractMode(is_contract_mode) {
        this.is_contract_mode = is_contract_mode;
        this.is_title_enabled = !is_contract_mode;
    }

    @action.bound
    onUnmount = () => {
        this.symbol = null;
        this.removeBarriers();
        this.removeMarkers();
    };

    // --------- Tick Contracts ---------
    @action.bound
    setTickChartView(scroll_to_left_epoch) {
        if (this.granularity !== 0) {
            this.updateGranularity(0);
        }
        this.updateEpochScrollToOffset(1);
        this.updateChartZoom(100);
        this.updateEpochScrollToValue(scroll_to_left_epoch);
    }

    // ---------- Barriers ----------
    @action.bound
    createBarriers = (contract_type, high_barrier, low_barrier, onChartBarrierChange, config) => {
        if (isEmptyObject(this.barriers.main)) {
            let main_barrier = {};
            if (isBarrierSupported(contract_type)) {
                main_barrier = new ChartBarrierStore(high_barrier, low_barrier, onChartBarrierChange, config);
            }

            this.barriers = {
                main: main_barrier,
            };
        }
    };

    @action.bound
    updateBarriers(barrier_1, barrier_2) {
        if (!isEmptyObject(this.barriers.main)) {
            this.barriers.main.updateBarriers(barrier_1, barrier_2);
        }
    }

    @action.bound
    updateBarrierShade(should_display, contract_type) {
        if (!isEmptyObject(this.barriers.main)) {
            this.barriers.main.updateBarrierShade(should_display, contract_type);
        }
    }

    @action.bound
    removeBarriers() {
        this.barriers = {};
    }

    @computed
    get barriers_array() {
        return barriersObjectToArray(this.barriers);
    }

    // ---------- Markers ----------
    @action.bound
    createMarker(config) {
        this.markers = extend({}, this.markers, {
            [config.type]: new ChartMarkerStore(config.marker_config, config.content_config),
        });
    }

    @action.bound
    removeMarkers() {
        this.markers = {};
    }

    @computed
    get markers_array() {
        return barriersObjectToArray(this.markers);
    }

    // ---------- Chart Settings ----------
    @computed
    get settings() { // TODO: consider moving chart settings from ui_store to chart_store
        return (({ common, ui } = this.root_store) => ({
            assetInformation: ui.is_chart_asset_info_visible,
            countdown       : ui.is_chart_countdown_visible,
            lang            : common.current_language,
            position        : ui.is_chart_layout_default ? 'bottom' : 'left',
            theme           : ui.is_dark_mode_on ? 'dark' : 'light',
        }))();
    }

    // ---------- WS ----------
    wsSubscribe = (request_object, callback) => {
        if (request_object.subscribe !== 1) return;
        WS.subscribeTicksHistory({ ...request_object }, callback); // use a copy of the request_object to prevent updating the source
    };

    wsForget = (match_values, callback) => (
        WS.forget('ticks_history', callback, match_values)
    );

    wsSendRequest = (request_object) => {
        if (request_object.time) {
            return ServerTime.timePromise.then(() => ({
                msg_type: 'time',
                time    : ServerTime.get().unix(),
            }));
        }
        return WS.sendRequest(request_object);
    };
}
