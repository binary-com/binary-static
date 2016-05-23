<div class="grd-parent grd-grid-12 grd-centered grd-row-padding table-header">
    <div id="stockname" class="grd-grid-2 grd-grid-mobile-3">[% l('Instrument') %]</div>
    [% IF has_realtime_license %]
        <div id="last" class="grd-grid-1 grd-grid-mobile-2 right-aligned">[% l('Last') %]</div>
    [% END %]
    <div id="open" class="grd-grid-2 grd-hide-mobile right-aligned">[% l('Open') %]</div>
    <div id="high" class="grd-grid-2 grd-hide-mobile right-aligned">[% l('High') %]</div>
    <div id="low" class="grd-grid-2 grd-hide-mobile right-aligned">[% l('Low') %]</div>
    [% IF has_realtime_license %]
        <div id="change" class="grd-grid-2 grd-grid-mobile-5 right-aligned">[% l('Change') %]</div>
        <div id="quotetime" class="grd-grid-1 grd-grid-mobile-2">[% l('Time') %]</div>
    [% END %]
</div>

[% FOREACH ticker IN ticker_data %]
<div class="grd-parent grd-grid-12 grd-centered grd-row-padding table-body table-body-with-lines">
    <div class="text grd-grid-2 grd-grid-mobile-3">[% ticker.underlying %]</div>
    [% IF has_realtime_license %]
        <div id="last" class="grd-grid-1 grd-grid-mobile-2 right-aligned"><strong>[% ticker.last %]</strong></div>
    [% END %]
    <div class="grd-grid-2 grd-hide-mobile right-aligned">[% ticker.open %]</div>
    <div class="grd-grid-2 grd-hide-mobile right-aligned">[% ticker.high %]</div>
    <div class="grd-grid-2 grd-hide-mobile right-aligned">[% ticker.low %]</div>
    [% IF has_realtime_license %]
        <div class="[% ticker.change_type %] grd-grid-2 grd-grid-mobile-5 right-aligned">[% ticker.change %] [% IF ticker.change %]([% ticker.change_percentage %] %)[% END %]&nbsp;<span class="market_[% ticker.change_type %]"></span></div>
        <div class="text grd-grid-1 grd-grid-mobile-2">[% ticker.quotetime %]</div>
    [% END %]
</div>
[% END %]
