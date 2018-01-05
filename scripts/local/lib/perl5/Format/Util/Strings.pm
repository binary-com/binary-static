package Format::Util::Strings;

use 5.006;
use strict;
use warnings FATAL => 'all';

use Carp qw(croak);
use Encode;

use base 'Exporter';
our @EXPORT_OK = qw( defang defang_lite set_selected_item );

=head1 NAME

Format::Util::Strings - Miscellaneous routines to do with manipulating strings

=head1 VERSION

Version 0.01

=cut

our $VERSION = '0.01';


=head1 SYNOPSIS

Quick summary of what the module does.

Perhaps a little code snippet.

    use Format::Util::Strings;

    my $foo = Format::Util::Strings->new();
    ...

=head1 EXPORT

    defang

=head1 SUBROUTINES/METHODS

=head2 defang

    Removes potentially dangerous characters from input strings.
    You should probably be using Untaint.

=cut

sub defang {
    my ($string) = @_;

    return '' if not defined $string;
    return '' if length $string < 0;

    $string = defang_lite($string);
    $string =~ tr[/~%][ ];
    return $string;
}

=head2 defang_lite

    Removes potentially dangerous characters from input strings.
    You should probably be using Untaint.
    
    defang_lite is a lighter version that is not so restrictive as defang

=cut

sub defang_lite {
    my ($string) = @_;

    return '' if not defined $string;
    return '' if length $string < 0;
 
    $string = Encode::decode('UTF-8', $string) unless Encode::is_utf8($string);

    if (length($string) > 500) { $string = substr($string, 0, 500); }

    $string =~ tr[\0"{}\\^`><\n\r\f\t][ ];
    $string =~ s/[\P{IsPrint}]/ /g;

    return $string;
}

=head2 set_selected_item($selecteditem, $optionlist)

    Sets the selected item in an <option> list.
    Params  :
    - $selecteditem : the value of the item (usually taken from %input)
    - $optionlist : The option list, as either an HTML string or a hash ref conforming to our oop::Form standard.
    Returns : If hash ref given, 1 if selected item is set, false otherwise
    If HTML given, the altered HTML

=cut

sub set_selected_item {
    my ($selecteditem, $optionlist) = @_;

    my $ret_val;
    if (ref $optionlist eq 'HASH') {
        OPTION:
        foreach my $option (@{$optionlist->{'input'}->{'options'}}) {
            if ($option->{'value'} eq $selecteditem) {
                $option->{'selected'} = 'selected';
                $ret_val = 1;
            }
        }
    } elsif ($optionlist) {
        $ret_val = $optionlist;
        if ($selecteditem) {
            $ret_val =~ s/(value\=[\"\']?$selecteditem[\"\']?\>)/selected="selected" $1/i;
            $ret_val =~ s/(\<OPTION\>$selecteditem)/<option selected="selected">$selecteditem/i;
        }
    }
    return $ret_val;
}

=head1 AUTHOR

binary.com, C<< <rakesh at binary.com> >>

=head1 BUGS

Please report any bugs or feature requests to C<bug-format-util at rt.cpan.org>, or through
the web interface at L<http://rt.cpan.org/NoAuth/ReportBug.html?Queue=Format-Util>.  I will be notified, and then you'll
automatically be notified of progress on your bug as I make changes.




=head1 SUPPORT

You can find documentation for this module with the perldoc command.

    perldoc Format::Util::Strings


You can also look for information at:

=over 4

=item * RT: CPAN's request tracker (report bugs here)

L<http://rt.cpan.org/NoAuth/Bugs.html?Dist=Format-Util>

=item * AnnoCPAN: Annotated CPAN documentation

L<http://annocpan.org/dist/Format-Util>

=item * CPAN Ratings

L<http://cpanratings.perl.org/d/Format-Util>

=item * Search CPAN

L<http://search.cpan.org/dist/Format-Util/>

=back


=head1 ACKNOWLEDGEMENTS


=head1 LICENSE AND COPYRIGHT

Copyright 2014 binary.com.

This program is free software; you can redistribute it and/or modify it
under the terms of the the Artistic License (2.0). You may obtain a
copy of the full license at:

L<http://www.perlfoundation.org/artistic_license_2_0>

Any use, modification, and distribution of the Standard or Modified
Versions is governed by this Artistic License. By using, modifying or
distributing the Package, you accept this license. Do not use, modify,
or distribute the Package, if you do not accept this license.

If your Modified Version has been derived from a Modified Version made
by someone other than you, you are nevertheless required to ensure that
your Modified Version complies with the requirements of this license.

This license does not grant you the right to use any trademark, service
mark, tradename, or logo of the Copyright Holder.

This license includes the non-exclusive, worldwide, free-of-charge
patent license to make, have made, use, offer to sell, sell, import and
otherwise transfer the Package with respect to any patent claims
licensable by the Copyright Holder that are necessarily infringed by the
Package. If you institute patent litigation (including a cross-claim or
counterclaim) against any party alleging that the Package constitutes
direct or contributory patent infringement, then this Artistic License
to you shall terminate on the date that such litigation is filed.

Disclaimer of Warranty: THE PACKAGE IS PROVIDED BY THE COPYRIGHT HOLDER
AND CONTRIBUTORS "AS IS' AND WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES.
THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE, OR NON-INFRINGEMENT ARE DISCLAIMED TO THE EXTENT PERMITTED BY
YOUR LOCAL LAW. UNLESS REQUIRED BY LAW, NO COPYRIGHT HOLDER OR
CONTRIBUTOR WILL BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR
CONSEQUENTIAL DAMAGES ARISING IN ANY WAY OUT OF THE USE OF THE PACKAGE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


=cut

1; # End of Format::Util::Strings
