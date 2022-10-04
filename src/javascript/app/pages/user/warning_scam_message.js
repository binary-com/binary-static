const getElementById       = require('../../../_common/common_functions').getElementById;
const BinarySocket         = require('../../base/socket');
const Client               = require('../../base/client');
const State                = require('../../../_common/storage').State;

const WarningScamMessage = (()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const actionParams = urlParams.get('action');
    let warning_scam_message, warning_scam_message_button, warning_scam_message_checkbox;

    if (actionParams === 'signup') {
        localStorage.setItem('new_user_account', true);
    }

    const has_read_warning_scam_message = () => {
        BinarySocket.wait('authorize', 'website_status').then(()=> {
            const is_logged_in = !!Client.isLoggedIn();
            const is_brazil = State.getResponse('website_status.clients_country') === 'br';
            const is_message_read = !!localStorage.getItem('read_scam_message');
            const is_new_account = !!localStorage.getItem('new_user_account');

            if (is_logged_in && is_brazil && !is_message_read && !is_new_account) {
                warning_scam_message = getElementById('warning_scam_message');
                warning_scam_message_checkbox = getElementById('warning_scam_message_checkbox');
            }
            warning_scam_message.classList.add('lightbox');
            warning_scam_message.setVisibility(1);
            warning_scam_message_checkbox.addEventListener('change', acknowledgeMessage);
        });
    };
    
    const acknowledgeMessage = () => {
        warning_scam_message_button = getElementById('warning_scam_message_button');
        if (warning_scam_message_button.classList.contains('button-disabled')) {
            warning_scam_message_button.classList.remove('button-disabled');
        } else {
            warning_scam_message_button.classList.add('button-disabled');
        }
        
        warning_scam_message_button.addEventListener('click',closePopup);
    };

    const closePopup = () => {
        localStorage.setItem('read_scam_message', true);
        warning_scam_message.classList.remove('lightbox');
        warning_scam_message.setVisibility(0);
    };

    return { has_read_warning_scam_message, acknowledgeMessage, closePopup };
})();

module.exports = WarningScamMessage;
