#!/usr/bin/perl

use strict;
use warnings;
use v5.10;
use FindBin qw/$Bin/;
use lib "$Bin/lib";
use Getopt::Long;
use Path::Tiny;
use HTML::Entities qw( encode_entities );
use Encode;
use Term::ANSIColor;

use BS qw/set_is_dev is_dev branch set_branch localize set_lang all_languages lang_display_name tt2 css_files js_config menu get_static_hash set_static_hash/;
use BS::Request;

# force = re-generate all files
# dev   = for domain like http://fayland.github.io/binary-static/ which has a sub path
# branch = will add br_[branch_name] to path
# pattern = the url pattern to rebuild
# verbose = to display list of all generated files
my $force;
my $is_dev;
my $branch;
my $pattern;
my $verbose;
GetOptions(
    "force|f"     => \$force,
    "dev|d"       => \$is_dev,
    "branch|b=s"  => \$branch,
    "pattern|p=s" => \$pattern,
    "verbose|vr"  => \$verbose,
);
set_is_dev() if $is_dev;
set_branch($branch) if $branch;

my @langs = map { lc $_ } all_languages();
my @m = (
    ['home',                       'home/index',                  'toolkit', 'full_width', 'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices'],
    ['why-us',                     'static/why_us',               'toolkit', 'full_width', 'Why Us'],
    ['tour',                       'static/tour',                 'toolkit', 'full_width', 'Tour'],
    ['responsible-trading',        'static/responsible_trading',  'toolkit', 'full_width', 'Responsible Trading'],
    ['terms-and-conditions',       'legal/tac',                   'toolkit', 'default',    'Terms and Conditions'],
    ['terms-and-conditions-jp',    'japan/legal/tacjp',           'toolkit', 'default',    'Terms and Conditions'],
    ['applications',               'applications/index',          'toolkit', 'default',    'Applications'],
    ['styles',                     'home/styles',                 'toolkit', 'full_width', 'Styles'],
    ['affiliate/signup',           'affiliates/signup',           'toolkit', 'default',    'Affiliate'],
    ['user/browser-support',       'misc/logintrouble',           'toolkit', 'default',    'Login trouble'],
    ['endpoint',                   'misc/endpoint',               'toolkit', 'default',    'Endpoint'],
    ['legal/us_patents',           'legal/us_patents',            'toolkit', 'default',    'US Patents'],
    ['cashier',                    'cashier/index',               'toolkit', 'default',    'Cashier'],
    ['cashier/payment_methods',    'cashier/payment_methods',     'toolkit', 'default',    'Payment Methods'],

    ['about-us',                   'about/index',                 'toolkit', 'full_width', 'About Us'],
    ['group-information',          'about/group-information',     'toolkit', 'default',    'Group Information'],
    ['group-history',              'about/group_history',         'toolkit', 'full_width', 'Group History'],
    ['contact',                    'about/contact',               'toolkit', 'full_width', 'Contact Us'],
    ['careers',                    'about/careers',               'toolkit', 'full_width', 'Careers'],
    ['open-positions',             'about/job_descriptions',      'toolkit', 'full_width', 'Open Positions'],
    ['open-positions/job-details', 'about/job_details',           'toolkit', 'full_width', 'Job Details'],

    ['open-source-projects',       'partners/open_source_projects', 'toolkit', 'full_width', 'Open-Source Projects'],
    ['partners',                   'partners/partners',             'toolkit', 'full_width', 'Partners'],
    ['payment-agent',              'partners/payment_agent',        'toolkit', 'full_width', 'Payment Agents'],
    ['user-testing',               'partners/user_testing',         'toolkit', 'full_width', 'Sign Up to Test Our Platform'],

    ['get-started',                              'get_started/index',                        'toolkit', 'get_started', 'Get Started'],
    ['get-started/what-is-binary-trading',       'get_started/what_is_binary_trading',       'toolkit', 'get_started', 'Why Choose Binary Trading?'],
    ['get-started/types-of-trades',              'get_started/types_of_trades',              'toolkit', 'get_started', 'Types of Trades'],
    ['get-started/binary-options-basics',        'get_started/binary_options_basics',        'toolkit', 'get_started', 'Binary Options Basics'],
    ['get-started/benefits-of-trading-binaries', 'get_started/benefits_of_trading_binaries', 'toolkit', 'get_started', 'Benefits of Binary Trading'],
    ['get-started/how-to-trade-binaries',        'get_started/how_to_trade_binaries',        'toolkit', 'get_started', 'How to Trade Binaries?'],
    ['get-started/volidx-markets',               'get_started/volidx_markets',               'toolkit', 'get_started', 'Volatility Index Markets'],
    ['get-started/spread',                       'get_started/spread_bets',                  'toolkit', 'get_started', 'Spreads'],
    ['get-started/smart-indices',                'get_started/smart_indices',                'toolkit', 'get_started', 'Smart Indices'],
    ['get-started/otc-indices-stocks',           'get_started/otc_indices_stocks',           'toolkit', 'get_started', 'What Are OTC Indices and Stocks?'],
    ['get-started/beginners-faq',                'get_started/beginners_faq',                'toolkit', 'get_started', 'FAQ'],
    ['get-started/glossary',                     'get_started/glossary',                     'toolkit', 'get_started', 'Glossary'],

    ['get-started-jp', 'japan/get_started', 'toolkit', 'default', 'Get Started'],

    ## ws
    ['user/authenticatews',          'user/authenticatews',                      'toolkit', 'default', 'Authenticate'],
    ['cashier/forwardws',            'cashier/deposit_withdraw_ws',              'toolkit', 'default', 'Cashier'],
    ['user/settings/limitsws',       'user/settings/limitsws',                   'toolkit', 'default', 'Account Limits'],
    ['account/account_transferws',   'cashier/account_transferws',               'toolkit', 'default', 'Account Transfer'],
    ['cashier/payment_agent_listws', 'cashier/payment_agent_listws',             'toolkit', 'default', 'Payment Agent Deposit'],
    ['cashier/top_up_virtualws',     'user/top_up_virtualws',                    'toolkit', 'default', 'Give Me More Money!'],
    ['paymentagent/transferws',      'cashier/paymentagent_transferws',          'toolkit', 'default', 'Payment Agent Transfer'],
    ['paymentagent/withdrawws',      'cashier/paymentagent_withdrawws',          'toolkit', 'default', 'Payment Agent Withdrawal'],

    ['jptrading', 'bet/static', 'toolkit', 'default', 'Sharp Prices. Smart Trading.'],
    ['trading',   'bet/static', 'toolkit', 'default', 'Sharp Prices. Smart Trading.'],

    ['new_account/virtualws',        'new_account/virtualws',      'toolkit', 'default', 'Create New Account'],
    ['new_account/realws',           'new_account/realws',         'toolkit', 'default', 'Real Money Account Opening'],
    ['new_account/japanws',          'new_account/japanws',        'toolkit', 'default', 'Real Money Account Opening'],
    ['new_account/maltainvestws',    'new_account/maltainvestws',  'toolkit', 'default', 'Financial Account Opening'],
    ['new_account/knowledge_testws', 'japan/knowledge_test',       'toolkit', 'default', 'Real Money Account Opening'],

    ['resources',                'resources/index',          'toolkit', 'default', 'Resources'],
    ['resources/asset_indexws',  'resources/asset_indexws',  'toolkit', 'default', 'Asset Index'],
    ['resources/market_timesws', 'resources/market_timesws', 'toolkit', 'default', 'Trading Times'],

    ['user/settings/api_tokenws',       'user/settings/api_tokenws',                     'toolkit', 'default', 'API Token'],
    ['user/change_passwordws',          'user/settings/change_passwordws',               'toolkit', 'default', 'Change Password'],
    ['user/portfoliows',                'user/portfoliows',                              'toolkit', 'default', 'Portfolio'],
    ['user/profit_tablews',             'user/profit_tablews',                           'toolkit', 'default', 'Profit Table'],
    ['user/settings/self_exclusionws',   'user/settings/self_exclusionws',               'toolkit', 'default', 'Account Details'],
    ['user/settings/detailsws',         'user/settings/settings_detailsws',              'toolkit', 'default', 'Personal Details'],
    ['user/settings/securityws',        'user/settings/settings_securityws',             'toolkit', 'default', 'Security'],
    ['user/statementws',                'user/statementws',                              'toolkit', 'default', 'Statement'],
    ['user/my_accountws',               'user/my_accountws',                             'toolkit', 'default', 'My Account'],
    ['user/settingsws',                 'user/settingsws',                               'toolkit', 'default', 'Settings'],
    ['user/settings/iphistoryws',       'user/settings/iphistory',                       'toolkit', 'default', 'Login History'],
    ['user/tnc_approvalws',             'legal/tnc_approvalws',                          'toolkit', 'default', 'Terms and Conditions Approval'],
    ['user/settings/assessmentws',      'user/settings/financial_assessmentws',          'toolkit', 'default', 'Financial Assessment'],
    ['user/lost_passwordws',            'user/lost_passwordws',                          'toolkit', 'default', 'Password Reset'],
    ['user/reset_passwordws',           'user/reset_passwordws',                         'toolkit', 'default', 'Password Reset'],
    ['user/settings/authorised_appsws', 'user/settings/authorised_appsws',               'toolkit', 'default', 'Authorised Applications'],
    ['user/reality_check_frequencyws',  'user/reality_check_frequencyws',                'toolkit', 'default', 'Reality Check'],
    ['user/reality_check_summaryws',    'user/reality_check_summaryws',                  'toolkit', 'default', 'Reality Check'],

    ['logged_inws',           'global/logged_inws', 'toolkit', undef],
    ['trade/bet_explanation', 'bet/explanation',    'toolkit', undef],
);

