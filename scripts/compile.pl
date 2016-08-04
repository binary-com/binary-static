#!/usr/bin/perl

use strict;
use warnings;
use v5.10;
use FindBin qw/$Bin/;
use lib "$Bin/lib";
use Getopt::Long;
use Path::Tiny;
use HTML::Entities qw( encode_entities );
use Encode;
use Term::ANSIColor;

use BS qw/set_is_dev is_dev branch set_branch localize set_lang all_languages lang_display_name tt2 css_files js_config menu get_static_hash set_static_hash/;
use BS::Request;

require "config/pages.pl";

# force = re-generate all files
# dev   = for domain like http://fayland.github.io/binary-static/ which has a sub path
# branch = will add br_[branch_name] to path
# pattern = the url pattern to rebuild
# verbose = to display list of all generated files
my $force;
my $is_dev;
my $branch;
my $pattern;
my $verbose;
GetOptions(
    "force|f"     => \$force,
    "dev|d"       => \$is_dev,
    "branch|b=s"  => \$branch,
    "pattern|p=s" => \$pattern,
    "verbose|vr"  => \$verbose,
);
set_is_dev() if $is_dev;
set_branch($branch) if $branch;

my @langs = map { lc $_ } all_languages();
my @m = all_pages();

## config
my $root_path = substr $Bin, 0, rindex($Bin, '/');
my $dist_path = "$root_path/dist".($branch ? '/'.branch() : '');
my $hash_file = "$dist_path/version";
@BS::Request::HTML_URLS = map { $_->[0] } @m;
my $index = 0;
$| = 1;
print colored(['cyan'], "Target: ")."$dist_path\n";

mkdir("$dist_path") unless -d "$dist_path";
foreach my $lang (@langs) {
    mkdir("$dist_path/$lang")      unless -d "$dist_path/$lang";
    mkdir("$dist_path/$lang/pjax") unless -d "$dist_path/$lang/pjax";
}

if ($pattern) {
    @m = grep {index($_->[0], $pattern) > -1} @m;
    $force = 1;
    # use the last hash to maintain consistency between current templates with new one
    # since pattern specified, so one or few templates are going to be compiled not all of them
    if(open(my $file_handler, '<', $hash_file)) {
        set_static_hash(<$file_handler>);
        close $file_handler;
    }
}

foreach my $m (@m) {
    my $save_as  = $m->[0];
    my $tpl_path = $m->[1];
    my $layout   = $m->[2];
    my $title    = $m->[3];

    $index++;

    foreach my $lang (@langs) {
        if ($m->[4] and index($m->[4], $lang) > -1) {
            next;
        }

        my $save_as_file = "$dist_path/$lang/pjax/$save_as.html";
        next if -e $save_as_file and not $force;

        set_lang($lang);

        my $request = BS::Request->new(
            language => uc $lang,
        );

        my $current_route = $save_as;
        $current_route =~ s{^(.+)/}{}sg;

        my %stash = (
            website_name    => $request->website->display_name,
            browser_title   => ($title ? localize($title).' | ' : '') . $request->website->display_name,
            request         => $request,
            language        => uc $lang,
            current_path    => $save_as,
            current_route   => $current_route,
            affiliate_email => 'affiliates@binary.com',
            full_width      => $layout && $layout eq 'full_width',
            get_started     => $layout && $layout eq 'get_started'
        );

        if ($title) {
            $stash{title} = localize($title);
        }

        my $file = "$tpl_path.html.tt";    # no Absolute path

        my $output = tt2_handle($file, %stash);

        ## pjax is using layout/$layout/content
        my $layout_file = "global/layout.html.tt";
        $stash{is_pjax_request} = 1;
        $stash{content}         = $output;
        my $layout_output = tt2_handle($layout_file, %stash);

        print colored(['green'], ($verbose ? "" : "\e[K\r")."[$index / ".(scalar @m)."] ($lang) => ")."/$lang/$save_as.html".($verbose ? "\n" : "");

        my $path = path($save_as_file);
        $path->parent->mkpath if $save_as =~ '/';
        $path->spew_utf8($layout_output);

        ## not pjax
        $save_as_file = "$dist_path/$lang/$save_as.html";
        if ($layout) {
            $stash{is_pjax_request} = 0;
            $stash{content}         = $output;
            $layout_output = tt2_handle($layout_file, %stash);
        }
        $path = path($save_as_file);
        $path->parent->mkpath if $save_as =~ '/';
        $path->spew_utf8($layout_output);
    }
}
print "\n";

# save latest hash
if(not $pattern) {
    # my $static_hash = get_static_hash();
    path($hash_file)->spew_utf8(get_static_hash());
}

sub tt2_handle {
    my ($file, %stash) = @_;

    my $tt2 = tt2();

    my $request = $stash{request};

    $stash{javascript}       = js_config();
    $stash{css_files}        = [css_files()];
    $stash{iso639a_language} = $request->language;
    $stash{icon_url}         = $request->url_for('images/common/favicon_1.ico');
    $stash{lang}             = $request->language;
    $stash{menu}             = menu();
    $stash{is_japan}         = 1 if index($stash{current_path}, 'jptrading') > -1;

    ## global/language_form.html.tt
    $stash{language_options} = [
        map { {code => $_, text => decode_utf8(lang_display_name($_)), value => uc($_), selected => uc($stash{iso639a_language}) eq uc($_) ? 1 : 0,} }
            all_languages()];

    my $output = '';
    $tt2->process($file, \%stash, \$output) or die $tt2->error(), "\n";

    return $output;
}

1;
