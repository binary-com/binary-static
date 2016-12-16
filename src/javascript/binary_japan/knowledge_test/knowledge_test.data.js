var KnowledgeTestData = (function() {
    "use strict";

    var answers   = {
            1: false,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            8: true,
            9: false,
            10: true,
            11: false,
            12: true,
            13: false,
            14: true,
            15: true,
            16: true,
            17: false,
            18: true,
            19: true,
            20: true,
            21: false,
            22: false,
            23: false,
            24: false,
            25: true,
            26: true,
            27: true,
            28: true,
            29: true,
            30: true,
            31: false,
            32: true,
            33: false,
            34: true,
            35: false,
            36: true,
            37: true,
            38: false,
            39: true,
            40: false,
            41: false,
            42: true,
            43: true,
            44: true,
            45: true,
            46: true,
            47: true,
            48: false,
            49: false,
            50: true,
            51: false,
            52: true,
            53: true,
            54: false,
            55: true,
            56: true,
            57: true,
            58: true,
            59: true,
            60: true,
            61: true,
            62: false,
            63: true,
            64: true,
            65: true,
            66: false,
            67: true,
            68: true,
            69: true,
            70: true,
            71: true,
            72: true,
            73: true,
            74: false,
            75: false,
            76: true,
            77: false,
            78: true,
            79: true,
            80: true,
            81: true,
            82: true,
            83: true,
            84: true,
            85: true,
            86: true,
            87: true,
            88: false,
            89: true,
            90: true,
            91: true,
            92: true,
            93: true,
            94: true,
            95: false,
            96: true,
            97: true,
            98: false,
            99: true,
            100: true,
        };

    function randomPick4(questions) {
        var availables = Object.keys(questions);

        var randomPicks = [];
        for (var i = 0 ; i < 4 ; i ++) {
            var randomIndex = Math.floor(Math.random() * 100) % availables.length;
            var randomQid = availables[randomIndex];
            var randomPick = questions[randomQid];
            randomPicks.push(randomPick);
            availables.splice(randomIndex, 1);
        }

        return randomPicks;
    }

    function randomPick20() {
        var questions = {};
        // retrieve questions text from html
        $('#data-questions > div').each(function() { // sections
            var section_id = +$(this).attr('data-section-id');
            questions['section' + section_id] = [];

            $(this).find('> div').each(function() { // questions
                var question_id = +$(this).attr('data-question-id');
                questions['section' + section_id].push({
                    section_id: section_id,
                    id        : question_id,
                    question  : $(this).text(),
                    answer    : answers[question_id],
                });
            });
        });

        var picked_questions = [];
        Object.keys(questions).forEach(function (section) {
            picked_questions.push(randomPick4(questions[section]));
        })
        return picked_questions;
    }

    function sendResult(results) {
        var status = results >= 14 ? 'pass' : 'fail';
        BinarySocket.send({jp_knowledge_test: 1, score: results, status: status});
    }

    return {
        randomPick20: randomPick20,
        sendResult  : sendResult
    };
})();

module.exports = {
    KnowledgeTestData: KnowledgeTestData,
};
