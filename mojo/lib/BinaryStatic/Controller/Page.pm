package BinaryStatic::Controller::Page;

use Mojo::Base 'Mojolicious::Controller';
use BinaryStatic::Consts;

sub toolkit {
    my $c = shift;

    my $curr_path = $c->req->url->path->to_string;
    $curr_path =~ s/^\/|\/$//g;

    $curr_path = '/' if $curr_path eq '';

    # template, layout, code
    my %url_map = (
        'c/open_account.cgi' => ['account/open_account', 'default'],
        'c/affiliate_signup.cgi' => ['affiliates/main', 'default'],
        'c/pricing_table.cgi' => ['resources/pricing_table_form', 'default'],
        # 'c/asset_index.cgi' => ['resources/pricing_table_form', 'default'],
        'c/chart_application.cgi' => ['charting/chart_application', 'default'],
        'c/livechart.cgi' => ['charting/livechart', 'default'],
        'c/rise_fall_table.cgi' => ['resources/rise_fall_table', 'default'],
    );
    my $m = $url_map{$curr_path};

    unless ($m) {
        print STDERR "[FIX] Can't find related tt for $curr_path\n";
        return $c->render(
            template => 'not_found',
            handler => 'haml',
            status => 404
        );
    }

    ## get all render helpers and register them
    # my $helpers = $c->app->renderer->helpers;
    # foreach my $helper (keys %$helpers) {
    foreach my $helper ('l', 'menu') {
        $c->stash($helper => sub {
            $c->app->$helper(@_);
        });
    }

    $c->render(
        template => $m->[0],
        handler => 'haml',
        defined $m->[1] ? (layout => $m->[1] ? $c->layout($m->[1]) : '') : (),
        $m->[2] ? (status => $m->[2]) : (),

        handler => 'tt',

        ## fix subs for TT2 call
        javascript => $c->app->js_configs,
        css_files  => $c->app->css->files,
        request => {
            url_for => sub { $c->app->url_for(@_); } # use the helper
        },
    );
}

sub haml {
    my $c = shift;

    my $curr_path = $c->req->url->path->to_string;
    $curr_path =~ s/^\/|\/$//g;

    $curr_path = '/' if $curr_path eq '';

    # template, layout, code
    my %url_map = (
        '/' => ['home/index', 'full_width', '', 1],
        'home' => ['home/index', 'full_width', '', 1],
        'ticker' => ['home/ticker', ''],

        'why-us' => ['static/why_us', 'full_width'],
        'partnerapi' => ['static/devguide', 'full_width'],
        'devguide' => ['static/partner_api', 'full_width'],
        'tour' => ['static/tour', 'full_width'],
        'responsible-trading' => ['static/responsible_trading', 'full_width'],
        'careers' => ['static/careers', 'full_width'],
        'group-history' => ['static/group_history', 'full_width'],
        'smart-indices' => ['static/smart_indices', 'full_width'],
        'open-source-projects' => ['static/open_source_projects', 'full_width'],
        'contact' => ['static/contact', 'full_width'],

        'resources' => ['resources/index', $c->layout],
        'charting'  => ['charting/index', $c->layout],
        'about-us'  => ['about/index', $c->layout],

        'styles' => ['home/styles', 'full_width', '', 1],

        'get-started' => ['get_started/index', 'get_started'],
        'get-started/what-is-binary-trading' => ['get_started/what_is_binary_trading', 'get_started'],
        'get-started/binary-options-basics' => ['get_started/binary_options_basics', 'get_started'],
        'get-started/benefits-of-trading-binaries' => ['get_started/benefits_of_trading_binaries', 'get_started'],
        'get-started/how-to-trade-binaries' => ['get_started/how_to_trade_binaries', 'get_started'],
        'get-started/types-of-trades' => ['get_started/types_of_trades', 'get_started'],
        'get-started/beginners-faq' => ['get_started/beginners_faq', 'get_started'],
        'get-started/glossary' => ['get_started/glossary', 'get_started'],
        'get-started/random-markets' => ['get_started/random_markets', 'full_width'],

        'login' => ['home/login', $c->layout, '', 1],

        'not_found' => ['not_found', '', 404],
        'exception' => ['exception', 'exception', 500]
    );
    my $m = $url_map{$curr_path} || $url_map{'not_found'};

    ## page vars
    my @extra_stash;
    if ($curr_path eq 'ticker') {
        push @extra_stash, (rows => [ BinaryStatic::Consts::ticker() ]);
    } elsif ($curr_path eq 'login') {
        push @extra_stash, (loginid => $c->param('loginid')) if $c->param('loginid');
    }

    $c->render(
        template => $m->[0],
        handler => 'haml',
        defined $m->[1] ? (layout => $m->[1] ? $c->layout($m->[1]) : '') : (),
        $m->[2] ? (status => $m->[2]) : (),
        @extra_stash
    );
}

