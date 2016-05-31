#!/usr/bin/perl

use strict;
use warnings;
use v5.10;
use FindBin qw/$Bin/;
use lib "$Bin/lib";
use Getopt::Long;
use Text::Haml;
use Path::Tiny;
use HTML::Entities qw( encode_entities );
use Encode;
use Term::ANSIColor;

use BS qw/set_is_dev is_dev branch set_branch localize set_lang all_languages lang_display_name tt2 css_files js_config menu/;
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
    ['home',                'home/index',                 'haml', 'full_width', 'Online Trading platform for binary options on Forex, Indices, Commodities and Smart Indices'],
    ['why-us',              'static/why_us',              'haml', 'full_width', 'Why Us'],
    ['payment-agent',       'static/payment_agent',       'haml', 'full_width', 'Payment Agents'],
    ['contact',             'static/contact',             'haml', 'full_width', 'Contact Us'],
    ['tour',                'static/tour',                'haml', 'full_width', 'Tour'],
    ['responsible-trading', 'static/responsible_trading', 'haml', 'full_width', 'Responsible Trading'],
    ['terms-and-conditions',       'legal/tac',                   'toolkit', 'default',    'Terms and Conditions'],
    ['terms-and-conditions-jp',    'japan/legal/tacjp',           'toolkit', 'default',    'Terms and Conditions'],
    ['resources',                  'resources/index',             'haml',    'default',    'Resources'],
    ['applications',               'applications/index',          'toolkit', 'default',    'Applications'],
    ['about-us',                   'about/index',                 'haml',    'full_width', 'About Us'],
    ['group-information',          'about/group-information',     'haml',    'default',    'Group Information'],
    ['open-positions',             'static/job_descriptions',     'haml',    'full_width', 'Open Positions'],
    ['open-positions/job-details', 'static/job_details',          'haml',    'full_width', 'Job Details'],
    ['careers',                    'static/careers',              'haml',    'full_width', 'Careers'],
    ['partners',                   'static/partners',             'haml',    'full_width', 'Partners'],
    ['group-history',              'static/group_history',        'haml',    'full_width', 'Group History'],
    ['open-source-projects',       'static/open_source_projects', 'haml',    'full_width', 'Open-Source Projects'],
    ['styles',                     'home/styles',                 'haml',    'full_width', 'Styles'],
    ['affiliate/signup',           'affiliates/signup',           'toolkit', 'default', 'Affiliate'],
    ['user/logintrouble',          'misc/logintrouble',           'toolkit', 'default', 'Login trouble'],
    ['endpoint',                   'misc/endpoint',               'toolkit', 'default', 'Endpoint'],
    ['legal/us_patents',           'legal/us_patents',            'toolkit', 'default', 'US Patents'],
    ['cashier',                    'cashier/index',               'haml',    'default', 'Cashier'],
    ['cashier/payment_methods',    'cashier/payment_methods',     'toolkit', 'default', 'Payment Methods'],

    ['cashier/session_expired', 'cashier/session_expired', 'toolkit', 'default'],
    ['user-testing',            'static/user_testing',     'haml',    'full_width', 'Sign Up to Test Our Platform'],

    ['get-started',                              'get_started/index',                        'haml', 'get_started', 'Get Started'],
    ['get-started/what-is-binary-trading',       'get_started/what_is_binary_trading',       'haml', 'get_started', 'Why Choose Binary Trading?'],
    ['get-started/types-of-trades',              'get_started/types_of_trades',              'haml', 'get_started', 'Types of Trades'],
    ['get-started/binary-options-basics',        'get_started/binary_options_basics',        'haml', 'get_started', 'Binary Options Basics'],
    ['get-started/benefits-of-trading-binaries', 'get_started/benefits_of_trading_binaries', 'haml', 'get_started', 'Benefits of Binary Trading'],
    ['get-started/how-to-trade-binaries',        'get_started/how_to_trade_binaries',        'haml', 'get_started', 'How to Trade Binaries?'],
    ['get-started/volidx-markets',               'get_started/volidx_markets',               'haml', 'get_started', 'Volatility Index Markets'],
    ['get-started/spread',                       'get_started/spread_bets',                  'haml', 'get_started', 'Spreads'],
    ['get-started/smart-indices',                'static/smart_indices',                     'haml', 'get_started', 'Smart Indices'],
    ['get-started/otc-indices-stocks',           'get_started/otc_indices_stocks',           'haml', 'get_started', 'What Are OTC Indices and Stocks?'],
    ['get-started/beginners-faq',                'get_started/beginners_faq',                'haml', 'get_started', 'FAQ'],
    ['get-started/glossary',                     'get_started/glossary',                     'haml', 'get_started', 'Glossary'],

    ['get-started-jp', 'japan/get_started', 'toolkit', 'default', 'Get Started'],

    ## ws
    ['user/authenticatews',          'user/authenticatews',                      'toolkit', 'default', 'Authenticate'],
    ['cashier/forwardws',            'cashier/deposit_withdraw_ws',              'toolkit', 'default', 'Cashier'],
    ['user/settings/limitsws',       'user/settings/limitsws',                   'toolkit', 'default', 'Account Limits'],
    ['account/account_transferws',   'user/account/account_transferws',          'haml',    'default', 'Account Transfer'],
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

    ['resources/asset_indexws',  'resources/asset_indexws',  'toolkit', 'default', 'Asset Index'],
    ['resources/market_timesws', 'resources/market_timesws', 'toolkit', 'default', 'Trading Times'],

    ['user/settings/api_tokenws',       'user/settings/api_tokenws',                     'toolkit', 'default', 'API Token'],
    ['user/change_passwordws',          'user/settings/change_passwordws',               'toolkit', 'default', 'Change Password'],
    ['user/portfoliows',                'user/portfoliows',                              'toolkit', 'default', 'Portfolio'],
    ['user/profit_tablews',             'user/profit_tablews',                           'toolkit', 'default', 'Profit Table'],
    ['user/settings/self_exclusionws',   'user/settings/self_exclusionws',                'toolkit', 'default', 'Account Details'],
    ['user/settings/detailsws',         'user/settings/settings_detailsws',              'toolkit', 'default', 'Personal Details'],
    ['user/settings/securityws',        'user/account/settings_securityws',              'haml',    'default', 'Security'],
    ['user/statementws',                'user/statementws',                              'toolkit', 'default', 'Statement'],
    ['user/my_accountws',               'user/my_accountws',                             'toolkit', 'default', 'My Account'],
    ['user/settingsws',                 'user/settingsws',                               'toolkit', 'default', 'Settings'],
    ['user/settings/iphistoryws',       'user/settings/iphistory',                       'toolkit', 'default', 'Login History'],
    ['user/tnc_approvalws',             'legal/tnc_approvalws',                          'toolkit', 'default', 'Terms and Conditions Approval'],
    ['user/settings/assessmentws',      'user/settings/financial_assessmentws',          'toolkit', 'default', 'Financial Assessment'],
    ['user/lost_passwordws',            'user/lost_passwordws',                          'haml',    'default', 'Password Reset'],
    ['user/reset_passwordws',           'user/reset_passwordws',                         'haml',    'default', 'Password Reset'],
    ['user/settings/authorised_appsws', 'user/settings/authorised_appsws',               'toolkit', 'default', 'Authorised Applications'],
    ['user/reality_check_frequencyws',  'user/reality_check_frequencyws',                'haml',    'default', 'Reality Check'],
    ['user/reality_check_summaryws',    'user/reality_check_summaryws',                  'haml',    'default', 'Reality Check'],

    ['logged_inws',           'global/logged_inws', 'toolkit', undef],
    ['trade/bet_explanation', 'bet/explanation',    'toolkit', undef],
);

