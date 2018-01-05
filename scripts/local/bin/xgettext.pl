#!/usr/bin/perl

eval 'exec /usr/bin/perl  -S $0 ${1+"$@"}'
    if 0; # not running under some shell
use strict;
use Locale::Maketext::Extract::Run 'xgettext';

if (@ARGV) {
    xgettext(@ARGV);
}
else {
    system(qq[perldoc "$0"]);
}

# PODNAME:  xgettext.pl
# ABSTRACT: Extract translatable strings from source

__END__

=pod

=encoding UTF-8

=head1 NAME

xgettext.pl - Extract translatable strings from source

=head1 VERSION

version 1.00

=head1 SYNOPSIS

B<xgettext.pl> [I<OPTION>] [I<INPUTFILE>]...

=head1 DESCRIPTION

This program extracts translatable strings from given input files, or
from B<STDIN> if none are given.

Please see L<Locale::Maketext::Extract> for a list of supported input file
formats.

=head1 OPTIONS

Mandatory arguments to long options are mandatory for short options too.
Similarly for optional arguments.

=head2 Input file location:

=over 4

=item I<INPUTFILE>...

Files to extract messages from.  If not specified, B<STDIN> is assumed.

=item B<-f>, B<--files-from>=I<FILE>

Get list of input files from I<FILE>.

=item B<-D>, B<--directory>=I<DIRECTORY>

Add I<DIRECTORY> to list for input files search.

=back

=head2 Input file format:

=over 4

=item B<-u>, B<--use-gettext-style>

Specifies that the source programs uses the B<Gettext> style (e.g.
C<%1>) instead of the B<Maketext> style (e.g. C<[_1]>) in its
localization calls.

=back

=head2 Output file location:

=over 4

=item B<-d>, B<--default-domain>=I<NAME>

Use I<NAME>.po for output, instead of C<messages.po>.

=item B<-o>, B<--output>=I<FILE>

PO file name to be written or incrementally updated; C<-> means writing
to B<STDOUT>.

=item B<-p>, B<--output-dir>=I<DIR>

Output files will be placed in directory I<DIR>.

=back

=head2 Output details:

=over 4

=item B<-g>, B<--gnu-gettext>

Enables GNU gettext interoperability by printing C<#, perl-maketext-format>
before each entry that has C<%> variables.

=item B<-W>, B<--wrap>

If wrap is enabled, then, for entries with multiple file locations, each
location is listed on a separate line. The default is to put them all
on a single line.

Other comments are not affected.

=back

=head2 Plugins:

By default, all builtin parser plugins are enabled for all file types, with
warnings turned off.

If any plugin is specified on the command line, then warnings are turned
on by default - you can turn them off with C<-now>

=over 4

=item B<-P>|B<--plugin> pluginname

    Use the specified plugin for the default file types recognised by that
    plugin.

=item B<-P>|B<--plugin> 'pluginname=*'

    Use the specified plugin for all file types.

=item B<-P>|B<--plugin> pluginname=ext,ext2

    Use the specified plugin for any files ending in C<.ext> or C<.ext2>

=item B<-P>|B<--plugin> My::Module::Name='*'

    Use your custom plugin module for all file types

=back

Multiple plugins can be specified on the command line.

=head3 Available plugins:

=over 4

=item C<perl>    : L<Locale::Maketext::Extract::Plugin::Perl>

For a slightly more accurate but much slower Perl parser, you can use
the PPI plugin. This does not have a short name, but must be specified in
full, eg:

    xgettext.pl -P Locale::Maketext::Extract::Plugin::PPI

=item C<tt2>     : L<Locale::Maketext::Extract::Plugin::TT2>

=item C<yaml>    : L<Locale::Maketext::Extract::Plugin::YAML>

=item C<formfu>  : L<Locale::Maketext::Extract::Plugin::FormFu>

=item C<mason>   : L<Locale::Maketext::Extract::Plugin::Mason>

=item C<text>    : L<Locale::Maketext::Extract::Plugin::TextTemplate>

=item C<generic> : L<Locale::Maketext::Extract::Plugin::Generic>

=back

=head2 Warnings:

If a parser plugin encounters a syntax error while parsing, it will abort
parsing and hand over to the next parser plugin.  If warnings are turned
on then the error will be echoed to STDERR.

Off by default, unless any plugin has been specified on the command line.

=over 4

=item B<-w>|B<--warnings>

=item B<-now>|B<--nowarnings>

=back

=head2 Verbose:

If you would like to see which files have been processed, which plugins were
used, and which strings were extracted, then enable C<verbose>. If no
acceptable plugin was found, or no strings were extracted, then the file
is not listed:

=over 4

=item B<-v>|B<--verbose>

Lists processed files.

=item B<-v -v>|B<--verbose --verbose> :

Lists processed files and which plugins managed to extract strings.

=item B<-v -v>|B<--verbose --verbose> :

Lists processed files, which plugins managed to extract strings, and the
extracted strings, the line where they were found, and any variables.

=back

=head1 SEE ALSO

=over 4

=item L<Locale::Maketext::Extract>

=item L<Locale::Maketext::Lexicon::Gettext>

=item L<Locale::Maketext>

=item L<Locale::Maketext::Extract::Plugin::Perl>

=item L<Locale::Maketext::Extract::Plugin::PPI>

=item L<Locale::Maketext::Extract::Plugin::TT2>

=item L<Locale::Maketext::Extract::Plugin::YAML>

=item L<Locale::Maketext::Extract::Plugin::FormFu>

=item L<Locale::Maketext::Extract::Plugin::Mason>

=item L<Locale::Maketext::Extract::Plugin::TextTemplate>

=item L<Locale::Maketext::Extract::Plugin::Generic>

=back

=head1 AUTHORS

Audrey Tang E<lt>cpan@audreyt.orgE<gt>

=head1 COPYRIGHT

Copyright 2002-2008 by Audrey Tang E<lt>cpan@audreyt.orgE<gt>.

This software is released under the MIT license cited below.

=head2 The "MIT" License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

=head1 AUTHORS

=over 4

=item *

Clinton Gormley <drtech@cpan.org>

=item *

Audrey Tang <cpan@audreyt.org>

=back

=head1 COPYRIGHT AND LICENSE

This software is Copyright (c) 2014 by Audrey Tang.

This is free software, licensed under:

  The MIT (X11) License

=cut
