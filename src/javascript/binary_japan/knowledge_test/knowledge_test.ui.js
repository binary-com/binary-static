const moment   = require('moment');
const localize = require('../../binary/base/localize').localize;

const KnowledgeTestUI = (function () {
    'use strict';

    const createTrueFalseBox = function(question, showAnswer) {
        const qid = question.id;
        const trueId = qid + 'true';
        const falseId = qid + 'false';

        const $trueButton = $('<input />', {
            type : 'radio',
            name : qid,
            id   : trueId,
            value: '1',
        });
        // var $trueLabel = $('<label></label>', {class: 'img-holder true', for: trueId, value: '1'});
        const $trueTd = $('<td></td>').append($trueButton);

        const $falseButton = $('<input />', {
            type : 'radio',
            name : qid,
            id   : falseId,
            value: '0',
        });
        // var $falseLabel = $('<label></label>', {class: 'img-holder false', for: falseId, value: '0'});
        const $falseTd = $('<td></td>').append($falseButton);

        if (showAnswer) {
            if (question.correct_answer) {
                $trueButton.prop('checked', true);
            } else {
                $falseButton.prop('checked', true);
            }
            $trueButton.attr('disabled', true);
            $falseButton.attr('disabled', true);
        }

        return [$trueTd, $falseTd];
    };

    const createQuestionRow = function(questionNo, question, showAnswer) {
        const $questionRow = $('<tr></tr>', { id: questionNo, class: 'question' });
        const $questionData = $('<td></td>').text(localize(question.question_localized));
        const $questionLink = $('<a></a>', { name: question.id });
        $questionData.prepend($questionLink);

        const trueFalse = createTrueFalseBox(question, showAnswer);

        return $questionRow
            .append($questionData)
            .append(trueFalse[0])
            .append(trueFalse[1]);
    };

    const createQuestionTable = function(questions, showAnswer) {
        const $header = $('<tr></tr>');
        const $questionColHeader = $('<th></th>', { id: 'question-header', class: 'question-col' })
            .text(localize('Questions'));

        const $trueColHeader = $('<th></th>', { id: 'true-header', class: 'true-col' })
            .text(localize('True'));

        const $falseColHeader = $('<th></th>', { id: 'fasle-header', class: 'false-col' })
            .text(localize('False'));

        $header
            .append($questionColHeader)
            .append($trueColHeader)
            .append($falseColHeader);

        const $tableContainer = $('<table></table>', { id: 'knowledge-test' });

        $tableContainer.append($header);
        let qr;
        questions.forEach(function(question, questionNo) {
            qr = createQuestionRow(questionNo, question, showAnswer);
            $tableContainer.append(qr);
        });

        return $tableContainer;
    };

    // function createResultUI(score, time) {
    const createResultUI = function(score) {
        const $resultTable = $('<table></table>', { class: 'kv-pairs' });
        const $scoreRow = $('<tr></tr>').append($('<td>' + localize('Score') + '</td>')).append($('<td>' + score + '</td>'));

        const date = moment();
        const submitDate = moment.utc(date).format('YYYY') + localize('Year') + moment.utc(date).format('MM') + localize('Month') + moment.utc(date).format('DD') + localize('Day') + ' (' + localize('Weekday') + ')';

        const $dateRow = $('<tr></tr>').append($('<td>' + localize('Date') + '</td>')).append($('<td>' + submitDate + '</td>'));

        $resultTable.append($scoreRow).append($dateRow);

        return $resultTable;
    };

    const createAlreadyCompleteDiv = function() {
        const msg = "{JAPAN ONLY}Dear customer, you've already completed the knowledge test, please proceed to next step.";
        return $('<div></div>').text(localize(msg));
    };

    return {
        createTrueFalseBox      : createTrueFalseBox,
        createQuestionRow       : createQuestionRow,
        createQuestionTable     : createQuestionTable,
        createResultUI          : createResultUI,
        createAlreadyCompleteDiv: createAlreadyCompleteDiv,
    };
})();

module.exports = {
    KnowledgeTestUI: KnowledgeTestUI,
};
