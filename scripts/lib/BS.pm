package BS;

use strict;
use warnings;
use v5.10;
use base 'Exporter';
use Path::Tiny;
use JSON;
use YAML::XS;
use Mojo::URL;
use Template;
use Template::Stash;
use Format::Util::Numbers;

our @EXPORT_OK = qw/
    root_path is_dev set_is_dev
    localize set_lang all_languages lang_display_name

    root_url

    tt2

    css_files js_config menu
    /;

sub root_path {
    return path(__FILE__)->parent->parent->parent->absolute->stringify;
}

# for developer
our $IS_DEV = 0;
sub is_dev { return $IS_DEV; }
sub set_is_dev { $IS_DEV = 1; }

our $LANG = 'en';

sub set_lang {
    $LANG = shift;
}

sub localize {
    my @texts = @_;

    require BS::I18N;
    my $lh = BS::I18N::handle_for($LANG)
        || die("could not build locale for language $LANG");

    return $lh->maketext(@texts);
}

sub all_languages {
    return ('EN', 'AR', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'VI', 'ZH_CN', 'ZH_TW');
}

sub rtl_languages {
    return ('AR');
}

sub lang_display_name {
    my $iso_code = shift;

    my %lang_code_name = (
        AR    => 'Arabic',
        DE    => 'Deutsch',
        ES    => 'Español',
        FR    => 'Français',
        EN    => 'English',
        ID    => 'Bahasa Indonesia',
        JA    => '日本語',
        PL    => 'Polish',
        PT    => 'Português',
        RU    => 'Русский',
        VI    => 'Vietnamese',
        ZH_CN => '简体中文',
        ZH_TW => '繁體中文',
        IT    => 'Italiano'
    );

    $iso_code = defined($iso_code) ? uc $iso_code : '';
    return $lang_code_name{$iso_code} || $iso_code;
}

## url_for
sub root_url {
    return is_dev() ? '/binary-static-www2/' : '/';
}

sub url_for {
    require BS::Request;
    state $request = BS::Request->new(language => $LANG);
    return $request->url_for(@_);
}

## tt2/haml
sub tt2 {
    my @include_path = (root_path() . '/src/templates/toolkit');

    state $request = BS::Request->new(language => $LANG);
    my $stash = Template::Stash->new({
        language    => $request->language,
        broker      => $request->broker,
        request     => $request,
        broker_name => $request->website->display_name,
        website     => $request->website,
        # 'is_pjax_request'         => $request->is_pjax,
        l                         => \&localize,
        to_monetary_number_format => \&Format::Util::Numbers::to_monetary_number_format,
    });

    my $template_toolkit = Template->new({
            ENCODING     => 'utf8',
            INCLUDE_PATH => join(':', @include_path),
            INTERPOLATE  => 1,
            PRE_CHOMP    => $Template::CHOMP_GREEDY,
            POST_CHOMP   => $Template::CHOMP_GREEDY,
            TRIM         => 1,
            STASH        => $stash,
        }) || die "$Template::ERROR\n";

    return $template_toolkit;
}

## css/js/menu
sub css_files {
    my @css;

    if (is_dev()) {
        if (grep { $_ eq uc $LANG } rtl_languages()) {
            push @css, root_url() . "css/binary_rtl.css?_=1";
        } else {
            push @css, root_url() . "css/binary.css?_=1";
        }
    } else {
        if (grep { $_ eq uc $LANG } rtl_languages()) {
            push @css, root_url() . "css/binary_rtl.min.css?_=1";
        } else {
            push @css, root_url() . "css/binary.min.css?_=1";
        }
    }

    return @css;
}

sub js_config {
    my @libs;
    if (is_dev()) {
        push @libs, root_url . 'js/binary.js?_=1';
    } else {
        push @libs, root_url . 'js/binary.min.js?_=1';
    }

    my %setting = (
        enable_relative_barrier => 'true',
        image_link              => {
            hourglass     => url_for('images/common/hourglass_1.gif')->to_string,
            up            => url_for('images/javascript/up_arrow_1.gif')->to_string,
            down          => url_for('images/javascript/down_arrow_1.gif')->to_string,
            calendar_icon => url_for('images/common/calendar_icon_1.png')->to_string,
            livechaticon  => url_for('images/pages/contact/chat-icon.svg')->to_string,
        },
        broker           => 'CR',
        countries_list   => YAML::XS::LoadFile(root_path() . '/scripts/config/countries.yml'),
        valid_loginids   => 'MX|MF|VRTC|MLT|CR|FOG|VRTJ|JP',
        streaming_server => 'www.binary.com',
    );

    # hardcode, require a fix?
    $setting{arr_all_currencies} = ["USD", "EUR", "GBP", "AUD"];

    return {
        libs     => \@libs,
        settings => JSON::to_json(\%setting),
    };
}

