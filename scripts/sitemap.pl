#!/usr/bin/perl

use strict;
use warnings;
use FindBin qw/$Bin/;
use lib "$Bin/lib";
use XML::Writer;
use IO::File;
use Term::ANSIColor;

use BS qw/all_languages/;

my @langs = map { lc $_ } all_languages();
my @urls = (
    # path (without .html)    , changefreq, priority, exclude languages
    ['home'                   , 'monthly', '1.00' , 'ja'],
    ['home-jp'                , 'monthly', '1.00' , 'NOT-ja'],
    ['why-us'                 , 'monthly', '0.80' , 'ja'],
    ['why-us-jp'              , 'monthly', '0.80' , 'NOT-ja'],
    ['tour'                   , 'monthly', '0.80' , 'ja'],
    ['tour-jp'                , 'monthly', '0.80' , 'NOT-ja'],
    ['platforms'              , 'monthly', '0.80' , 'ja'],
    ['trading'                , 'monthly', '0.80' , 'ja'],
    ['multi_barriers_trading' , 'monthly', '0.80'],
    ['contact'                , 'monthly', '0.80'],
    ['about-us'               , 'monthly', '0.80'],
    ['partners'               , 'monthly', '0.80' , 'ja'],
    ['cashier'                , 'monthly', '0.80'],
    ['careers'                , 'monthly', '0.80' , 'ja'],
    ['security-testing'       , 'monthly', '0.80'],
    ['open-positions'         , 'monthly', '0.80'],
    ['payment-agent'          , 'monthly', '0.80'],
    ['group-history'          , 'monthly', '0.80'],
    ['regulation'             , 'monthly', '0.80' , 'id'],
    ['affiliate/signup'       , 'monthly', '0.80' , 'ja'],
    ['responsible-trading'    , 'monthly', '0.80' , 'ja'],
    ['terms-and-conditions'   , 'monthly', '0.80' , 'ja'],
    ['terms-and-conditions-jp', 'monthly', '0.80' , 'NOT-ja'],
    ['open-source-projects'   , 'monthly', '0.80' , 'ja'],

    ['cashier/payment_methods' , 'monthly', '0.80', 'ja'],
    ['cashier/epg_forwardws'   , 'monthly', '0.80', 'NOT-ja'],
    ['resources/asset_indexws' , 'monthly', '0.80', 'ja'],
    ['resources/market_timesws', 'monthly', '0.80'],

    ['get-started'                             , 'monthly', '0.80', 'ja'],
    ['get-started/what-is-binary-trading'      , 'monthly', '0.80', 'ja'],
    ['get-started/types-of-trades'             , 'monthly', '0.80', 'ja'],
    ['get-started/binary-options-basics'       , 'monthly', '0.80', 'ja'],
    ['get-started/why-trade-with-us'           , 'monthly', '0.80', 'ja'],
    ['get-started/how-to-trade-binaries'       , 'monthly', '0.80', 'ja'],
    ['get-started/volidx-markets'              , 'monthly', '0.80', 'ja'],
    ['get-started/smart-indices'               , 'monthly', '0.80', 'ja'],
    ['get-started/otc-indices-stocks'          , 'monthly', '0.80', 'ja'],
    ['get-started/beginners-faq'               , 'monthly', '0.80', 'ja'],
    ['get-started/glossary'                    , 'monthly', '0.80', 'ja'],

    ['get-started-jp'                          , 'monthly', '0.80', 'NOT-ja'],
    ['company-profile'                         , 'monthly', '0.80', 'NOT-ja'],
    ['service-announcements'                   , 'monthly', '0.80', 'NOT-ja'],
);


my $root_path = substr $Bin, 0, rindex($Bin, '/');
my $output = IO::File->new(">$root_path/sitemap.xml");

my $writer = XML::Writer->new(OUTPUT => $output, DATA_INDENT => 4, DATA_MODE => 1);
$writer->xmlDecl('UTF-8');

$writer->startTag('urlset',
    'xmlns'              => 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:xsi'          => 'http://www.w3.org/2001/XMLSchema-instance',
    'xsi:schemaLocation' => 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd');

my $url_prefix = 'https://www.binary.com/';
my $excluded = 0;

foreach my $lang (@langs) {
    foreach my $url (@urls) {
        if ($url->[3]) {
            my $exclude = $url->[3];
            if (($exclude =~ /^NOT-/ & $exclude !~ $lang) or
                ($exclude !~ /^NOT-/ & $exclude =~ $lang)) {
                $excluded++;
                next;
            }
        }

        $writer->startTag('url');

        $writer->dataElement('loc'       , $url_prefix.$lang.'/'.$url->[0].'.html');
        $writer->dataElement('changefreq', $url->[1]);
        $writer->dataElement('priority'  , $url->[2]);

        $writer->endTag('url');
    }
}

$writer->endTag('urlset');

$writer->end();
$output->close();

print $root_path.'/'.colored(['green'], 'sitemap.xml')." successfully created.\n"
        .colored(['green'], scalar @langs).' Languages, '
        .colored(['green'], scalar @urls).' URLs ==> '
        .colored(['green'], (@langs * @urls - $excluded)).' url nodes total'
        .($excluded ? " (-$excluded urls excluded)" : '')."\n";

1;
