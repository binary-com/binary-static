const Endpoint                      = require('./endpoint').Endpoint;
const GetStartedJP                  = require('./get_started_jp').GetStartedJP;
const JobDetails                    = require('./job_details').JobDetails;
const Platforms                     = require('./platforms').Platforms;
const Regulation                    = require('./regulation').Regulation;
const Scroll                        = require('../common_functions/scroll').Scroll;
const GetStarted                    = require('./get_started').GetStarted;
const Contact                       = require('./contact').Contact;
const Careers                       = require('./careers').Careers;
const Home                          = require('./home').Home;
const WhyUs                         = require('./why_us').WhyUs;
const CharityPage                   = require('./charity').CharityPage;
const TermsAndConditions            = require('./tnc').TermsAndConditions;
const CashierJP                     = require('../../binary_japan/cashier').CashierJP;
const LoggedInHandler               = require('../base/logged_in').LoggedInHandler;
const pjax_config_page_require_auth = require('../base/pjax').pjax_config_page_require_auth;
const pjax_config_page              = require('../base/pjax').pjax_config_page;

pjax_config_page('/home', function() {
    return {
        onLoad: function() {
            Home.init();
        },
    };
});

pjax_config_page('/why-us', function() {
    return {
        onLoad: function() {
            WhyUs.init();
        },
        onUnload: function() {
            Scroll.offScroll();
        },
    };
});

pjax_config_page('/volidx-markets', function() {
    return {
        onLoad: function() {
            Scroll.goToHashSection();
        },
        onUnload: function() {
            Scroll.offScroll();
        },
    };
});

pjax_config_page('/open-source-projects', function() {
    return {
        onLoad: function() {
            Scroll.sidebar_scroll($('.open-source-projects'));
        },
        onUnload: function() {
            Scroll.offScroll();
        },
    };
});

pjax_config_page('/payment-agent', function() {
    return {
        onLoad: function() {
            Scroll.sidebar_scroll($('.payment-agent'));
        },
        onUnload: function() {
            Scroll.offScroll();
        },
    };
});

pjax_config_page('/get-started', function() {
    return {
        onLoad: function() {
            GetStarted.get_started_behaviour();
        },
        onUnload: function() {
            Scroll.offScroll();
        },
    };
});

pjax_config_page('/contact', function() {
    return {
        onLoad: function() {
            Contact.init();
        },
    };
});

pjax_config_page('/careers', function() {
    return {
        onLoad: function() {
            Careers.display_career_email();
        },
    };
});


pjax_config_page('/charity', function() {
    return {
        onLoad  : CharityPage.onLoad,
        onUnload: CharityPage.onUnload,
    };
});

pjax_config_page('/terms-and-conditions', function() {
    return {
        onLoad: function() {
            TermsAndConditions.init();
        },
        onUnload: function() {
            Scroll.offScroll();
        },
    };
});

pjax_config_page('/platforms', function() {
    return {
        onLoad: function() {
            Platforms.init();
        },
        onUnload: function () {
            Platforms.unload();
        },
    };
});

pjax_config_page_require_auth('/cashier/deposit-jp', function() {
    return {
        onLoad: function() {
            CashierJP.init('deposit');
        },
    };
});

pjax_config_page_require_auth('/cashier/withdraw-jp', function() {
    return {
        onLoad: function() {
            CashierJP.init('withdraw');
        },
    };
});

pjax_config_page('/endpoint', function() {
    return {
        onLoad: function() {
            Endpoint.init();
        },
    };
});

pjax_config_page('/get-started-jp', function() {
    return {
        onLoad: function() {
            GetStartedJP.init();
        },
        onUnload: function () {
            GetStartedJP.unload();
        },
    };
});

pjax_config_page('/open-positions', function() {
    return {
        onLoad: function() { if (/\/open-positions\.html/.test(window.location.pathname)) Scroll.scrollToHashSection(); },
    };
});

pjax_config_page('/open-positions/job-details', function() {
    return {
        onLoad: function() {
            JobDetails.init();
            JobDetails.addEventListeners();
        },
        onUnload: function () {
            JobDetails.removeEventListeners();
        },
    };
});

pjax_config_page('/regulation', function() {
    return {
        onLoad: function() {
            Regulation.init();
        },
    };
});

pjax_config_page('/logged_inws', function() {
    return {
        onLoad: function() {
            LoggedInHandler.init();
        },
    };
});
