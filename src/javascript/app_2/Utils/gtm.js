import GTMBase from '../../_common/base/gtm';

const GTM = (() => {
    const pushPurchaseData = (contract_data) => {
        const data = {
            event   : 'buy_contract',
            contract: { ...contract_data },
        };
        // TODO: add chart settings, general settings
        GTMBase.pushDataLayer(data);
    };

    return {
        ...GTMBase,
        pushPurchaseData,
    };
})();

export default GTM;
