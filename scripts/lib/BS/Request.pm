package BS::Request;

use Moo;
use BS qw/root_url/;

has 'language' => (is => 'rw');
has 'website'  => (is => 'lazy');
sub _build_website { return BS::Request::Website->new }

sub param  { }         # return nothing
sub broker { 'CR' }    # hardcode

our @HTML_URLS;        # from compile.pl
my %HTML_URLS;

sub url_for {
    my $self = shift;
    my @args = @_;

    my $LANG = lc $self->language;
    my $url = $args[0] || '';

    # alias
    $url = '/home' if $url eq '' or $url eq '/';

    %HTML_URLS = map { '/' . $_ => 1 } @HTML_URLS unless keys %HTML_URLS;
    my $root_url = root_url();
    $root_url =~ s{/$}{};

    if ($url =~ m{^/?(images|js|css|scripts|download)/}) {
        $url =~ s/^\///;
        return Mojo::URL->new(root_url() . $url);
    }

    my $uri  = Mojo::URL->new($url);
    my $path = $uri->path;
    $path = '/' . $path if grep { $path eq $_ } @HTML_URLS;
    if ($HTML_URLS{$path}) {
        my $x = $uri->clone->path("$root_url/${LANG}$path.html");
        # print "$url -> $path -> $x\n";
        return $x;
    }

    # for link alternate
    my $query = $args[1] || {};
    if ($query->{l} and $query->{l} ne $LANG) {
        # /binary-static/en/home.html
        $url =~ s{^(/binary-static)?/(\w+)/(.+)\.html$}{/$3};
        if ($HTML_URLS{$url}) {
            $url =~ s/^\///;
            return Mojo::URL->new(root_url() . lc($query->{l}) . "/$url.html");
        }
    }

    # warn "XX $url -> $path\n";

    $uri->query($query);
    return $uri;
}

package BS::Request::Website;

use Moo;

sub display_name { 'Binary.com' }

1;