## config
my $root_path = substr $Bin, 0, rindex($Bin, '/');
my $dist_path = "$root_path/dist".($branch ? '/'.branch() : '');
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
        );

        if ($title) {
            $stash{title} = localize($title);
        }

        my $file = "$root_path/src/templates/haml/$tpl_path.html.haml";
        if ($tpl_type eq 'toolkit') {
            $file = "$tpl_path.html.tt";    # no Absolute path
        }

        my $output;
        if ($tpl_type eq 'haml') {
            $output = haml_handle($file, %stash);
        } else {
            $output = tt2_handle($file, %stash);
        }

        ## pjax is using layout/default/content
        my $layout_file = $file;
        if($layout) {
            $layout_file = "$root_path/src/templates/haml/layouts/$layout/content.html.haml";
            if ($tpl_type eq 'toolkit') {
                $layout_file = "layouts/default/content.html.tt";
            }
        }
        $stash{is_pjax_request} = 1;
        $stash{content}         = $output;
        my $layout_output = '';
        if ($tpl_type eq 'haml') {
            $layout_output = haml_handle($layout_file, %stash);
        } else {
            $layout_output = tt2_handle($layout_file, %stash);
        }

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
            $layout_output          = '';
            if ($tpl_type eq 'haml') {
                $layout_output = haml_handle($layout_file, %stash);
            } else {
                $layout_output = tt2_handle($layout_file, %stash);
            }
        }
        $path = path($save_as_file);
        $path->parent->mkpath if $save_as =~ '/';
        $path->spew_utf8($layout_output);
    }
}
print "\n";

sub haml_handle {
    my ($file, %stash) = @_;

    my $haml = Text::Haml->new(cache => 0);
    if ($file =~ 'layout') {
        $haml->escape_html(0);
    }
    $haml->add_helper(
        stash => sub {
            my $self = shift;
            if (@_ > 1 || ref($_[0])) {
                return %stash = (%stash, (@_ > 1 ? @_ : %{$_[0]}));
            } elsif (@_) {
                return $stash{$_[0]} // '';
            } else {
                return \%stash;
            }
        });
    $haml->add_helper(
        l => sub {
            my $self = shift;
            return localize(@_);
        });

    $haml->add_helper(
        encode_html_text => sub {
            my ($self, $text) = @_;
            return encode_entities($text);
        });
    $haml->add_helper(
        available_languages => sub {
            my ($c)           = @_;
            my @allowed_langs = all_languages();
            my $al            = {};
            map { $al->{$_} = decode_utf8(lang_display_name($_)) } @allowed_langs;
            return $al;
        });

    my $request      = $stash{request};
    my $current_path = $stash{current_path};
    $haml->add_helper(
        url_for => sub {
            my $self = shift;
            return $request->url_for(@_);
        });
    $haml->add_helper(
        get_current_path => sub {
            my $self = shift;
            return $request->url_for($current_path, undef, {no_lang => 1});
        });
    $haml->add_helper(
        current_route => sub {
            return $stash{current_route};
        });
    $haml->add_helper(
        content => sub {
            return $stash{content};
        });

    $haml->add_helper(
        include => sub {
            my ($self, $tpl) = (shift, shift);
            my $x = $haml->render_file("$root_path/src/templates/haml/$tpl.html.haml", %stash, @_)
                or die $haml->error;
            # say "$tpl get $x";
            return $x;
        });

    $stash{javascript} = js_config();
    $stash{css_files}  = [css_files()];
    $stash{menu}       = menu();

    my $output = $haml->render_file($file, %stash) or die $haml->error;

    return $output;
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
