const PaymentAgentTransferData = (function() {
    'use strict';

    const transfer = function(transferTo, currency, amount, toDryRun) {
        const dryRun = toDryRun ? 1 : 0;
        BinarySocket.send({
            paymentagent_transfer: 1,
            transfer_to          : transferTo,
            currency             : currency,
            amount               : amount,
            dry_run              : dryRun,
        });
    };

    return {
        transfer: transfer,
    };
})();

module.exports = {
    PaymentAgentTransferData: PaymentAgentTransferData,
};
