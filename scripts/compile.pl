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

use BS qw/set_is_dev is_dev localize set_lang all_languages lang_display_name tt2 css_files js_config menu/;
use BS::Request;

# force = re-generate all files
# dev   = for domain like http://fayland.github.io/binary-static-www2/ which has a sub path
# pattern = the url pattern to rebuild
my $force;
my $is_dev;
my $pattern;
GetOptions(
    "force|f"     => \$force,
    "dev|d"       => \$is_dev,
    "pattern|p=s" => \$pattern,
);
set_is_dev() if $is_dev;

my @langs = map { lc $_ } all_languages();
my @m = (
    ['home',                'home/index',                 'haml', 'full_width'],
    ['why-us',              'static/why_us',              'haml', 'full_width'],
    ['payment-agent',       'static/payment_agent',       'haml', 'full_width'],
    ['contact',             'static/contact',             'haml', 'full_width'],
    ['tour',                'static/tour',                'haml', 'full_width'],
    ['responsible-trading', 'static/responsible_trading', 'haml', 'full_width'],
    ['terms-and-conditions',       'legal/tac',                   'toolkit', 'default', 'Terms and Conditions'],
    ['terms-and-conditions-jp',    'legal_jp/tacjp',              'toolkit', 'default', 'Terms and Conditions'],
    ['resources',                  'resources/index',             'haml',    'default'],
    ['applications',               'applications/index',          'toolkit', 'default', 'Applications'],
    ['about-us',                   'about/index',                 'haml',    'full_width'],
    ['group-information',          'about/group-information',     'haml',    'default'],
    ['open-positions',             'static/job_descriptions',     'haml',    'full_width'],
    ['open-positions/job-details', 'static/job_details',          'haml',    'full_width'],
    ['careers',                    'static/careers',              'haml',    'full_width'],
    ['partners',                   'static/partners',             'haml',    'full_width'],
    ['group-history',              'static/group_history',        'haml',    'full_width'],
    ['open-source-projects',       'static/open_source_projects', 'haml',    'full_width'],
    ['styles',                     'home/styles',                 'haml',    'full_width'],
    ['affiliate/signup',           'affiliates/signup',           'toolkit', 'default', 'Affiliate'],
    ['user/logintrouble',          'misc/logintrouble',           'toolkit', 'default', 'Login trouble'],
    ['legal/us_patents',           'legal/us_patents',            'toolkit', 'default', 'US Patents'],
    ['cashier',                    'cashier/index',               'haml',    'default'],
    ['cashier/payment_methods',    'cashier/payment_methods',     'toolkit', 'default', 'Payment Methods'],
    # ['trade/bet_explanation', '']
    ['cashier/session_expired', 'cashier/session_expired', 'toolkit', 'default'],
    ['user-testing',            'static/user_testing',     'haml',    'full_width'],

    ['get-started',                              'get_started/index',                        'haml', 'get_started'],
    ['get-started/what-is-binary-trading',       'get_started/what_is_binary_trading',       'haml', 'get_started'],
    ['get-started/binary-options-basics',        'get_started/binary_options_basics',        'haml', 'get_started'],
    ['get-started/benefits-of-trading-binaries', 'get_started/benefits_of_trading_binaries', 'haml', 'get_started'],
    ['get-started/how-to-trade-binaries',        'get_started/how_to_trade_binaries',        'haml', 'get_started'],
    ['get-started/types-of-trades',              'get_started/types_of_trades',              'haml', 'get_started'],
    ['get-started/beginners-faq',                'get_started/beginners_faq',                'haml', 'get_started'],
    ['get-started/glossary',                     'get_started/glossary',                     'haml', 'get_started'],
    ['get-started/volidx-markets',               'get_started/volidx_markets',               'haml', 'get_started'],
    ['get-started/smart-indices',                'static/smart_indices',                     'haml', 'get_started'],
    ['get-started/otc-indices-stocks',           'get_started/otc_indices_stocks',           'haml', 'get_started'],
    ['get-started/spread',                       'get_started/spread_bets',                  'haml', 'get_started'],

    ['get-started-jp', 'get_started_jp/get_started', 'toolkit', 'default', 'Get Started'],

    ## ws
    ['cashier/authenticatews',       'cashier/authenticatews',             'toolkit', 'default', 'Authenticate'],
    ['cashier/forwardws',            'cashier/deposit_withdraw_ws',        'toolkit', 'default', 'Cashier'],
    ['cashier/limitsws',             'account/trading_withdrawal_limitws', 'toolkit', 'default', 'Account Limits'],
    ['cashier/account_transferws',   'cashier/account_transferws',         'haml',    'default'],
    ['cashier/payment_agent_listws', 'cashier/payment_agent_listws',       'toolkit', 'default', 'Payment Agent Deposit'],
    ['cashier/top_up_virtualws',     'cashier/top_up_virtualws',           'toolkit', 'default', 'Give Me More Money!'],
    ['paymentagent/transferws',      'cashier/paymentagent_transferws',    'toolkit', 'default'],
    ['paymentagent/withdrawws',      'cashier/paymentagent_withdrawws',    'toolkit', 'default', 'Payment Agent Withdrawal'],

    ['jptrading', 'bet/static', 'toolkit', 'default', 'Sharp Prices. Smart Trading.'],
    ['trading',   'bet/static', 'toolkit', 'default', 'Sharp Prices. Smart Trading.'],

    ['new_account/virtualws',        'account/virtualws',      'toolkit', 'default', 'Create New Account'],
    ['new_account/realws',           'account/realws',         'toolkit', 'default', 'Real Money Account Opening'],
    ['new_account/japanws',          'account/japanws',        'toolkit', 'default', 'Real Money Account Opening'],
    ['new_account/maltainvestws',    'account/maltainvestws',  'toolkit', 'default', 'Financial Account Opening'],
    ['new_account/knowledge_testws', 'account/knowledge_test', 'toolkit', 'default', 'Real Money Account Opening'],

    ['resources/asset_indexws',  'resources/asset_indexws',  'toolkit', 'default', 'Asset Index'],
    ['resources/market_timesws', 'resources/market_timesws', 'toolkit', 'default', 'Trading Times'],

    ['user/api_tokenws',               'account/api_tokenws',            'toolkit', 'default', 'API Token'],
    ['user/change_passwordws',         'account/change_passwordws',      'toolkit', 'default', 'Change Password'],
    ['user/openpositionsws',           'account/openpositionsws',        'toolkit', 'default', 'Portfolio'],
    ['user/profit_tablews',            'account/profit_tablews',         'toolkit', 'default', 'Profit Table'],
    ['user/self_exclusionws',          'account/self_exclusionws',       'toolkit', 'default', 'Account Details'],
    ['user/settings/detailsws',        'account/settings_detailsws',     'toolkit', 'default', 'Personal Details'],
    ['user/settings/securityws',       'cashier/settings_securityws',    'haml',    'default', 'Security'],
    ['user/statementws',               'account/statementws',            'toolkit', 'default', 'Statement'],
    ['user/my_accountws',              'account/my_accountws',           'toolkit', 'default', 'My Account'],
    ['user/settingsws',                'account/settingsws',             'toolkit', 'default', 'Settings'],
    ['user/iphistoryws',               'account/iphistory',              'toolkit', 'default', 'Login History'],
    ['user/tnc_approvalws',            'legal/tnc_approvalws',           'toolkit', 'default', 'Terms and Conditions Approval'],
    ['user/assessmentws',              'account/financial_assessmentws', 'toolkit', 'default', 'Financial Assessment'],
    ['user/lost_passwordws',           'user/lost_passwordws',           'haml',    'default'],
    ['user/reset_passwordws',          'user/reset_passwordws',          'haml',    'default'],
    ['user/authorised_appsws',         'account/authorised_appsws',      'toolkit', 'default', 'Authorised Applications'],
    ['user/reality_check_frequencyws', 'user/reality_check_frequencyws', 'haml',    'default'],
    ['user/reality_check_summaryws',   'user/reality_check_summaryws',   'haml',    'default'],
    ['logged_inws',                    'global/logged_inws',             'toolkit', undef],
);

