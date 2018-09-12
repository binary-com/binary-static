import GTMBase from '../../_common/base/gtm';

const GTM = (() => {
    const pushPurchaseData = (contract_data, settings_data) => {
        const data = {
            event   : 'buy_contract',
            contract: { ...contract_data },
            settings: { ...settings_data },
        };
        // TODO: add chart settings, general settings
        console.log(data);
        GTMBase.pushDataLayer(data);
    };

    return {
        ...GTMBase,
        pushPurchaseData,
    };
})();

export default GTM;
