package BinaryStatic::Helpers;

use strict;
use warnings;
use base 'Mojolicious::Plugin';

use Text::Haml;
use Mojo::ByteStream;
use HTML::Entities qw( encode_entities );
use JSON qw(to_json decode_json);
use BinaryStatic::Consts;

sub register {
    my ($self, $app) = @_;

    $app->helper(
        cookie_options => sub {
            my $c = shift;
            return {
                domain => $c->req->url->host,
                secure => 1,
                path   => '/',
            };
        });

    $app->helper(
        google_tag_tracking_code => sub {
            my $c = shift;
            return '';
        });
    $app->helper(
        layout => sub {
            my ($c, $layout) = @_;
            $layout //= 'default';
            return $c->is_pjax_request ? $layout . '/content' : $layout;
        });
    $app->helper(
        is_pjax_request => sub {
            my $c = shift;
            return defined $c->req->param('_pjax') ? 1 : 0;
        });
    $app->helper(
        haml => sub {
            return Text::Haml->new();
        });

    $app->helper(
        succeed => sub {
            my ($c, $expr, $block) = @_;
            my $render = $c->haml->render($block);
            return $render . $expr;
        });

    $app->helper(
        precede => sub {
            my ($c, $expr, $block) = @_;
            my $render = $c->haml->render($block);
            return $expr . $render;
        });

    $app->helper(
        surround => sub {
            my ($c, $expr, $block) = @_;
            my $render = $c->haml->render($block);
            return $expr . $render . $expr;
        });

    $app->helper(
        encode_html_text => sub {
            my ($c, $text) = @_;
            return encode_entities($text);
        });

    $app->helper(
        is_logged_in => sub {
            my $c = shift;
            return $c->stash('client');
        });

    # Renderer specific url overrides for encode_entities.
    $app->renderer->add_helper(
        url_for => sub {
            my ($c, @args) = @_;
            return unless @args;
            $args[0] = '/' . $args[0] if $args[0] !~ /^\//; # Mojolicious url_for is a bit different
            return encode_entities($c->url_for(@args), '&');
        });

    $app->helper(
        is_virtual => sub {
            my $c = shift;
            return 0; # $c->stash('request')->broker->is_virtual;
        });

    $app->renderer->add_helper(
        js_configs => sub {
            my ($c) = @_;

            my $config = $c->config;

            my %setting = (
                enable_relative_barrier => 'true',
                image_link              => {
                    hourglass     => $c->url_for('/images/common/hourglass_1.gif')->to_string,
                    up            => $c->url_for('/images/javascript/up_arrow_1.gif')->to_string,
                    down          => $c->url_for('/images/javascript/down_arrow_1.gif')->to_string,
                    calendar_icon => $c->url_for('/images/common/calendar_icon_1.png')->to_string,
                },
                broker               => 'CR',
                valid_loginids       => "MX|VRTC|MLT|CR|FOG|BFT|VRTM|VRTU|WS'",
                streaming_server => 'stream.binary.com',
                arr_all_currencies => ["USD","EUR","GBP","AUD"],
            );

            return {
                libs           => [
                    $config->{static}->{url} .'js/lib.min.js',
                    $config->{static}->{url} .'js/data.min.js',
                    $config->{static}->{url} .'js/binary.min.js'
                ],
                settings       => to_json(\%setting),
            };
        });

    $app->renderer->add_helper(
        menu => sub {
            my ($c) = @_;
            return BinaryStatic::Helpers::Menu->new(c => $c);
        });

    $app->renderer->add_helper(
        css => sub {
            my ($c) = @_;
            return BinaryStatic::Helpers::CSS->new(c => $c);
        });

    $app->renderer->add_helper(
        available_languages => sub {
            return BinaryStatic::Consts::languages();
        });

    $app->renderer->add_helper(
        pjax_link_for => sub {
            my ($c, $text, $href, $class) = @_;
            $class //= '';
            return "<a class=\"pjaxload $class\" href=\"$href\">$text</a>";
        });

    $app->helper(
        l => sub {
            return (shift)->l(@_);
        });

    $app->helper(
        get_current_path => sub {
            my $c = shift;
            return $c->url_for("/");
        });

    $app->helper(
        on_production => sub {
            return 0;
        });

    return 1;
}

package
    BinaryStatic::Helpers::CSS;

use Mojo::Base -base;

has 'c';

sub files {
    my $self = shift;
    my $config = $self->c->config;
    ($config->{static}->{url} . 'css/binary.min.css')
}

package
    BinaryStatic::Helpers::Menu;

use Mojo::Base -base;
use BinaryStatic::Utils qw/today_yyyymmdd/;

has 'c';

sub main_menu {
    my $self = shift;

    my $menu = [];
    push @{$menu}, $self->_main_menu_trading();
    push @{$menu}, $self->_main_menu_myaccount();
    push @{$menu}, $self->_main_menu_cashier();
    push @{$menu}, $self->_main_menu_resources();
    push @{$menu}, $self->_main_menu_charting();

    return $menu;
}

sub _main_menu_trading {
    my $self         = shift;
    my $trading_menu = {
        id        => 'topMenuStartBetting',
        url       => $self->c->url_for('/trade.cgi'),
        text      => $self->c->l("Start Trading"),
        sub_items => [],
    };

    my %translated_display_name = (
        forex => 'Forex',
        indices => 'Indices',
        commodities => 'Commodities',
        random  => 'Randoms',
        smarties => 'Smart Indices',
    );
    foreach my $market ('forex', 'indices', 'commodities', 'random') {
        push @{$trading_menu->{sub_items}}, {
            id         => 'topMenuMarket_' . $market,
            url        => $self->c->url_for('/trade.cgi')->query({market => $market}),
            link_class => 'pjaxload',
            text       => $translated_display_name{$market},
        };
    }

    return $trading_menu;

}

