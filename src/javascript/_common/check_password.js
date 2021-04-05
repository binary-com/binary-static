const zxcvbn = require('./lib/zxcvbn/zxcvbn');
const localize = require('./localize').localize;

// all existing warning phrases from zxcvbn
const feedback_messages = {
    use_a_few_words                 : () => localize('Use a few words, avoid common phrases'),
    no_need_for_mixed_chars         : () => localize('No need for symbols, digits, or uppercase letters'),
    uncommon_words_are_better       : () => localize('Add another word or two. Uncommon words are better.'),
    straight_rows_of_keys_are_easy  : () => localize('Straight rows of keys are easy to guess'),
    short_keyboard_patterns_are_easy: () => localize('Short keyboard patterns are easy to guess'),
    use_longer_keyboard_patterns    : () => localize('Use a longer keyboard pattern with more turns'),
    repeated_chars_are_easy         : () => localize('Repeats like "aaa" are easy to guess'),
    repeated_patterns_are_easy      : () =>
        localize('Repeats like "abcabcabc" are only slightly harder to guess than "abc"'),
    avoid_repeated_chars            : () => localize('Avoid repeated words and characters'),
    sequences_are_easy              : () => localize('Sequences like abc or 6543 are easy to guess'),
    avoid_sequences                 : () => localize('Avoid sequences'),
    recent_years_are_easy           : () => localize('Recent years are easy to guess'),
    avoid_recent_years              : () => localize('Avoid recent years'),
    avoid_associated_years          : () => localize('Avoid years that are associated with you'),
    dates_are_easy                  : () => localize('Dates are often easy to guess'),
    avoid_associated_dates_and_years: () => localize('Avoid dates and years that are associated with you'),
    top10_common_password           : () => localize('This is a top-10 common password'),
    top100_common_password          : () => localize('This is a top-100 common password'),
    very_common_password            : () => localize('This is a very common password'),
    similar_to_common_password      : () => localize('This is similar to a commonly used password'),
    a_word_is_easy                  : () => localize('A word by itself is easy to guess'),
    names_are_easy                  : () => localize('Names and surnames by themselves are easy to guess'),
    common_names_are_easy           : () => localize('Common names and surnames are easy to guess'),
    capitalization_doesnt_help      : () => localize('Capitalization doesn\'t help very much'),
    all_uppercase_doesnt_help       : () => localize('All-uppercase is almost as easy to guess as all-lowercase'),
    reverse_doesnt_help             : () => localize('Reversed words aren\'t much harder to guess'),
    substitution_doesnt_help        : () =>
        localize('Predictable substitutions like \'@\' instead of \'a\' don\'t help very much'),
    user_dictionary: () => localize('This password is on the blacklist'),
};

let feedback_message = '';
let password_score = 0;

const checkPassword = (password_selector, should_show_error) => {
    const el_password = document.querySelector(password_selector);

    const el_meter_bar = el_password.parentNode.querySelector('.password--meter-fill');
    const el_feedback_message = el_password.parentNode.querySelector('.password--message');
    const password_value = el_password.value.trim();

    if (!el_password || password_value.length < 1) {
        password_score = 0;
        el_meter_bar.style.transform = 'scale(0, 1)';
        feedback_message = '';
        el_feedback_message.style.display = 'none';
        return;
    }

    if (password_value.length > 0) {
        const { score: updated_score, feedback: updated_feedback } =
            zxcvbn(password_value, { feedback_messages });
        feedback_message = typeof updated_feedback.warning === 'function' ? updated_feedback.warning() : '';
        password_score = updated_score;
    }

    if (el_meter_bar) {
        const width_scale = 0.25 * (password_value.length && password_score < 1 ? 1 : password_score);
        el_meter_bar.style.transform = `scale(${width_scale || 0}, 1)`;
        if (password_value.length && password_score < 2) {
            el_meter_bar.classList.remove('orange');
            el_meter_bar.classList.remove('green');
            el_meter_bar.classList.add('red');
        } else if (password_value.length && password_score === 2) {
            el_meter_bar.classList.remove('red');
            el_meter_bar.classList.remove('green');
            el_meter_bar.classList.add('orange');
        } else if (password_value.length && password_score >= 3) {
            el_meter_bar.classList.remove('orange');
            el_meter_bar.classList.remove('red');
            el_meter_bar.classList.add('green');
        }
    }
    if (el_feedback_message && should_show_error) {
        el_feedback_message.style.display = 'block';
        el_feedback_message.innerHTML = feedback_message;
    }
};

const removeCheck = (password_selector, should_reset_meter) => {
    const el_password = document.querySelector(password_selector);
    const el_meter_bar = el_password.parentNode.querySelector('.password--meter-fill');
    const password_value = el_password.value.trim();
    const el_feedback_message = el_password.parentNode.querySelector('.password--message');
    if (el_meter_bar && password_value.length < 1 || should_reset_meter) {
        el_meter_bar.style.transform = 'scale(0, 1)';
    }
    if (el_feedback_message) {
        el_feedback_message.innerHTML = '';
        el_feedback_message.style.display = 'none';
    }
};

module.exports = {
    removeCheck,
    checkPassword,
};
