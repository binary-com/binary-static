#!/usr/bin/perl

package ExtraTranslator;

use IO::File;
use Locale::Maketext::Extract;

my $pot_filename = '../src/config/locales/messages.pot';
die "Unable to open $pot_filename for writing" if (not -w $pot_filename);

my @file_container = get_file_container();
my %extant_msg_ids = get_extant_msg_ids();

add_titles();


sub add_titles {
    my $fh = pot_append_fh();

    # read page titles from config/pages.pl
    require "config/pages.pl";
    my @m = all_pages();
    foreach my $m (@m) {
        if ($m->[3]) {
            my $msgid = msg_id($m->[3]);
            if (is_id_unique($msgid)) {
                print $fh "\n";
                print $fh $msgid . "\n";
                print $fh "msgstr \"\"\n";
            }
        }
    }
    return;
}

sub msg_id {
    my $string = shift;
    return 'msgid "' . Locale::Maketext::Extract::_maketext_to_gettext($string) . '"';
}

sub get_file_container {
    my $current_pot = IO::File->new($pot_filename, 'r');
    my @content     = <$current_pot>;
    return @{[map { chomp; $_ } @content]};
}

sub is_id_unique {
    my $key = shift;

    my $flag = 0;
    if (not exists $extant_msg_ids{$key}) {
        $flag = 1;
        $extant_msg_ids{$key} = undef;
    }

    return $flag;
}

sub get_extant_msg_ids {
    return map { $_ => undef } grep { index($_, 'msgid') == 0 } @file_container;
}

sub pot_append_fh {
    return IO::File->new($pot_filename, 'a');
}

1;
