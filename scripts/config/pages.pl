#!/usr/bin/perl

use strict;
use warnings;

sub all_pages {
    return (
        # url pathname,                template file path,             layout,       title,                  exclude languages
        ['home',                       'home/index',                   'full_width', 'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices'],
        ['home-jp',                    'home/index_jp',                'full_width', 'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices', 'NOT-ja,en'],
        ['404',                        'static/404',                   'full_width', '404'],
        ['why-us',                     'static/why_us',                'full_width', 'Why Us',               'ja'],
        ['why-us-jp',                  'static/why_us_jp',             'full_width', 'Why Us',               'NOT-ja,en'],
        ['tour',                       'static/tour',                  'full_width', 'Tour',                 'ja'],
        ['tour-jp',                    'static/tour_jp',               'full_width', 'Tour',                 'NOT-ja,en'],
        ['platforms',                  'static/platforms',             'default',    'Platforms',            'ja'],
        ['responsible-trading',        'static/responsible_trading',   'full_width', 'Responsible Trading',  'ja'],
        ['terms-and-conditions',       'legal/tac',                    'default',    'Terms and Conditions', 'ja'],
        ['terms-and-conditions-jp',    'japan/legal/tacjp',            'default',    'Terms and Conditions', 'NOT-ja,en'],
        ['regulation',                 'legal/regulation',             'default',    'Regulation'],
        ['affiliate/signup',           'affiliates/signup',            'default',    'Affiliate',            'ja'],
        ['affiliate/signup-jp',        'japan/affiliates/signup',      'default',    'Affiliate',            'NOT-ja,en'],
        ['user/browser-support',       'misc/browser_support',         'default',    'Login trouble'],
        ['endpoint',                   'misc/endpoint',                'default',    'Endpoint'],
        ['legal/us_patents',           'legal/us_patents',             'default',    'US Patents',           'ja'],
        ['cashier',                    'cashier/index',                'default',    'Cashier'],
        ['cashier/payment_methods',    'cashier/payment_methods',      'default',    'Payment Methods',      'ja'],

        ['about-us',                   'about/index',                  'full_width', 'About Us'],
        ['group-history',              'about/group_history',          'full_width', 'Group History'],
        ['contact',                    'about/contact',                'full_width', 'Contact Us'],
        ['careers',                    'about/careers',                'full_width', 'Careers',               'ja'],
        ['careers-for-americans',      'about/careers_for_americans',  'full_width', 'Careers For Americans', 'ja'],
        ['open-positions',             'about/job_descriptions',       'full_width', 'Open Positions'],
        ['open-positions/job-details', 'about/job_details',            'full_width', 'Job Details'],
        ['company-profile',            'japan/company_profile',        'default',    'Company Profile',       'NOT-ja,en'],
        ['service-announcements',      'japan/service-announcements',  'default',    'Service Announcements', 'NOT-ja,en'],
        ['charity',                    'static/charity',               'default',    'Charity'],

        ['open-source-projects',       'partners/open_source_projects',  'full_width', 'Open-Source Projects'],
        ['partners',                   'partners/partners',              'full_width', 'Partners',              'ja'],
        ['payment-agent',              'partners/payment_agent',         'full_width', 'Payment Agents'],
        ['security-testing',           'partners/security_testing',      'full_width', 'Security Testing'],

        ['get-started',                              'get_started/index',                         'get_started', 'Get Started',                      'ja'],
        ['get-started/what-is-binary-trading',       'get_started/what_is_binary_trading',        'get_started', 'Why Choose Binary Trading?',       'ja'],
        ['get-started/types-of-trades',              'get_started/types_of_trades',               'get_started', 'Types of Trades',                  'ja'],
        ['get-started/binary-options-basics',        'get_started/binary_options_basics',         'get_started', 'Binary Options Basics',            'ja'],
        ['get-started/why-trade-with-us',            'get_started/why_trade_with_us',             'get_started', 'Why Trade with Binary.com',        'ja'],
        ['get-started/how-to-trade-binaries',        'get_started/how_to_trade_binaries',         'get_started', 'How to Trade Binary Options?',           'ja'],
        ['get-started/volidx-markets',               'get_started/volidx_markets',                'get_started', 'Volatility Index Markets',         'ja'],
        ['get-started/smart-indices',                'get_started/smart_indices',                 'get_started', 'Smart Indices',                    'ja'],
        ['get-started/otc-indices-stocks',           'get_started/otc_indices_stocks',            'get_started', 'What Are OTC Indices and Stocks?', 'ja'],
        ['get-started/beginners-faq',                'get_started/beginners_faq',                 'get_started', 'FAQ',                              'ja'],
        ['get-started/glossary',                     'get_started/glossary',                      'get_started', 'Glossary',                         'ja'],

        ['get-started-jp', 'japan/get_started',  'default', 'Get Started', 'NOT-ja,en'],

        ['metatrader/contract-specifications', 'metatrader/contract_specifications', 'default',    'Contract Specifications'],
        ['metatrader/download',                'metatrader/download',                'default',    'Start Trading with MetaTrader 5'],
        ['metatrader/margin-policy',           'metatrader/margin_policy',           'full_width', 'MetaTrader Margin Policy'],

        ['cashier/account_transfer',     'cashier/account_transfer',                  'default', 'Account Transfer'],
        ['cashier/deposit-jp',           'japan/cashier/deposit',                     'default', 'Deposit',         'NOT-ja,en'],
        ['cashier/epg_forwardws',        'cashier/deposit_withdraw',                  'default', 'Cashier'],
        ['cashier/forwardws',            'cashier/deposit_withdraw',                  'default', 'Cashier',         'ja'],
        ['cashier/payment_agent_listws', 'cashier/payment_agent_list',                'default', 'Payment Agent Deposit'],
        ['cashier/submit-withdraw-jp',   'japan/cashier/submit',                      'default', 'Acknowledgement', 'NOT-ja,en'],
        ['cashier/top_up_virtualws',     'user/top_up_virtual',                       'default', 'Give Me More Money!'],
        ['cashier/withdraw-jp',          'japan/cashier/withdraw',                    'default', 'Withdraw',        'NOT-ja,en'],

        ['paymentagent/transferws',      'cashier/paymentagent_transfer',             'default', 'Payment Agent Transfer'],
        ['paymentagent/withdrawws',      'cashier/paymentagent_withdraw',             'default', 'Payment Agent Withdrawal'],

        ['multi_barriers_trading', 'bet/mb_trading',   'default', 'Trusted by traders since 2000'],
        ['trading',                'bet/trading',      'default', 'Trusted by traders since 2000'],
        ['trading_beta',           'bet/beta/trading', 'default', 'Trusted by traders since 2000', 'ja'],

        ['new_account/japanws',          'new_account/japan',           'default', 'Real Money Account Opening', 'NOT-ja,en'],
        ['new_account/knowledge_testws', 'japan/knowledge_test',        'default', 'Real Money Account Opening', 'NOT-ja,en'],
        ['new_account/maltainvestws',    'new_account/financial',       'default', 'Financial Account Opening'],
        ['new_account/realws',           'new_account/real',            'default', 'Real Money Account Opening'],
        ['new_account/virtualws',        'new_account/virtual',         'default', 'Create New Account'],

        ['resources',                'resources/index',         'default', 'Resources'],
        ['resources/asset_indexws',  'resources/asset_index',   'default', 'Asset Index', 'ja'],
        ['resources/market_timesws', 'resources/trading_times', 'default', 'Trading Times'],

        ['user/authenticate',                'user/authenticate',                    'default',    'Authenticate',            'ja'],
        ['user/lost_passwordws',             'user/lost_password',                   'default',    'Password Reset'],
        ['user/metatrader',                  'user/metatrader',                      'full_width', 'MetaTrader account management'],
        ['user/portfoliows',                 'user/portfolio',                       'default',    'Portfolio'],
        ['user/profit_tablews',              'user/profit_table',                    'default',    'Profit Table'],
        ['user/securityws',                  'user/security',                        'default',    'Security'],
        ['user/settingsws',                  'user/settings',                        'default',    'Settings'],
        ['user/statementws',                 'user/statement',                       'default',    'Statement'],
        ['user/tnc_approvalws',              'legal/tnc_approval',                   'default',    'Terms and Conditions Approval'],
        ['user/reset_passwordws',            'user/reset_password',                  'default',    'Password Reset'],
        ['user/reality_check_frequency',     'user/reality_check/frequency',         'default',    'Reality Check'],
        ['user/reality_check_summary',       'user/reality_check/summary',           'default',    'Reality Check'],
        ['user/security/api_tokenws',        'user/security/api_token',              'default',    'API Token',               'ja'],
        ['user/security/authorised_appsws',  'user/security/authorised_apps',        'default',    'Authorised Applications', 'ja'],
        ['user/security/cashier_passwordws', 'user/security/cashier_password',       'default',    'Cashier Password'],
        ['user/security/change_passwordws',  'user/security/change_password',        'default',    'Change Password'],
        ['user/security/iphistoryws',        'user/security/iphistory',              'default',    'Login History',           'ja'],
        ['user/security/limitsws',           'user/security/limits',                 'default',    'Account Limits'],
        ['user/security/self_exclusionws',   'user/security/self_exclusion',         'default',    'Self Exclusion'],
        ['user/settings/assessmentws',       'user/settings/financial_assessment',   'default',    'Financial Assessment',    'ja'],
        ['user/settings/detailsws',          'user/settings/personal_details',       'default',    'Personal Details'],

        ['logged_inws',                'global/logged_in',       undef],
        ['affiliate_disclaimer',       'japan/affiliates/popup', undef, '', 'NOT-ja,en'],
    );
}

1;
