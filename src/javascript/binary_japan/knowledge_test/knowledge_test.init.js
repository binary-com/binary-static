const toJapanTimeIfNeeded = require('../../binary/base/clock').Clock.toJapanTimeIfNeeded;
const KnowledgeTestUI     = require('./knowledge_test.ui').KnowledgeTestUI;
const KnowledgeTestData   = require('./knowledge_test.data').KnowledgeTestData;
const localize = require('../../binary/base/localize').localize;
const url_for  = require('../../binary/base/url').url_for;
const Client   = require('../../binary/base/client').Client;
const Header   = require('../../binary/base/header').Header;

const KnowledgeTest = (function() {
    'use strict';

    const hiddenClass = 'invisible';

    const submitted = {};
    let submitCompleted = false;
    let randomPicks = [];
    const randomPicksObj = {};
    let resultScore = 0;

    const passMsg = '{JAPAN ONLY}Congratulations, you have pass the test, our Customer Support will contact you shortly.';
    const failMsg = '{JAPAN ONLY}Sorry, you have failed the test, please try again after 24 hours.';

    const questionAnswerHandler = function(ev) {
        const selected = ev.target.value;
        const qid = ev.target.name;
        submitted[qid] = selected === '1';
    };

    const submitHandler = function() {
        if (submitCompleted) {
            return;
        }
        const answeredQid = Object.keys(submitted).map(function(k) { return +k; });
        if (answeredQid.length !== 20) {
            $('#knowledge-test-instructions').addClass('invisible');
            $('#knowledge-test-msg')
                .addClass('notice-msg')
                .text(localize('You need to finish all 20 questions.'));

            const unAnswered = randomPicks.reduce((a, b) => a.concat(b))
                                        .find(q => answeredQid.indexOf(q.id) === -1).id;

            $.scrollTo('a[name="' + unAnswered + '"]', 500, { offset: -10 });
            return;
        }

        // compute score
        const questions = [];
        Object.keys(submitted).forEach(function (k) {
            const questionInfo = randomPicksObj[k],
                score = submitted[k] === questionInfo.correct_answer ? 1 : 0;
            resultScore += score;
            questionInfo.answer = submitted[k];
            questions.push({
                category: questionInfo.category,
                id      : questionInfo.id,
                question: questionInfo.question,
                answer  : questionInfo.answer ? 1 : 0,
                pass    : score,
            });
        });
        KnowledgeTestData.sendResult(questions, resultScore);
        submitCompleted = true;
    };

    const showQuestionsTable = function() {
        for (let j = 0; j < randomPicks.length; j++) {
            const table = KnowledgeTestUI.createQuestionTable(randomPicks[j]);
            $('#section' + (j + 1) + '-question').append(table);
        }

        const $questions = $('#knowledge-test-questions');
        $questions.find('input[type=radio]').click(questionAnswerHandler);
        $('#knowledge-test-submit').click(submitHandler);
        $questions.removeClass(hiddenClass);
        $('#knowledge-test-msg').text(localize('{JAPAN ONLY}Please complete the following questions.'));
        $('#knowledge-test-instructions').removeClass('invisible');
    };

    const showResult = function(score, time) {
        $('#knowledge-test-instructions').addClass('invisible');
        $('#knowledge-test-header').text(localize('{JAPAN ONLY}Knowledge Test Result'));
        let msg;
        if (score >= 14) {
            msg = passMsg;
            Client.set('jp_status', 'jp_activation_pending');
            // send some dummy string just to go through the function
            Header.topbar_message_visibility('show_jp_message');
        } else {
            msg = failMsg;
        }
        $('#knowledge-test-msg').text(localize(msg));

        const $resultTable = KnowledgeTestUI.createResultUI(score, time);

        $('#knowledge-test-container').append($resultTable);
        $('#knowledge-test-questions').addClass(hiddenClass);
    };

    const showMsgOnly = function(msg) {
        $('#knowledge-test-questions').addClass(hiddenClass);
        $('#knowledge-test-msg').text(localize(msg));
        $('#knowledge-test-instructions').addClass('invisible');
    };

    const showDisallowedMsg = function(jpStatus) {
        const msgTemplate =
            '{JAPAN ONLY}Dear customer, you are not allowed to take knowledge test until [_1]. Last test taken at [_2].';

        const msg = localize(msgTemplate, [
            toJapanTimeIfNeeded(jpStatus.next_test_epoch),
            toJapanTimeIfNeeded(jpStatus.last_test_epoch),
        ]);

        showMsgOnly(msg);
    };

    const showCompletedMsg = function() {
        const msg = "{JAPAN ONLY}Dear customer, you've already completed the knowledge test, please proceed to next step.";
        showMsgOnly(msg);
    };

    const populateQuestions = function() {
        randomPicks = KnowledgeTestData.randomPick20();
        randomPicks.reduce((a, b) => a.concat(b))
                   .forEach((question) => { randomPicksObj[question.id] = question; });

        showQuestionsTable();
    };

    const init = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                const type = response.msg_type;
                const passthrough = response.echo_req.passthrough && response.echo_req.passthrough.key;

                if (type === 'get_settings' && passthrough === 'knowledgetest') {
                    const jpStatus = response.get_settings.jp_account_status;

                    if (!jpStatus) {
                        window.location.href = url_for('/');
                        return;
                    }

                    switch (jpStatus.status) {
                        case 'jp_knowledge_test_pending': populateQuestions();
                            break;
                        case 'jp_knowledge_test_fail': {
                            if (Date.now() >= (jpStatus.next_test_epoch * 1000)) {
                                // show Knowledge Test cannot be taken
                                populateQuestions();
                            } else {
                                showDisallowedMsg(jpStatus);
                            }
                            break;
                        }
                        case 'jp_activation_pending':
                            showCompletedMsg();
                            break;
                        default: {
                            console.warn('Unexpected jp status');
                            window.location.href = url_for('/');
                        }
                    }
                } else if (type === 'jp_knowledge_test') {
                    if (!response.error) {
                        showResult(resultScore, response.jp_knowledge_test.test_taken_epoch * 1000);
                        $('html, body').animate({ scrollTop: 0 }, 'slow');

                        $('#knowledgetest-link').addClass(hiddenClass);     // hide it anyway
                    } else if (response.error.code === 'TestUnavailableNow') {
                        showMsgOnly('{JAPAN ONLY}The test is unavailable now, test can only be taken again on next business day with respect of most recent test.');
                    } else {
                        $('#form-msg').html(response.error.message).removeClass(hiddenClass);
                        submitCompleted = false;
                    }
                }
            },
        });

        BinarySocket.send({ get_settings: 1, passthrough: { key: 'knowledgetest' } });
    };

    return {
        init: init,
    };
})();

module.exports = {
    KnowledgeTest: KnowledgeTest,
};