## config
my $root_path = substr $Bin, 0, rindex($Bin, '/');
my $dist_path = "$root_path/dist".($branch ? '/'.branch() : '');
my $hash_file = "$dist_path/version";
@BS::Request::HTML_URLS = map { $_->[0] } @m;
my $index = 0;
$| = 1;
print colored(['cyan'], "Target: ")."$dist_path\n";

mkdir("$dist_path") unless -d "$dist_path";
foreach my $lang (@langs) {
    mkdir("$dist_path/$lang")      unless -d "$dist_path/$lang";
    mkdir("$dist_path/$lang/pjax") unless -d "$dist_path/$lang/pjax";
}

if ($pattern) {
    @m = grep {index($_->[0], $pattern) > -1} @m;
    $force = 1;
    # use the last hash to maintain consistency between current templates with new one
    # since pattern specified, so one or few templates are going to be compiled not all of them
    if(open(my $file_handler, '<', $hash_file)) {
        set_static_hash(<$file_handler>);
        close $file_handler;
    }
}

foreach my $m (@m) {
    my $save_as  = $m->[0];
    my $tpl_path = $m->[1];
    my $tpl_type = $m->[2];
    my $layout   = $m->[3];
    my $title    = $m->[4];

    $index++;

    foreach my $lang (@langs) {
        my $save_as_file = "$dist_path/$lang/pjax/$save_as.html";
        next if -e $save_as_file and not $force;

        set_lang($lang);

        my $request = BS::Request->new(
            language => uc $lang,
        );

        my $current_route = $save_as;
        $current_route =~ s{^(.+)/}{}sg;

        my %stash = (
            website_name    => $request->website->display_name,
            browser_title   => ($title ? localize($title).' | ' : '') . $request->website->display_name,
            request         => $request,
            website         => $request->website->display_name,
            language        => uc $lang,
            current_path    => $save_as,
            current_route   => $current_route,
            affiliate_email => 'affiliates@binary.com',
            full_width      => $layout && $layout eq 'full_width'
        );

        if ($title) {
            $stash{title} = localize($title);
        }

        my $file = "$tpl_path.html.tt";    # no Absolute path

        my $output = tt2_handle($file, %stash);

        ## pjax is using layout/$layout/content
        my $layout_file = $file;
        if($layout) {
            $layout_file = "layouts/$layout/content.html.tt";
        }
        $stash{is_pjax_request} = 1;
        $stash{content}         = $output;
        my $layout_output = tt2_handle($layout_file, %stash);

        print colored(['green'], ($verbose ? "" : "\e[K\r")."[$index / ".(scalar @m)."] ($lang) => ")."/$lang/$save_as.html".($verbose ? "\n" : "");

        my $path = path($save_as_file);
        $path->parent->mkpath if $save_as =~ '/';
        $path->spew_utf8($layout_output);

        ## not pjax
        $save_as_file = "$dist_path/$lang/$save_as.html";
        if ($layout) {
            $layout_file = "$root_path/src/templates/$tpl_type/layouts/$layout.html.$tpl_type";
            if ($tpl_type eq 'toolkit') {
                $layout_file = "layouts/$layout.html.tt";
            }

            $stash{is_pjax_request} = 0;
            $stash{content}         = $output;
            $layout_output = tt2_handle($layout_file, %stash);
        }
        $path = path($save_as_file);
        $path->parent->mkpath if $save_as =~ '/';
        $path->spew_utf8($layout_output);
    }
}
print "\n";

# save latest hash
if(not $pattern) {
    # my $static_hash = get_static_hash();
    path($hash_file)->spew_utf8(get_static_hash());
}

sub tt2_handle {
    my ($file, %stash) = @_;

    my $tt2 = tt2();

    my $request = $stash{request};

    $stash{javascript}       = js_config();
    $stash{css_files}        = [css_files()];
    $stash{iso639a_language} = $request->language;
    $stash{icon_url}         = $request->url_for('images/common/favicon_1.ico');
    $stash{lang}             = $request->language;
    $stash{menu}             = menu();
    $stash{is_japan}         = 1 if index($stash{current_path}, 'jptrading') > -1;

    ## global/language_form.html.tt
    $stash{language_options} = [
        map { {code => $_, text => decode_utf8(lang_display_name($_)), value => uc($_), selected => uc($stash{iso639a_language}) eq uc($_) ? 1 : 0,} }
            all_languages()];

    my $output = '';
    $tt2->process($file, \%stash, \$output) or die $tt2->error(), "\n";

    return $output;
}

1;
