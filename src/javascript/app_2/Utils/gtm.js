import GTMBase from '../../_common/base/gtm';

const GTM = (() => {
    const pushPurchaseData = (contract_data, ui_store) => {
        const data = {
            event   : 'buy_contract',
            contract: {
                amount       : contract_data.amount,
                barrier1     : contract_data.barrier,
                barrier2     : contract_data.barrier2,
                basis        : contract_data.basis,
                buy_price    : contract_data.buy_price,
                contract_type: contract_data.contract_type,
                currency     : contract_data.currency,
                date_expiry  : contract_data.date_expiry,
                date_start   : contract_data.date_start,
                duration     : contract_data.duration,
                duration_unit: contract_data.duration_unit,
                payout       : contract_data.payout,
                symbol       : contract_data.symbol,
            },
            settings: {
                theme           : ui_store.is_dark_mode_on ? 'dark' : 'light',
                portfolio_drawer: ui_store.is_portfolio_drawer_on ? 'open' : 'closed',
                purchase_confirm: ui_store.is_purchase_confirm_on ? 'enabled' : 'disabled',
                chart           : {
                    toolbar_position: ui_store.is_chart_layout_default ? 'bottom' : 'left',
                    chart_asset_info: ui_store.is_chart_asset_info_visible ? 'visible' : 'hidden',
                },
            },
        };
        GTMBase.pushDataLayer(data);
    };

    return {
        ...GTMBase,
        pushPurchaseData,
    };
})();

export default GTM;
