var KnowledgeTest = (function() {
    "use strict";

    var hiddenClass = 'invisible';

    var submitted = {};
    var randomPicks = [];
    var randomPicksAnswer = {};
    var resultScore = 0;

    var passMsg = '{JAPAN ONLY}Congratulations, you have pass the test, our Customer Support will contact you shortly';
    var failMsg = '{JAPAN ONLY}Sorry, you have failed the test, please try again after 24 hours.';

    function questionAnswerHandler(ev) {
        var selected = ev.target.value;
        var qid = ev.target.name;
        submitted[qid] = selected === '1';
    }

    function submitHandler() {
        var answeredQid = Object.keys(submitted).map(function(k) {return +k;});
        if (answeredQid.length !== 20) {
            $('#knowledge-test-msg')
                .addClass('notice-msg')
                .text(text.localize('You need to finish all 20 questions.'));

            // $("html, body").animate({ scrollTop: 0 }, "slow");

            var allQid = [].concat.apply([], randomPicks).map(function(q) {
                return q.id;
            });
            var unAnswered = allQid.find(function(q){
                return answeredQid.indexOf(q) === -1;
            });
            window.location.href = '#' + unAnswered;
            return;
        }

        // compute score
        for (var k in submitted) {
            if (submitted.hasOwnProperty(k)) {
                resultScore += submitted[k] === randomPicksAnswer[k] ? 1 : 0;
            }
        }
        KnowledgeTestData.sendResult(resultScore);
    }

    function showQuestionsTable() {
        for (var j = 0 ; j < randomPicks.length ; j ++) {
            var table = KnowledgeTestUI.createQuestionTable(randomPicks[j]);
            $('#section' + (j + 1) + '-question').append(table);
        }

        $('#knowledge-test-questions input[type=radio]').click(questionAnswerHandler);
        $('#knowledge-test-submit').click(submitHandler);
        $('#knowledge-test-questions').removeClass(hiddenClass);
        $('#knowledge-test-msg').text(text.localize('{JAPAN ONLY}Please complete the following questions.'));
    }

    function showResult(score, time) {
        $('#knowledge-test-header').text(text.localize('{JAPAN ONLY}Knowledge Test Result'));
        if (score >= 14) {
            $('#knowledge-test-msg').text(text.localize(passMsg));
        } else {
            $('#knowledge-test-msg').text(text.localize(failMsg));
        }

        var $resultTable = KnowledgeTestUI.createResultUI(score, time);

        $('#knowledge-test-container').append($resultTable);
        $('#knowledge-test-questions').addClass(hiddenClass);
    }

    function showMsgOnly(msg) {
        $('#knowledge-test-questions').addClass(hiddenClass);
        $('#knowledge-test-msg').text(text.localize(msg));
    }

    function showDisallowedMsg(jpStatus) {
        var nextTestEpoch = jpStatus.next_test_epoch;
        var lastTestEpoch = jpStatus.last_test_epoch;

        var nextTestDate = new Date(nextTestEpoch * 1000);
        var lastTestDate = new Date(lastTestEpoch * 1000);

        var msgTemplate =
            '{JAPAN ONLY}Dear customer, you are not allowed to take knowledge test until [_1].\nLast test taken at [_2].';

        var msg = text.localize(msgTemplate)
            .replace('[_1]', nextTestDate.toUTCString())
            .replace('[_2]', lastTestDate.toUTCString());

        showMsgOnly(msg);
    }

    function showCompletedMsg() {
        var msg = "{JAPAN ONLY}Dear customer, you've already completed the knowledge test, please proceed to next step.";
        showMsgOnly(msg);
    }

    function populateQuestions() {
        randomPicks = KnowledgeTestData.randomPick20();
        for (var i = 0 ; i < 5 ; i ++) {
            for ( var k = 0 ; k < 4 ; k++) {
                var qid = randomPicks[i][k].id;
                var ans = randomPicks[i][k].answer;

                randomPicksAnswer[qid] = ans;
            }
        }

        showQuestionsTable();
    }

    function init() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                var type = response.msg_type;

                var passthrough = response.echo_req.passthrough && response.echo_req.passthrough.key;

                if (type === 'get_settings' && passthrough === 'knowledgetest') {
                    var jpStatus = response.get_settings.jp_account_status;

                    if (!jpStatus) {
                        window.location.href = page.url.url_for('/');
                        return;
                    }

                    switch(jpStatus.status) {
                        case 'jp_knowledge_test_pending': populateQuestions();
                            break;
                        case 'jp_knowledge_test_fail': if (Date.now() >= (jpStatus.next_test_epoch * 1000)) {
                            // show Knowledge Test cannot be taken
                            populateQuestions();
                        } else {
                            showDisallowedMsg(jpStatus);
                        }
                            break;
                        case 'jp_activation_pending': showCompletedMsg();
                            break;
                        default: {
                            console.warn('Unexpected jp status');
                            window.location.href = page.url.url_for('/');
                        }
                    }
                } else if (type === 'jp_knowledge_test') {
                    if (!response.error) {
                        showResult(resultScore, response.jp_knowledge_test.test_taken_epoch * 1000);
                        $("html, body").animate({ scrollTop: 0 }, "slow");

                        $('#knowledgetest-link').addClass(hiddenClass);     // hide it anyway
                        localStorage.setItem('jp_test_allowed', 0);
                    } else if (response.error.code === 'TestUnavailableNow') {
                        showMsgOnly('{JAPAN ONLY}The test is unavailable now, test can only be taken again on next business day with respect of most recent test.');
                    }
                }
            }
        });

        BinarySocket.send({get_settings: 1, passthrough: {key: 'knowledgetest'}});
    }

    function showKnowledgeTestTopBarIfValid(jpStatus) {
        if (!jpStatus) {
            return;
        }
        switch (jpStatus.status) {
            case 'jp_knowledge_test_pending': KnowledgeTestUI.createKnowledgeTestLink();
                break;
            case 'jp_knowledge_test_fail': if (Date.now() >= (jpStatus.next_test_epoch * 1000)) {
                KnowledgeTestUI.createKnowledgeTestLink();
            }
                break;
            case 'jp_activation_pending': $('#topbar-msg').children('a').addClass(hiddenClass);
                break;
            default: return;
        }
    }

    return {
        init: init,
        showKnowledgeTestTopBarIfValid: showKnowledgeTestTopBarIfValid
    };
}());