sub menu {
    my @menu;

    # beta interface
    push @menu,
        {
        id         => 'topMenuBetaInterface',
        url        => url_for('/trading'),
        text       => localize('Start Trading'),
        link_class => 'pjaxload'
        };

    # myaccount
    my $my_account_ref = {
        id         => 'topMenuMyAccount',
        url        => url_for('/user/my_accountws'),
        text       => localize('My Account'),
        class      => 'by_client_type client_real client_virtual',
        link_class => 'with_login_cookies pjaxload',
        sub_items  => [],
    };

    # Portfolio
    push @{$my_account_ref->{sub_items}},
        {
        id         => 'topMenuPortfolio',
        url        => url_for('/user/openpositionsws'),
        text       => localize('Portfolio'),
        link_class => 'with_login_cookies pjaxload',
        };

    push @{$my_account_ref->{sub_items}},
        {
        id         => 'topMenuProfitTable',
        url        => url_for('/user/profit_tablews'),
        text       => localize('Profit Table'),
        link_class => 'with_login_cookies pjaxload',
        };

    push @{$my_account_ref->{sub_items}},
        {
        id         => 'topMenuStatement',
        url        => url_for('/user/statementws'),
        text       => localize('Statement'),
        link_class => 'with_login_cookies pjaxload',
        };

    push @{$my_account_ref->{sub_items}},
        {
        id         => 'topMenuChangePassword',
        url        => url_for('/user/change_passwordws'),
        text       => localize('Password'),
        link_class => 'with_login_cookies pjaxload',
        };

    push @{$my_account_ref->{sub_items}},
        {
        id         => 'topMenuAccountSettings',
        url        => url_for('/user/settingsws'),
        text       => localize('Settings'),
        link_class => 'with_login_cookies pjaxload',
        };

    push @{$my_account_ref->{sub_items}},
        {
        id         => 'topMenuBecomeAffiliate',
        class      => 'ja-hide',
        url        => url_for('/affiliate/signup'),
        link_class => 'pjaxload',
        text       => localize('Affiliate'),
        };

    push @{$my_account_ref->{sub_items}},
        {
        id         => 'topMenuAuthenticateAccount',
        url        => url_for('/cashier/authenticatews'),
        text       => localize('Authenticate'),
        class      => 'by_client_type client_real',
        link_class => 'with_login_cookies pjaxload',
        };
    push @menu, $my_account_ref;

    # cashier
    push @menu,
        {
        id         => 'topMenuCashier',
        url        => url_for('/cashier'),
        text       => localize('Cashier'),
        link_class => 'pjaxload',
        };

    # resources
    my $resources_items_ref = {
        id         => 'topMenuResources',
        url        => url_for('/resources'),
        text       => localize('Resources'),
        link_class => 'pjaxload',
    };

    my $asset_index_ref = {
        id         => 'topMenuAssetIndex',
        class      => 'ja-hide',
        url        => url_for('/resources/asset_indexws'),
        text       => localize('Asset Index'),
        link_class => 'pjaxload',
    };

    my $trading_times_ref = {
        id         => 'topMenuTradingTimes',
        url        => url_for('/resources/market_timesws'),
        text       => localize('Trading Times'),
        link_class => 'pjaxload',
    };

    $resources_items_ref->{'sub_items'} = [$asset_index_ref, $trading_times_ref];
    push @menu, $resources_items_ref;

    # applications
    push @menu,
        {
        id         => 'topMenuApplications',
        url        => url_for('/applications'),
        text       => localize('Applications'),
        link_class => 'pjaxload',
        };

    # push @{$menu}, $self->_main_menu_trading();

    return \@menu;
}

1;
