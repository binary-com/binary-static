const KnowledgeTestUI     = require('./knowledge_test.ui');
const BinaryPjax          = require('../../binary/base/binary_pjax');
const Client              = require('../../binary/base/client');
const toJapanTimeIfNeeded = require('../../binary/base/clock').toJapanTimeIfNeeded;
const Header              = require('../../binary/base/header');
const localize            = require('../../binary/base/localize').localize;
const Url                 = require('../../binary/base/url');
const BinarySocket        = require('../../binary/websocket_pages/socket');
const Cookies             = require('../../lib/js-cookie');

const KnowledgeTest = (() => {
    'use strict';

    const submitted        = {};
    const obj_random_picks = {};
    const passing_score    = 14; // minimum score to pass the test
    const msg_pass = '{JAPAN ONLY}Congratulations, you have pass the test, our Customer Support will contact you shortly.';
    const msg_fail = '{JAPAN ONLY}Sorry, you have failed the test, please try again after 24 hours.';

    let submit_completed = false;
    let random_picks     = [];
    let result_score     = 0;
    let $container;
    let $header;
    let $message;
    let $questions;
    let $instructions;

    const onLoad = () => {
        // need to send get_settings because client status needs to be checked against latest available data
        BinarySocket.send({ get_settings: 1 }, { forced: true }).then((response) => {
            const jp_status = response.get_settings.jp_account_status;

            if (!jp_status) {
                BinaryPjax.load(Url.defaultRedirectUrl());
                return;
            }

            $container    = $('#knowledge-test-container');
            $header       = $container.find('#knowledge-test-header');
            $message      = $container.find('#knowledge-test-msg');
            $questions    = $container.find('#knowledge-test-questions');
            $instructions = $container.find('#knowledge-test-instructions');

            // show knowledge test link in header after updated get_settings call
            Header.upgradeMessageVisibility();

            switch (jp_status.status) {
                case 'jp_knowledge_test_pending':
                    populateQuestions();
                    break;
                case 'jp_knowledge_test_fail': {
                    if (Date.now() >= (jp_status.next_test_epoch * 1000)) {
                        // show Knowledge Test cannot be taken
                        populateQuestions();
                    } else {
                        showDisallowedMsg(jp_status);
                    }
                    break;
                }
                default: {
                    window.location.href = Url.defaultRedirectUrl(); // needs to be loaded without pjax
                }
            }
        });
    };

    const populateQuestions = () => {
        random_picks = randomPick20();
        random_picks.reduce((a, b) => a.concat(b))
            .forEach((question) => { obj_random_picks[question.id] = question; });

        showQuestionsTable();
    };

    const randomPick20 = () => {
        const questions = {};
        // retrieve questions text from html
        $container.find('#data-questions').find('> div').each(function() { // sections
            const category = +$(this).attr('data-section-id');
            questions[`section${category}`] = [];

            $(this).find('> div').each(function() { // questions
                const question_id = +$(this).attr('data-question-id');
                questions[`section${category}`].push({
                    category          : category,
                    id                : question_id,
                    question          : $(this).attr('data-question-en'),
                    question_localized: $(this).text(),
                    correct_answer    : answers[question_id],
                    tooltip           : $(this).attr('data-tip'),
                });
            });
        });

        const picked_questions = [];
        Object.keys(questions).forEach(section => picked_questions.push(randomPick4(questions[section])));
        return picked_questions;
    };

    const randomPick4 = (obj_questions) => {
        const availables = Object.keys(obj_questions);

        const random_picks_four = [];
        for (let i = 0; i < 4; i++) {
            const random_index = Math.floor(Math.random() * 100) % availables.length;
            random_picks_four.push(obj_questions[availables[random_index]]);
            availables.splice(random_index, 1);
        }

        return random_picks_four;
    };

    const answers = {
        /* eslint-disable */
        1: false,  2: true,   3: true,   4: true,   5: true,   6: true,   7: true,   8: true,   9: false,   10: true,
        11: false, 12: true,  13: false, 14: true,  15: true,  16: true,  17: false, 18: true,  19: true,   20: true,
        21: true,  22: false, 23: true,  24: false, 25: false, 26: true,  27: true,  28: true,  29: true,   30: true,
        31: false, 32: true,  33: false, 34: true,  35: false, 36: true,  37: true,  38: false, 39: true,   40: false,
        41: false, 42: true,  43: true,  44: true,  45: true,  46: true,  47: true,  48: false, 49: false,  50: true,
        51: false, 52: true,  53: true,  54: false, 55: true,  56: true,  57: true,  58: true,  59: true,   60: true,
        61: true,  62: false, 63: true,  64: true,  65: true,  66: false, 67: true,  68: true,  69: true,   70: true,
        71: true,  72: true,  73: true,  74: false, 75: false, 76: true,  77: false, 78: true,  79: true,   80: true,
        81: true,  82: true,  83: true,  84: true,  85: true,  86: true,  87: true,  88: false, 89: true,   90: true,
        91: true,  92: true,  93: true,  94: true,  95: false, 96: true,  97: true,  98: false, 99: true,  100: true,
        /* eslint-enable */
    };

    const showQuestionsTable = () => {
        for (let j = 0; j < random_picks.length; j++) {
            const table = KnowledgeTestUI.createQuestionTable(random_picks[j]);
            $container.find(`#section${(j + 1)}-question`).append(table);
        }

        $questions.find('input[type=radio]').click(questionAnswerHandler);
        $container.find('#knowledge-test-submit').click(submitHandler);
        showMessage('{JAPAN ONLY}Please complete the following questions.', 1);
    };

    const questionAnswerHandler = (ev) => { submitted[ev.target.name] = +ev.target.value === 1; };

    const submitHandler = () => {
        if (submit_completed) return;

        const answered_qid = Object.keys(submitted).map(k => +k);
        if (answered_qid.length !== 20) {
            $instructions.setVisibility(0);
            $message.addClass('notice-msg').text(localize('You need to finish all 20 questions.'));

            const unanswered = random_picks
                .reduce((a, b) => a.concat(b))
                .find(q => answered_qid.indexOf(q.id) === -1).id;

            $.scrollTo(`a[name="${unanswered}"]`, 500, { offset: -10 });
            return;
        }

        // compute score
        const questions = [];
        Object.keys(submitted).forEach((k) => {
            const question_info = obj_random_picks[k];
            const score = submitted[k] === question_info.correct_answer ? 1 : 0;
            result_score += score;
            question_info.answer = submitted[k];
            questions.push({
                category: question_info.category,
                id      : question_info.id,
                question: question_info.question,
                answer  : question_info.answer ? 1 : 0,
                pass    : score,
            });
        });
        sendResult(questions);
        submit_completed = true;
    };

    const sendResult = (questions) => {
        BinarySocket.send({
            jp_knowledge_test: 1,
            score            : result_score,
            status           : result_score >= passing_score ? 'pass' : 'fail',
            questions        : questions,
        }).then((response) => {
            if (!response.error) {
                showResult(result_score, response.jp_knowledge_test.test_taken_epoch * 1000);
                $.scrollTo('body', 500);
                BinarySocket.send({ get_settings: 1 }, { forced: true }).then(() => {
                    Header.upgradeMessageVisibility();
                });
            } else if (response.error.code === 'TestUnavailableNow') {
                showMessage('{JAPAN ONLY}The test is unavailable now, test can only be taken again on next business day with respect of most recent test.');
            } else {
                $('#form-msg').html(response.error.message).setVisibility(1);
                submit_completed = false;
            }
        });
    };

    const showResult = (score, time) => {
        $header.text(localize('{JAPAN ONLY}Knowledge Test Result'));
        showMessage(score >= passing_score ? msg_pass : msg_fail);
        $container.append(KnowledgeTestUI.createResultUI(score, time));

        // affiiates measure of fulfillment (TCS-ASP)
        if (score >= passing_score && Cookies.get('affiliate_tracking')) {
            $message.append(
                $('<img/>', { src: `https://www.tcs-asp.net/aresult?LC=BINARY1&NK=${Client.get('loginid')}` }).setVisibility(0));
        }
    };

    const showMessage = (msg, set_visible = 0) => {
        $instructions.setVisibility(set_visible);
        $questions.setVisibility(set_visible);
        $message.text(localize(msg));
    };

    const showDisallowedMsg = jp_status => (
        showMessage(localize('{JAPAN ONLY}Dear customer, you are not allowed to take knowledge test until [_1]. Last test taken at [_2].', [
            toJapanTimeIfNeeded(jp_status.next_test_epoch),
            toJapanTimeIfNeeded(jp_status.last_test_epoch),
        ]))
    );

    return {
        onLoad: onLoad,
    };
})();

module.exports = KnowledgeTest;
