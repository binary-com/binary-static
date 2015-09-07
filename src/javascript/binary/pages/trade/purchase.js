/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

var Purchase = (function () {
    'use strict';

    var display = function (details) {
        var receipt = details['buy'],
            container = document.getElementById('contract_confirmation_container'),
            message_container = document.getElementById('confirmation_message_container'),
            fragment = document.createDocumentFragment(),
            h3 = document.createElement('h3'),
            message = document.createElement('p'),
            content = '';

        while (message_container && message_container.firstChild) {
            message_container.removeChild(message_container.firstChild);
        }

        h3.setAttribute('class', 'contract_purchase_heading');

        var error = details['error'];
        if (error) {
            content = document.createTextNode(error['message']);
            message.appendChild(content);
            fragment.appendChild(message);
        } else {
            var txnInfo = document.createElement('div');

            content = document.createTextNode(Content.localize().textContractConfirmationHeading);
            h3.appendChild(content);
            txnInfo.appendChild(h3);

            content = document.createTextNode(receipt['longcode']);
            message.appendChild(content);
            txnInfo.appendChild(message);

            content = document.createTextNode(Content.localize().textContractConfirmationReference + ' ' + receipt['trx_id']);
            message = document.createElement('p');
            message.appendChild(content);
            txnInfo.appendChild(message);

            content = document.createTextNode(Content.localize().textContractConfirmationBalance + ' ' + receipt['balance_after']);
            message = document.createElement('p');
            message.appendChild(content);
            txnInfo.appendChild(message);

            fragment.appendChild(txnInfo);
        }

        if (message_container) {
            message_container.appendChild(fragment);
        }
        if (container) {
            container.style.display = 'block';
            container.insertBefore(message_container, document.getElementById('confirmation_message_endelement'));
        }
    };

    return {
        display: display,
    };

})();
