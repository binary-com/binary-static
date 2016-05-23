package BS::I18N::Base;

use strict;
use warnings;
use parent 'Locale::Maketext';
use Locale::Maketext::Lexicon;

=head1 NAME

BS::I18N::Base

=head1 SYNOPSIS

    use BS::I18N::Base;
    my $lh = BS::I18N::Base->get_handle('en');
    $lh->maketext("Hello");

=head1 DESCRIPTION

This package is a subclass of L<Locale::Maketext>.

=head1 METHODS

=cut

=head2 $self->plural($num, @strings)

This method handles plural forms. You can invoke it using Locale::Maketext's
bracket notation, like "[plural,_1,string1,string2,...]". Depending on value of
I<$num> and language function returns one of the strings. If string contain %d
it will be replaced with I<$num> value.

=cut

sub plural {
    my ($self, $num, @strings) = @_;
    unless ($self->{_plural}) {
        my $class = ref $self;
        no strict 'refs';    ## no critic
        my $header = ${"${class}::Lexicon"}{"__Plural-Forms"};
        if ($header) {
            $header =~ s/^.*plural\s*=\s*([^;]+);.*$/$1/;
            $header =~ s/\[_([0-9]+)\]/%$1/g;
            die "Invalid expression for plural: $header" if $header =~ /\$|n\s*\(|[A-Za-mo-z]|nn/;
            $header =~ s/n/\$_[0]/g;
            my @where = (__LINE__ + 3, __FILE__);
            $self->{_plural} = eval <<"EOF";    ## no critic
#line $where[0] "$where[1]"
sub {
   return $header;
}
EOF
        } else {
            $self->{_plural} = sub { return $_[0] != 1 };
        }
    }
    my $pos = $self->{_plural}($num);
    $pos = $#strings if $pos > $#strings;
    return sprintf $strings[$pos], $num;
}

=head2 $self->ctx(@comment_strings)

This method may be used to add comment to string, e.g. to describe how it is
used. Method always return empty string.

=cut

sub ctx {
    return '';
}

=begin comment

# Do not remove this comment. It is used by module's test.  These messages are
# for testing purposes, do not change them without changing tests.  Do not
# change translations either.

sub _test_messages_ec497d509e2363a3bde81fe0084884e2
{
    my $lh = shift;
    $lh->maketext("Hello, World!");
    $lh->maketext("[ctx,If you look in the sky]You will see [plural,_1,one star, %d stars].", $num);
    return 1;
}

=end comment

=cut

1;
