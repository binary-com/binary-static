#!/usr/bin/perl

use strict;
use warnings;
use FindBin qw/$Bin/;
use lib "$Bin/lib";
use XML::Writer;
use IO::File;
use Term::ANSIColor;

use BS qw/all_languages/;

my @langs = map { lc $_ } grep {$_ ne 'JA'} all_languages(); # exclude JA language from sitemap
my @urls = (
    # path (without .html) , changefreq, priority, exclude languages
    ['home'                , 'monthly', '1.00'],
    ['why-us'              , 'monthly', '0.80'],
    ['tour'                , 'monthly', '0.80'],
    ['trading'             , 'monthly', '0.80'],
    ['contact'             , 'monthly', '0.80'],
    ['about-us'            , 'monthly', '0.80'],
    ['partners'            , 'monthly', '0.80'],
    ['cashier'             , 'monthly', '0.80'],
    ['careers'             , 'monthly', '0.80'],
    ['user-testing'        , 'monthly', '0.80'],
    ['open-positions'      , 'monthly', '0.80'],
    ['payment-agent'       , 'monthly', '0.80'],
    ['group-history'       , 'monthly', '0.80'],
    ['group-information'   , 'monthly', '0.80' , 'ar,id'],
    ['affiliate/signup'    , 'monthly', '0.80'],
    ['responsible-trading' , 'monthly', '0.80'],
    ['terms-and-conditions', 'monthly', '0.80'],
    ['open-source-projects', 'monthly', '0.80'],

    ['cashier/payment_methods' , 'monthly', '0.80'],
    ['resources/asset_indexws' , 'monthly', '0.80'],
    ['resources/market_timesws', 'monthly', '0.80'],

    ['get-started'                             , 'monthly', '0.80'],
    ['get-started/what-is-binary-trading'      , 'monthly', '0.80'],
    ['get-started/types-of-trades'             , 'monthly', '0.80'],
    ['get-started/binary-options-basics'       , 'monthly', '0.80'],
    ['get-started/benefits-of-trading-binaries', 'monthly', '0.80'],
    ['get-started/how-to-trade-binaries'       , 'monthly', '0.80'],
    ['get-started/volidx-markets'              , 'monthly', '0.80'],
    ['get-started/spread'                      , 'monthly', '0.80'],
    ['get-started/smart-indices'               , 'monthly', '0.80'],
    ['get-started/otc-indices-stocks'          , 'monthly', '0.80'],
    ['get-started/beginners-faq'               , 'monthly', '0.80'],
    ['get-started/glossary'                    , 'monthly', '0.80'],
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
        if ($url->[3] and index($url->[3], $lang) > -1) {
            $excluded++;
            next;
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
