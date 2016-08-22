var KnowledgeTest = require('./knowledge_test/knowledge_test.init');

pjax_config_page_require_auth("new_account/knowledge_testws", function(){
    return {
        onLoad: function() {
            KnowledgeTest.init();
        }
    };
});