sub _main_menu_myaccount {
    my $self = shift;

    my $my_account_ref = {
        id         => 'topMenuMyAccount',
        url        => $self->c->url_for('/user/my_account'),
        text       => $self->c->l('My Account'),
        class      => 'by_client_type client_real client_virtual',
        link_class => 'with_login_cookies pjaxload',
        sub_items  => [],
    };

    # Portfolio
    push @{$my_account_ref->{sub_items}},
      {
        id         => 'topMenuPortfolio',
        url        => $self->c->url_for('/user/portfolio'),
        text       => $self->c->l('Portfolio'),
        link_class => 'with_login_cookies pjaxload',
      };

    push @{$my_account_ref->{sub_items}},
      {
        id         => 'topMenuProfitTable',
        url        => $self->c->url_for('/user/profit_table'),
        text       => $self->c->l('Profit Table'),
        link_class => 'with_login_cookies pjaxload',
      };

    push @{$my_account_ref->{sub_items}},
      {
        id         => 'topMenuStatement',
        url        => $self->c->url_for('/user/statement'),
        text       => $self->c->l('Statement'),
        link_class => 'with_login_cookies pjaxload',
      };

    push @{$my_account_ref->{sub_items}},
      {
        id         => 'topMenuChangePassword',
        url        => $self->c->url_for('/user/change_password'),
        text       => $self->c->l('Password'),
        link_class => 'with_login_cookies pjaxload',
      };

    push @{$my_account_ref->{sub_items}},
      {
        id         => 'topMenuAccountSettings',
        url        => $self->c->url_for('/user/settings')->query({o => 'settings'}),
        text       => $self->c->l('Settings'),
        id         => 'top_Settings',
        link_class => 'with_login_cookies pjaxload',
      };

    push @{$my_account_ref->{sub_items}},
      {
        id   => 'topMenuBecomeAffiliate',
        url  => $self->c->url_for('/affiliate/signup'),
        text => $self->c->l('Affiliate'),
      };

    push @{$my_account_ref->{sub_items}},
      {
        id         => 'topMenuAuthenticateAccount',
        url        => $self->c->url_for('/cashier/authenticate')->query({o => 'id'}),
        text       => $self->c->l('Authenticate'),
        class      => 'by_client_type client_real',
        link_class => 'with_login_cookies pjaxload',
      };

    return $my_account_ref;
}

sub _main_menu_cashier {
    my $self = shift;

    my $cashier_items_ref = {
        id         => 'topMenuCashier',
        url        => $self->c->url_for('/cashier'),
        text       => $self->c->l('Cashier'),
        link_class => 'pjaxload',
    };

    return $cashier_items_ref;
}

sub _main_menu_resources {
    my $self = shift;

    my $resources_items_ref = {
        id         => 'topMenuResources',
        url        => $self->c->url_for('/resources'),
        text       => $self->c->l('Resources'),
        link_class => 'pjaxload',
    };

    my $asset_index_ref = {
        id         => 'topMenuAssetIndex',
        url        => $self->c->url_for('/resources/asset_index'),
        text       => $self->c->l('Asset Index'),
        link_class => 'pjaxload',
    };

    my $trading_times_ref = {
        id         => 'topMenuTradingTimes',
        url        => $self->c->url_for('/resources/trading_times')->query({date => today_yyyymmdd()}),
        text       => $self->c->l('Trading Times'),
        link_class => 'pjaxload',
    };

    my $bet_guide_ref = {
        id         => 'topMenuContractGuide',
        url        => $self->c->url_for('/resources/contract_guide'),
        text       => $self->c->l('Trading Guide'),
        link_class => 'pjaxload',
    };

    my $pricing_table_ref = {
        id         => 'topMenuPricingTable',
        url        => $self->c->url_for('/resources/pricing_table'),
        text       => $self->c->l('Pricing Table'),
        link_class => 'pjaxload',
        id         => 'pricing_table_lnk',
    };

    my $forward_start_ref = {
        id         => 'topMenuRiseFallTable',
        url        => $self->c->url_for('/resources/rise_fall_table'),
        text       => $self->c->l('Rise / Fall Table'),
        link_class => 'pjaxload',
        id         => 'risefall_table_lnk',
    };

    $resources_items_ref->{'sub_items'} = [$asset_index_ref, $trading_times_ref, $bet_guide_ref, $pricing_table_ref, $forward_start_ref];

    return $resources_items_ref;
}

sub _main_menu_charting {
    my $self = shift;

    my $charting_items_ref = {
        url        => $self->c->url_for('/charting'),
        text       => $self->c->l('Charting'),
        id         => 'topMenuCharting',
        link_class => 'pjaxload',
    };

    my $bomchart_ref = {
        url        => $self->c->url_for('/charting/application'),
        text       => $self->c->l('Java Charts'),
        id         => 'topMenuInteractiveChartid',
        link_class => 'pjaxload',
    };

    # live charts
    my $live_charts_ref = {
        id         => 'topMenuLiveCharts',
        url        => $self->c->url_for('/charting/livechart'),
        text       => $self->c->l('Live Charts'),
        link_class => 'pjaxload',
    };

    # high charts
    my $highcharts_ref = {
        id         => 'topMenuLiveCharts',
        url        => '//highcharts.binary.com',
        text       => $self->c->l('HighCharts'),
        link_class => 'pjaxload',
    };

    $charting_items_ref->{'sub_items'} = [$bomchart_ref, $live_charts_ref, $highcharts_ref];

    return $charting_items_ref;
}

1;