sub timestamp {
    my $self = shift;
    return $self->render(json => {timestamp => time});
}

sub country {
    my $self = shift;
    return $self->render(
        json => {
            country => 'cn',
            ip      => '60.180.68.53'
        },
        status => 200,
    );
}

sub robots_txt {
    my $self = shift;
    return $self->render(
        data   => "User-agent: *\nDisallow",
        format => 'txt',
    );
}

sub offline {
    my $self = shift;
    return $self->render(
        text   => '<div class="center">' . $self->l('Unable to contact the server') . '</div>',
        status => 200,
    );
}

sub open_account_with_promocode {
    my $self           = shift;
    my $promo_code     = $self->param('promo');
    my $affilate_token = $self->param('t');
    return $self->redirect_to(
        'linkto_acopening.cgi',
        {
            actype          => 'real',
            promotionalcode => $promo_code,
            t               => $affilate_token
        });
}

sub login {
    my $self = shift;
    my ($loginid, $password);
    my $redirect        = 'login';
    my $redirect_params = {};

    if (not($self->param('loginid') =~ /^\s*[A-Z]{2,6}\d{3,}\s*$/i)) {
        $self->flash(error => {loginid => $self->l('Login ID not given.')});
    } elsif (not $self->param('password')) {
        $self->flash(error => {password => $self->l('Password not given.')});
    } else {
        ($loginid, $password) = (uc $self->param('loginid'), $self->param('password'));

        $loginid =~ s/^\s+|\s+$//g;
        $self->stash(loginid => $loginid);

        my $response = ($loginid eq 'DEMO123' and $password eq 'demo') ?
            { success => 1, session_cookie => Mojo::Cookie->new(value => 'abcdefghijklmn')} : {};
        if ($response->{success}) {
            $self->stash(just_logged_in => 1);
            $redirect = 'my_account.cgi';
            $redirect_params->{login} = 'true';
            my $options = $self->cookie_options;
            $options->{expires} = time + 86400 * 30;
            my $cookie = $response->{session_cookie};
            my $cookie_value = $cookie->value // '';
            $self->cookie(
                'cookie_name' => $cookie_value, # FIX the cookie_name
                $options
            );
            $self->cookie(
                'loginid' => $loginid,
                $options
            );
        } else {
            my $msg = $response->{error}->{description} || 'Invalid login ID and password combination.';
            $self->flash(error => {password => $self->l($msg)});
        }
    }
    $redirect_params->{loginid} = $loginid if $loginid;

    $self->res->headers->location($self->url_for($redirect, $redirect_params)->to_abs);
    return $self->rendered(302);
}

sub logout {
    my $self = shift;

    my $options = $self->cookie_options;
    $options->{expires} = 1;
    $self->cookie(
        'cookie_name' => '', # fix cookie_name
        $options
    );
    $self->cookie(
        'loginid' => '',
        $options
    );
    $self->cookie(
        'settings_cookie' => '',
        $options
    );

    return $self->redirect_to('/');
}

sub not_found {
    my $self = shift;
    return $self->render(
        template => 'not_found',
        status   => 404,
    );
}

sub exception {
    my $self = shift;
    return $self->render(
        template => 'exception',
        layout   => 'exception',
        status   => 500,
    );
}

1;
