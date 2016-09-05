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
    root_path is_dev set_is_dev branch set_branch
    localize set_lang all_languages lang_display_name
    get_static_hash set_static_hash

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

our $BRANCH = '';
sub branch { return $BRANCH; }
sub set_branch {
    $BRANCH = 'br_'.shift;
    # chomp ($BRANCH = `git symbolic-ref --short HEAD`); $BRANCH = '_'.(split('/', $BRANCH))[-1];
}

our $LANG = 'en';

sub set_lang {
    $LANG = shift;
}

my %__lh;
sub localize {
    my @texts = @_;

    require BS::I18N;
    $__lh{$LANG} //= BS::I18N::handle_for($LANG)
        || die("could not build locale for language $LANG");

    return $__lh{$LANG}->maketext(@texts);
}

sub all_languages {
    return ('EN', 'AR', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'VI', 'JA', 'ZH_CN', 'ZH_TW');
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
    return is_dev() ? '/binary-static/'.($BRANCH ? $BRANCH.'/' : '') : '/';
}

my %__request;
sub url_for {
    require BS::Request;
    $__request{$LANG} //= BS::Request->new(language => $LANG);
    return $__request{$LANG}->url_for(@_);
}

## tt2
sub tt2 {
    my @include_path = (root_path() . '/src/templates');

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

our $static_hash = join('', map{('a'..'z',0..9)[rand 36]} 0..7);
sub get_static_hash { return $static_hash; }
sub set_static_hash { $static_hash = shift; }

## css/js/menu
sub css_files {
    my @css;

    # if (is_dev()) {
    #     if (grep { $_ eq uc $LANG } rtl_languages()) {
    #         push @css, root_url() . "css/binary_rtl.css?$static_hash";
    #     } else {
    #         push @css, root_url() . "css/binary.css?$static_hash";
    #     }
    # } else {
    if (grep { $_ eq uc $LANG } rtl_languages()) {
        push @css, root_url() . "css/binary_rtl.min.css?$static_hash";
    } else {
        push @css, root_url() . "css/binary.min.css?$static_hash";
    }

    # Binary-style
    push @css, "https://style.binary.com/binary.css?$static_hash";

    return @css;
}

sub js_config {
    my @libs;
    if (is_dev()) {
        push @libs, root_url . "js/binary.js?$static_hash";
    } else {
        push @libs, root_url . "js/binary.min.js?$static_hash";
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

    # Portfolio
    push @menu,
        {
        id         => 'topMenuPortfolio',
        url        => url_for('/user/portfoliows'),
        text       => localize('Portfolio'),
        class      => 'client_logged_in invisible',
        link_class => 'pjaxload',
        };

    push @menu,
        {
        id         => 'topMenuProfitTable',
        url        => url_for('/user/profit_tablews'),
        text       => localize('Profit Table'),
        class      => 'client_logged_in invisible',
        link_class => 'pjaxload',
        };

    push @menu,
        {
        id         => 'topMenuStatement',
        url        => url_for('/user/statementws'),
        text       => localize('Statement'),
        class      => 'client_logged_in invisible',
        link_class => 'pjaxload',
        };

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

    push @menu,
        {
        id         => 'topMenuShop',
        class      => 'ja-hide',
        url        => 'https://shop.binary.com',
        text       => localize('Shop'),
        target     => '_blank'
        };

    push @menu,
        {
        id         => 'topMenuPaymentAgent',
        class      => 'invisible',
        url        => url_for('/paymentagent/transferws'),
        text       => localize('Payment Agent'),
        link_class => 'pjaxload'
        };

    # push @{$menu}, $self->_main_menu_trading();

    return \@menu;
}

1;
