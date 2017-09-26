const localize = require('./localize').localize;
const Mellt    = require('../../lib/Mellt/Mellt');

const checkPassword = (password_selector) => {
    const el_password = document.querySelector(password_selector);
    if (!el_password) {
        return;
    }

    const div = el_password.parentNode.querySelector('.days_to_crack') || document.createElement('div');

    const daysToCrack = Mellt.checkPassword(el_password.value.trim());
    if (daysToCrack < 0) {
        div.textContent = localize('The password you entered is one of the world\'s most commonly used passwords. You should not be using this password.');
    } else {
        let years;
        if (daysToCrack > 365) {
            years = Math.round(daysToCrack / 365 * 10) / 10;
            if (years > 1000000) {
                years = `${Math.round(years / 1000000 * 10) / 10} ${localize('million')}`;
            } else if (years > 1000) {
                years = `${Math.round(years / 1000)} ${localize('thousand')}`;
            }
        }
        div.textContent = localize(
            'It takes approximately [_1][_2] to crack this password.', [
                (daysToCrack === 1000000000 ? '>' : ''),
                years ? `${years} ${localize('years')}` : `${daysToCrack} ${localize('days')}`,
            ],
        );
    }
    let color = 'red';
    if (daysToCrack > 7) {
        color = daysToCrack < 30 ? 'yellow' : 'green';
    }
    div.classList = `days_to_crack hint ${color}`;
    el_password.parentNode.appendChild(div);
};

const removeCheck = (password_selector) => {
    const el_message = document.querySelector(password_selector).parentNode.querySelector('.days_to_crack');
    if (el_message) {
        el_message.remove();
    }
};

module.exports = {
    removeCheck,
    checkPassword,
};
