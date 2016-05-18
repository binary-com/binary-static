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

    # quick fix
    $url = '/' . $url if grep { $url eq $_ } @HTML_URLS;

    if ($url =~ m{^/?(images|css|scripts)/}) {
        $url =~ s/^\///;
        return Mojo::URL->new(root_url() . $url);
    }

    %HTML_URLS = map { '/' . $_ => 1 } @HTML_URLS unless keys %HTML_URLS;
    if ($HTML_URLS{$url}) {
        $url =~ s/^\///;
        return Mojo::URL->new(root_url() . "$LANG/$url.html");
    }
    # /terms-and-conditions#privacy-tab
    my ($upre, $upost) = ($url =~ /^(.*?)\#(.*?)$/);
    if ($upost and $HTML_URLS{$upre}) {
        $upre =~ s/^\///;
        return Mojo::URL->new(root_url() . "$LANG/$upre.html#$upost");
    }
    # for link alternate
    my $query = $args[1] || {};
    if ($query->{l} and $query->{l} ne $LANG) {
        # /binary-static-www2/en/home.html
        $url =~ s{^(/binary-static-www2)?/(\w+)/(.+)\.html$}{/$3};
        if ($HTML_URLS{$url}) {
            $url =~ s/^\///;
            return Mojo::URL->new(root_url() . lc($query->{l}) . "/$url.html");
        }
    }

    my $uri = Mojo::URL->new($url);
    $uri->query($query);
    return $uri;
}

package BS::Request::Website;

use Moo;

sub display_name { 'Binary.com' }

1;