## config
my $root_path = "$Bin/..";
my $dist_path = "$root_path/dist";
@BS::Request::HTML_URLS = map { $_->[0] } @m;

foreach my $m (@m) {
    my $save_as  = $m->[0];
    my $tpl_path = $m->[1];
    my $tpl_type = $m->[2];
    my $layout   = $m->[3];
    my $title    = $m->[4];

    if ($pattern) {
        next unless index($save_as, $pattern) > -1;
        $force = 1;
    }

    foreach my $lang (@langs) {
        my $save_as_file = "$dist_path/$lang/pjax/$save_as.html";
        next if -e $save_as_file and not $force;

        set_lang($lang);

        mkdir("$dist_path/$lang")      unless -d "$dist_path/$lang";
        mkdir("$dist_path/$lang/pjax") unless -d "$dist_path/$lang/pjax";
        my $request = BS::Request->new(
            language => uc $lang,
        );

        my $current_route = $save_as;
        $current_route =~ s{^(.+)/}{}sg;

        my %stash = (
            website_name    => $request->website->display_name,
            request         => $request,
            website         => $request->website,
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

        say $save_as_file;
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
            map { $al->{$_} = lang_display_name($_) } @allowed_langs;
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

    # FIXME
    $haml->add_helper(google_tag_tracking_code => sub { });

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

    ## global/language_form.html.tt
    $stash{language_options} = [
        map { {code => $_, text => decode_utf8(lang_display_name($_)), value => uc($_), selected => uc($stash{iso639a_language}) eq uc($_) ? 1 : 0,} }
            all_languages()];

    my $output = '';
    $tt2->process($file, \%stash, \$output) or die $tt2->error(), "\n";

    return $output;
}

1;
