package BinaryStatic::Consts;

use strict;
use warnings;
use Encode;

sub ticker {
    (
        ['AUD/JPY', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxAUDJPY&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '99.52%', '100.00%'],
        ['AUD/PLN', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxAUDPLN&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '98.49%', '100.00%'],
        ['EUR/NZD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxEURNZD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['EUR/NOK', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxEURNOK&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '92.42%', '96.46%'],
        ['EUR/JPY', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxEURJPY&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '98.49%', '100.00%'],
        ['GBP/USD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxGBPUSD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['EUR/USD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxEURUSD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['USD/JPY', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxUSDJPY&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '99.08%', '100.00%'],
        ['EUR/AUD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxEURAUD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['NZD/USD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxNZDUSD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['AUD/NZD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxAUDNZD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['AUD/CHF', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxAUDCHF&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['GBP/CAD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxGBPCAD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['GBP/CZK', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxGBPCZK&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '88.32%', '92.20%'],
        ['AUD/USD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxAUDUSD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['EUR/GBP', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxEURGBP&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['AUD/CAD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxAUDCAD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['USD/CAD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxUSDCAD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['GBP/JPY', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxGBPJPY&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '97.63%', '100.00%'],
        ['GBP/NZD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxGBPNZD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['EUR/CAD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxEURCAD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['GBP/AUD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxGBPAUD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '100.00%', '100.00%'],
        ['Gold/USD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxXAUUSD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '89.43%', '93.16%'],
        ['Silver/USD', 'https://www.binary.com/c/trade.cgi?market=forex&time=10m&form_name=risefall&expiry_type=duration&amount_type=payout&underlying_symbol=frxXAGUSD&H=SOP&currency=USD&amount=100&type=FLASHU&payout=100&l=EN', '89.21%', '93.12%'],
    );
}

sub languages {
    {
        'DE' => 'Deutsch',
        'ID' => 'Bahasa Indonesia',
        'ZH_CN' => decode_utf8('简体中文'),
        'PL' => 'Polish',
        'RU' => decode_utf8('Русский'),
        'PT' => decode_utf8('Português'),
        'ES' => decode_utf8('Español'),
        'FR' => decode_utf8('Français'),
        'EN' => 'English',
    }
}

1;
