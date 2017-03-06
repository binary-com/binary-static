const moment   = require('moment');
const localize = require('../../binary/base/localize').localize;

const KnowledgeTestUI = (() => {
    'use strict';

    const createTrueFalseBox = (question, show_answer) => {
        const qid = question.id;
        const true_id = qid + 'true';
        const false_id = qid + 'false';

        const $true_button = $('<input />', {
            type : 'radio',
            name : qid,
            id   : true_id,
            value: '1',
        });
        const $true_td = $('<td></td>').append($true_button);

        const $false_button = $('<input />', {
            type : 'radio',
            name : qid,
            id   : false_id,
            value: '0',
        });
        const $false_td = $('<td></td>').append($false_button);

        if (show_answer) {
            if (question.correct_answer) {
                $true_button.prop('checked', true);
            } else {
                $false_button.prop('checked', true);
            }
            $true_button.attr('disabled', true);
            $false_button.attr('disabled', true);
        }

        return [$true_td, $false_td];
    };

    const createQuestionRow = (question_no, question, show_answer) => {
        const $question_row = $('<tr></tr>', { id: question_no, class: 'question' });
        const $question_data = $('<td></td>').text(localize(question.question_localized));
        const $question_link = $('<a></a>', { name: question.id });
        $question_data.prepend($question_link);

        const true_false = createTrueFalseBox(question, show_answer);

        return $question_row
            .append($question_data)
            .append(true_false[0])
            .append(true_false[1]);
    };

    const createQuestionTable = (questions, show_answer) => {
        const $header = $('<tr></tr>');
        const $question_col_header = $('<th></th>', { id: 'question-header', class: 'question-col' })
            .text(localize('Questions'));

        const $true_col_header = $('<th></th>', { id: 'true-header', class: 'true-col' })
            .text(localize('True'));

        const $false_col_header = $('<th></th>', { id: 'fasle-header', class: 'false-col' })
            .text(localize('False'));

        $header
            .append($question_col_header)
            .append($true_col_header)
            .append($false_col_header);

        const $table_container = $('<table></table>', { id: 'knowledge-test' });

        $table_container.append($header);
        let qr;
        questions.forEach(function(question, question_no) {
            qr = createQuestionRow(question_no, question, show_answer);
            $table_container.append(qr);
        });

        return $table_container;
    };

    const createResultUI = (score) => {
        const $result_table = $('<table></table>', { class: 'kv-pairs' });
        const $score_row = $('<tr></tr>').append($('<td>' + localize('Score') + '</td>')).append($('<td>' + score + '</td>'));

        const date = moment();
        const submit_date = moment.utc(date).format('YYYY') + localize('Year') + moment.utc(date).format('MM') + localize('Month') + moment.utc(date).format('DD') + localize('Day') + ' (' + localize('Weekday') + ')';

        const $date_row = $('<tr></tr>').append($('<td>' + localize('Date') + '</td>')).append($('<td>' + submit_date + '</td>'));

        $result_table.append($score_row).append($date_row);

        return $result_table;
    };

    return {
        createQuestionTable: createQuestionTable,
        createResultUI     : createResultUI,
    };
})();

module.exports = KnowledgeTestUI;
