#!/usr/bin/perl

use strict;
use warnings;

sub all_pages {
    return (
        # url pathname,                template file path,             layout,       title,        exclude languages
        ['home',                       'home/index',                   'full_width', 'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices'],
        ['404',                        'static/404',                   'default',    '404'],
        ['why-us',                     'static/why_us',                'full_width', 'Why Us'],
        ['tour',                       'static/tour',                  'full_width', 'Tour'],
        ['responsible-trading',        'static/responsible_trading',   'full_width', 'Responsible Trading', 'ja'],
        ['terms-and-conditions',       'legal/tac',                    'default',    'Terms and Conditions'],
        ['terms-and-conditions-jp',    'japan/legal/tacjp',            'default',    'Terms and Conditions'],
        ['styles',                     'home/styles',                  'full_width', 'Styles'],
        ['affiliate/signup',           'affiliates/signup',            'default',    'Affiliate',           'ja'],
        ['user/browser-support',       'misc/logintrouble',            'default',    'Login trouble'],
        ['endpoint',                   'misc/endpoint',                'default',    'Endpoint'],
        ['legal/us_patents',           'legal/us_patents',             'default',    'US Patents',          'ja'],
        ['cashier',                    'cashier/index',                'default',    'Cashier'],
        ['cashier/payment_methods',    'cashier/payment_methods',      'default',    'Payment Methods',     'ja'],

        ['about-us',                   'about/index',                  'full_width', 'About Us'],
        ['group-information',          'about/group-information',      'default',    'Group Information'],
        ['group-history',              'about/group_history',          'full_width', 'Group History'],
        ['contact',                    'about/contact',                'full_width', 'Contact Us'],
        ['careers',                    'about/careers',                'full_width', 'Careers', 'ja'],
        ['open-positions',             'about/job_descriptions',       'full_width', 'Open Positions'],
        ['open-positions/job-details', 'about/job_details',            'full_width', 'Job Details'],
        ['company-profile',            'japan/company_profile',        'defualt',    'Company Profile'],

        ['open-source-projects',       'partners/open_source_projects',  'full_width', 'Open-Source Projects'],
        ['partners',                   'partners/partners',              'full_width', 'Partners', 'ja'],
        ['payment-agent',              'partners/payment_agent',         'full_width', 'Payment Agents'],
        ['user-testing',               'partners/user_testing',          'full_width', 'Sign Up to Test Our Platform'],

        ['get-started',                              'get_started/index',                         'get_started', 'Get Started'],
        ['get-started/what-is-binary-trading',       'get_started/what_is_binary_trading',        'get_started', 'Why Choose Binary Trading?'],
        ['get-started/types-of-trades',              'get_started/types_of_trades',               'get_started', 'Types of Trades'],
        ['get-started/binary-options-basics',        'get_started/binary_options_basics',         'get_started', 'Binary Options Basics'],
        ['get-started/benefits-of-trading-binaries', 'get_started/benefits_of_trading_binaries',  'get_started', 'Benefits of Binary Trading'],
        ['get-started/how-to-trade-binaries',        'get_started/how_to_trade_binaries',         'get_started', 'How to Trade Binaries?'],
        ['get-started/volidx-markets',               'get_started/volidx_markets',                'get_started', 'Volatility Index Markets'],
        ['get-started/spread',                       'get_started/spread_bets',                   'get_started', 'Spreads'],
        ['get-started/smart-indices',                'get_started/smart_indices',                 'get_started', 'Smart Indices'],
        ['get-started/otc-indices-stocks',           'get_started/otc_indices_stocks',            'get_started', 'What Are OTC Indices and Stocks?'],
        ['get-started/beginners-faq',                'get_started/beginners_faq',                 'get_started', 'FAQ'],
        ['get-started/glossary',                     'get_started/glossary',                      'get_started', 'Glossary'],

        ['get-started-jp', 'japan/get_started',  'default', 'Get Started'],

        ## ws
        ['user/authenticatews',          'user/authenticatews',                       'default', 'Authenticate', 'ja'],
        ['cashier/forwardws',            'cashier/deposit_withdraw_ws',               'default', 'Cashier'],
        ['user/security/limitsws',       'user/security/limitsws',                    'default', 'Account Limits'],
        ['account/account_transferws',   'cashier/account_transferws',                'default', 'Account Transfer'],
        ['cashier/payment_agent_listws', 'cashier/payment_agent_listws',              'default', 'Payment Agent Deposit'],
        ['cashier/top_up_virtualws',     'user/top_up_virtualws',                     'default', 'Give Me More Money!'],
        ['paymentagent/transferws',      'cashier/paymentagent_transferws',           'default', 'Payment Agent Transfer'],
        ['paymentagent/withdrawws',      'cashier/paymentagent_withdrawws',           'default', 'Payment Agent Withdrawal'],

        ['jptrading', 'bet/japan',   'default', 'Sharp Prices. Smart Trading.'],
        ['trading',   'bet/static',  'default', 'Sharp Prices. Smart Trading.'],

        ['new_account/virtualws',        'new_account/virtualws',       'default', 'Create New Account'],
        ['new_account/realws',           'new_account/realws',          'default', 'Real Money Account Opening'],
        ['new_account/japanws',          'new_account/japanws',         'default', 'Real Money Account Opening'],
        ['new_account/maltainvestws',    'new_account/maltainvestws',   'default', 'Financial Account Opening'],
        ['new_account/knowledge_testws', 'japan/knowledge_test',        'default', 'Real Money Account Opening'],

        ['resources',                'resources/index',           'default', 'Resources'],
        ['resources/asset_indexws',  'resources/asset_indexws',   'default', 'Asset Index', 'ja'],
        ['resources/market_timesws', 'resources/market_timesws',  'default', 'Trading Times'],

        ['user/security/api_tokenws',       'user/security/api_tokenws',                      'default', 'API Token',               'ja'],
        ['user/metatrader',                 'user/metatrader',                                'default', 'MetaTrader'],
        ['user/security/change_passwordws', 'user/security/change_passwordws',                'default', 'Change Password'],
        ['user/portfoliows',                'user/portfoliows',                               'default', 'Portfolio'],
        ['user/profit_tablews',             'user/profit_tablews',                            'default', 'Profit Table'],
        ['user/security/self_exclusionws',  'user/security/self_exclusionws',                 'default', 'Account Details'],
        ['user/security/cashier_passwordws','user/security/cashier_passwordws',               'default', 'Cashier Password'],
        ['user/statementws',                'user/statementws',                               'default', 'Statement'],
        ['user/settingsws',                 'user/settingsws',                                'default', 'Settings'],
        ['user/securityws',                 'user/securityws',                                'default', 'Security'],
        ['user/security/iphistoryws',       'user/security/iphistory',                        'default', 'Login History',           'ja'],
        ['user/tnc_approvalws',             'legal/tnc_approvalws',                           'default', 'Terms and Conditions Approval'],
        ['user/settings/detailsws',         'user/settings/detailsws',                        'default', 'Personal Details'],
        ['user/settings/assessmentws',      'user/settings/financial_assessmentws',           'default', 'Financial Assessment',    'ja'],
        ['user/lost_passwordws',            'user/lost_passwordws',                           'default', 'Password Reset'],
        ['user/reset_passwordws',           'user/reset_passwordws',                          'default', 'Password Reset'],
        ['user/security/authorised_appsws', 'user/security/authorised_appsws',                'default', 'Authorised Applications', 'ja'],
        ['user/reality_check_frequencyws',  'user/reality_check_frequencyws',                 'default', 'Reality Check'],
        ['user/reality_check_summaryws',    'user/reality_check_summaryws',                   'default', 'Reality Check'],

        ['metatrader',          'metatrader/index',    'default', 'Trading with MetaTrader 5'],
        ['metatrader/download', 'metatrader/download', 'default', 'Start Trading with MetaTrader 5'],

        ['logged_inws',           'global/logged_inws',  undef],
        ['trade/bet_explanation', 'bet/explanation',     undef],
    );
}

1;
