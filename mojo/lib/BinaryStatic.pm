package BinaryStatic;

use Mojo::Base 'Mojolicious';
use Mojo::Util qw/slurp/;
use JSON;
use Template;

sub startup {
    my $self = shift;

    $self->config(decode_json(slurp $self->home->rel_dir('../config.json')));

    $self->plugin(charset => {charset => 'utf-8'});
    $self->plugin('DefaultHelpers');
    $self->plugin('TagHelpers');
    $self->plugin('BinaryStatic::Helpers');

    # fix paths
    $self->renderer->paths([
        $self->home->rel_dir('../src/templates/haml'),
        $self->home->rel_dir('../src/templates/toolkit')
    ]);
    $self->static->paths([
        $self->home->rel_dir('../src')
    ]);

    $self->plugin('haml_renderer', { cache => 0 });
    $self->plugin('tt_renderer' => {
        template_options => {
            ENCODING     => 'utf8',
            INTERPOLATE  => 1,
            PRE_CHOMP    => $Template::CHOMP_GREEDY,
            POST_CHOMP   => $Template::CHOMP_GREEDY,
            TRIM         => 1,
        }
    });
    $self->renderer->default_handler( 'haml' );
    $self->defaults(layout => 'default');

    # translation
    $self->plugin('I18N', { default => 'en' });
    $self->hook(before_dispatch => sub {
        my $c = shift;

        ## language
        if (my $lang = $c->req->param('l')) {
            $c->languages(lc $lang); # I18N
            $c->session(__lang => lc $lang);
        }
        $c->stash(language => uc($c->session('__lang') || 'en'));

        # other common variables
        $c->stash(website_name => $c->config->{website_name});
    });

    # Router
    my $r = $self->routes;

    $r->get('/')->to('page#haml');
    $r->get('/home')->to('page#haml');
    $r->get('/promo/:promo')->to('page#open_account_with_promocode');
    $r->get('/ticker')->to('page#haml');
    $r->get('/timestamp')->to('page#timestamp');
    $r->get('/country')->to('page#country');
    $r->get('/why-us')->to('page#haml');
    $r->get('/partnerapi')->to('page#haml');
    $r->get('/devguide')->to('page#haml');

    #CRO - Matjaz
    $r->get('/home5')->to('page#haml');
    
    # Routing for this rather than adding the file to public/ as everything
    # in public/ will be served by our CDN. We want this served by Mojo.
    $r->get('/robots.txt')->to('page#robots_txt');

    $r->get('/tour')->to('page#haml');
    $r->get('/responsible-trading')->to('page#haml');
    $r->get('/careers')->to('page#haml');
    $r->get('/group-history')->to('page#haml');
    $r->get('/smart-indices')->to('page#haml');
    $r->get('/open-source-projects')->to('page#haml');
    $r->get('/resources')->to('page#haml');
    $r->get('/charting')->to('page#haml');
    $r->get('/about-us')->to('page#haml');
    $r->get('/contact')->to('page#haml');

    # Display to clients from AppCache when they are offline.
    $r->get('/offline')->to('page#offline');

    $r->get('/styles')->to('page#haml');

    my $get_started = $r->get('/get-started');
    $get_started->get('/')->to('page#haml');
    $get_started->get('/what-is-binary-trading')->to('page#haml');
    $get_started->get('/binary-options-basics')->to('page#haml');
    $get_started->get('/benefits-of-trading-binaries')->to('page#haml');
    $get_started->get('/how-to-trade-binaries')->to('page#haml');
    $get_started->get('/types-of-trades')->to('page#haml');
    $get_started->get('/beginners-faq')->to('page#haml');
    $get_started->get('/glossary')->to('page#haml');
    $get_started->get('/random-markets')->to('page#haml');

    ## login
    $r->get('/login')->to('page#haml')->name('login');
    $r->post('/login')->to('page#login');
    $r->get('/logout')->to('page#logout');

    $r->get('/c/open_account.cgi')->to('page#toolkit');
    $r->get('/c/affiliate_signup.cgi')->to('page#toolkit');
    $r->get('/c/pricing_table.cgi')->to('page#toolkit');
    # $r->get('/c/asset_index.cgi')->to('page#toolkit');
    $r->get('/c/chart_application.cgi')->to('page#toolkit');
    $r->get('/c/livechart.cgi')->to('page#toolkit');
    $r->get('/c/rise_fall_table.cgi')->to('page#toolkit');

    $r->route('/exception')->to('page#exception');
    $r->route('/*')->to('page#not_found');

}

1;
