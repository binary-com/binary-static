var PaymentAgentTransferData = (function () {
    "use strict";
    function transfer(transferTo, currency, amount, toDryRun) {
        var dryRun = toDryRun ? 1 : 0;
        BinarySocket.send({
            paymentagent_transfer: 1,
            transfer_to: transferTo,
            currency: currency,
            amount: amount,
            dry_run: dryRun
        });
    }

    return {
        transfer: transfer
    };
}());
