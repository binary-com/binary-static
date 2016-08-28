var KnowledgeTest = require('./knowledge_test/knowledge_test.init');
var pjax_config_page_require_auth = require('base/pjax').pjax_config_page_require_auth;

pjax_config_page_require_auth("new_account/knowledge_testws", function(){
    return {
        onLoad: function() {
            KnowledgeTest.init();
        }
    };
});
