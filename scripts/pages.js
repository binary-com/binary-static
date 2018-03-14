module.exports = [
    // url pathname,                       template file path,                          layout,       title,                               exclude languages
    // ==================== Section: "app" ====================
    ['cashier',                            'app/cashier/index',                         'default',    'Cashier'],
    ['cashier/account_transfer',           'app/cashier/account_transfer',              'default',    'Transfer Between Accounts'],
    ['cashier/confirmation',               'app/cashier/confirmation',                  'default',    'Confirm'],
    ['cashier/deposit-jp',                 'app/japan/cashier/deposit',                 'default',    'Deposit',                           'NOT-ja,en'],
    ['cashier/epg_forwardws',              'app/cashier/deposit_withdraw',              'default',    'Cashier'],
    ['cashier/forwardws',                  'app/cashier/deposit_withdraw',              'default',    'Cashier',                           'ja'],
    ['cashier/payment_agent_listws',       'app/cashier/payment_agent_list',            'default',    'Payment Agent Deposit'],
    ['cashier/payment_methods',            'app/cashier/payment_methods',               'default',    'Payment Methods',                   'ja'],
    ['cashier/submit-withdraw-jp',         'app/japan/cashier/submit',                  'default',    'Acknowledgement',                   'NOT-ja,en'],
    ['cashier/top_up_virtualws',           'app/user/top_up_virtual',                   'default',    'Give Me More Money!'],
    ['cashier/withdraw-jp',                'app/japan/cashier/withdraw',                'default',    'Withdraw',                          'NOT-ja,en'],

    ['paymentagent/transferws',            'app/cashier/paymentagent_transfer',         'default',    'Payment Agent Transfer'],
    ['paymentagent/withdrawws',            'app/cashier/paymentagent_withdraw',         'default',    'Payment Agent Withdrawal'],

    ['multi_barriers_trading',             'app/trade/mb_trading',                      'full_width', 'Trusted by traders since 2000'],
    ['trading',                            'app/trade/trading',                         'default',    'Trusted by traders since 2000'],

    ['new_account/japanws',                'app/new_account/japan',                     'default',    'Real Money Account Opening',        'NOT-ja,en'],
    ['new_account/knowledge_testws',       'app/japan/knowledge_test',                  'default',    'Real Money Account Opening',        'NOT-ja,en'],
    ['new_account/landing_page',           'app/new_account/landing_page',              'default',    'Welcome to Binary.com',             'NOT-ja,en'],
    ['new_account/maltainvestws',          'app/new_account/financial',                 'default',    'Financial Account Opening'],
    ['new_account/realws',                 'app/new_account/real',                      'default',    'Real Money Account Opening'],
    ['new_account/virtualws',              'app/new_account/virtual',                   'default',    'Create New Account'],

    ['resources',                          'app/resources/index',                       'default',    'Resources'],
    ['resources/asset_indexws',            'app/resources/asset_index',                 'default',    'Asset Index', 'ja'],
    ['resources/market_timesws',           'app/resources/trading_times',               'default',    'Trading Times'],

    ['user/accounts',                      'app/user/accounts',                         'default',    'Accounts',                          'ja'],
    ['user/authenticate',                  'app/user/authenticate',                     'default',    'Authenticate',                      'ja'],
    ['user/lost_passwordws',               'app/user/lost_password',                    'default',    'Password Reset'],
    ['user/metatrader',                    'app/user/metatrader',                       'default',    'MetaTrader account management',     'ja'],
    ['user/portfoliows',                   'app/user/portfolio',                        'default',    'Portfolio'],
    ['user/profit_tablews',                'app/user/profit_table',                     'default',    'Profit Table'],
    ['user/reality_check_frequency',       'app/user/reality_check/frequency',          'default',    'Reality Check'],
    ['user/reality_check_summary',         'app/user/reality_check/summary',            'default',    'Reality Check'],
    ['user/reset_passwordws',              'app/user/reset_password',                   'default',    'Password Reset'],
    ['user/securityws',                    'app/user/security',                         'default',    'Security'],
    ['user/security/api_tokenws',          'app/user/security/api_token',               'default',    'API Token',                         'ja'],
    ['user/security/authorised_appsws',    'app/user/security/authorised_apps',         'default',    'Authorised Applications',           'ja'],
    ['user/security/cashier_passwordws',   'app/user/security/cashier_password',        'default',    'Cashier Password'],
    ['user/security/change_passwordws',    'app/user/security/change_password',         'default',    'Change Password'],
    ['user/security/iphistoryws',          'app/user/security/iphistory',               'default',    'Login History',                     'ja'],
    ['user/security/limitsws',             'app/user/security/limits',                  'default',    'Account Limits'],
    ['user/security/self_exclusionws',     'app/user/security/self_exclusion',          'default',    'Self Exclusion'],
    ['user/set-currency',                  'app/user/set_currency',                     'default',    'Set Currency',                      'ja'],
    ['user/settingsws',                    'app/user/settings',                         'default',    'Settings'],
    ['user/settings/assessmentws',         'app/user/settings/financial_assessment',    'default',    'Financial Assessment',              'ja'],
    ['user/settings/detailsws',            'app/user/settings/personal_details',        'default',    'Personal Details'],
    ['user/settings/professional',         'app/user/settings/professional',            'default',    'Professional Client'],
    ['user/statementws',                   'app/user/statement',                        'default',    'Statement'],
    ['user/telegram-bot',                  'app/user/telegram_bot',                     'default',    'Telegram Bot'],
    ['user/tnc_approvalws',                'app/user/tnc_approval',                     'default',    'Terms and Conditions Approval'],
    ['user/video-facility',                'app/user/video_facility',                   'default',    'Video Room Facility'],
    ['user/warning',                       'app/user/warning',                          'default',    'Warning'],

    ['endpoint',                           'app/endpoint',                              'default',    'Endpoint'],

    ['dialog',                             'app/dialog',                                null],
    ['explanation',                        'app/trade/explanation',                     null],
    ['logged_inws',                        'app/logged_in',                             null],
    ['redirect',                           'app/logged_in',                             null,         'Redirecting...'],


    // ==================== Section: "app_2" ====================
    ['trade',                              'app_2/trade/trading',                       'full_width', 'Trusted by traders since 2000'],


    // ==================== Section: "static" ====================
    ['404',                                'static/404',                                'full_width', '404'],
    ['home',                               'static/home',                               'full_width', 'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices', 'ja'],
    ['home-jp',                            'static/japan/home',                         'full_width', 'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices', 'NOT-ja,en'],
    ['tour',                               'static/tour',                               'full_width', 'Tour',                              'ja'],
    ['tour-jp',                            'static/japan/tour',                         'full_width', 'Tour',                              'NOT-ja,en'],
    ['why-us',                             'static/why_us',                             'full_width', 'Why Us',                            'ja'],
    ['why-us-jp',                          'static/japan/why_us',                       'full_width', 'Why Us',                            'NOT-ja,en'],
    ['platforms',                          'static/platforms',                          'full_width', 'Trading Platforms',                 'ja'],

    ['about-us',                           'static/about/index',                        'full_width', 'About Us'],
    ['binary-in-numbers',                  'static/about/binary_in_numbers',            'default',    'Binary in Numbers'],
    ['careers',                            'static/about/careers',                      'full_width', 'Careers',                            'ja'],
    ['careers-for-americans',              'static/about/careers_for_americans',        'full_width', 'Careers For Americans',              'ja'],
    ['contact',                            'static/about/contact',                      'full_width', 'Contact Us'],
    ['group-history',                      'static/about/group_history',                'full_width', 'Group History'],
    ['open-positions',                     'static/about/job_descriptions',             'full_width', 'Open Positions'],
    ['open-positions/job-details',         'static/about/job_details',                  'full_width', 'Job Details'],

    ['affiliate/signup',                   'static/affiliates/signup',                  'default',    'Affiliate',                         'ja'],
    ['affiliate/signup-jp',                'static/japan/affiliates/signup',            'default',    'Affiliate',                         'NOT-ja,en'],
    ['charity',                            'static/charity',                            'default',    'Charity'],
    ['company-profile',                    'static/japan/company_profile',              'default',    'Company Profile',                   'NOT-ja,en'],
    ['legal/us_patents',                   'static/legal/us_patents',                   'default',    'US Patents',                        'ja'],
    ['regulation',                         'static/legal/regulation',                   'default',    'Regulation',                        'id'],
    ['responsible-trading',                'static/responsible_trading',                'full_width', 'Responsible Trading',               'ja'],
    ['service-announcements',              'static/japan/service-announcements',        'default',    'Service Announcements',              'NOT-ja,en'],
    ['terms-and-conditions',               'static/legal/tac',                          'default',    'Terms and Conditions',              'ja'],
    ['terms-and-conditions-jp',            'static/japan/legal/tac',                    'default',    'Terms and Conditions',              'NOT-ja,en'],
    ['user/browser-support',               'static/browser_support',                    'default',    'Login trouble'],

    ['liquidity-solutions',                'static/partners/liquidity_solutions',       'full_width', 'Multi-asset Liquidity Solutions',   'ja'],
    ['multiple-accounts-manager',          'static/partners/multiple_accounts_manager', 'full_width', 'Multiple Accounts Manager',         'ja'],
    ['open-source-projects',               'static/partners/open_source_projects',      'full_width', 'Open-Source Projects',              'ja'],
    ['partners',                           'static/partners/partners',                  'full_width', 'Partners',                          'ja'],
    ['payment-agent',                      'static/partners/payment_agent',             'full_width', 'Payment Agents',                    'ja'],
    ['pull-requests',                      'static/partners/pull_requests',             'full_width', 'Get Paid for Pull Requests',        'ja'],
    ['security-testing',                   'static/partners/security_testing',          'full_width', 'Security Testing',                  'ja'],

    ['get-started',                        'static/get_started/index',                  'default',     'Get Started',                      'ja'],
    ['get-started/binary-options',         'static/get_started/binary_options',         'default',     'Binary Options',                   'ja'],
    ['get-started/cfds',                   'static/get_started/cfds',                   'default',     'CFDs',                             'ja'],
    ['get-started/cryptocurrencies',       'static/get_started/cryptocurrencies',       'default',     'Cryptocurrencies',                 'ja'],
    ['get-started/forex',                  'static/get_started/forex',                  'default',     'Forex',                            'ja'],
    ['get-started/metals',                 'static/get_started/metals',                 'default',     'Metals',                           'ja'],

    ['get-started-jp',                     'static/japan/get_started',                  'default',     'Get Started',                      'NOT-ja,en'],

    ['metatrader/contract-specifications', 'static/metatrader/contract_specifications', 'default',     'Contract Specifications',          'ja'],
    ['metatrader/download',                'static/metatrader/download',                'default',     'Start Trading with MetaTrader 5',  'ja'],
    ['metatrader/how-to-trade-mt5',        'static/metatrader/how_to_trade_mt5',        'default',     'How to Trade in MetaTrader 5',     'ja'],
    ['metatrader/types-of-accounts',       'static/metatrader/types_of_accounts',       'default',     'Types of MetaTrader 5 accounts'],

    ['affiliate_disclaimer',               'static/japan/affiliates/popup',             null,          '',                                 'NOT-ja,en'],

    ['style-guide',                        'static/new_layout/style_guide',             'full_width',  'Trusted by traders since 2000'],


    // ==================== Section: "landing_pages" ====================
    ['graduates',                          'landing_pages/graduate_program',            null,        'Binary.com Graduate Program',        'NOT-en'],
    ['hackathon',                          'landing_pages/hackathon',                   null,        'Hackathon Competition',              'NOT-en'],
    ['landing/signup-frame',               'landing_pages/signup_frame',                null,        'Sign up'],
    ['バイナリーオプション',                  'landing_pages/binary_japan',                null,        'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices', 'NOT-ja,en'],
    ['bo_1',                               'landing_pages/binary_japan_2',              null,        'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices', 'NOT-ja,en'],
];
