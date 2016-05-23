<div id="live_chart_form_wrapper" class='grd-grid-12'>
    [% IF require_duration %]
    [% INCLUDE 'charting/livechart_duration.html.tt' %]
    [% END %]
</div>

<div class="chart-notice">
    <div class='notice' id="delayed_feed_notice">
      [% l("Charting for this underlying is delayed") %]
    </div>
    <div class='notice' id="not_available_notice">
      [% l("Charting is not available for this underlying") %]
    </div>
</div>

[% IF contract_analysis %]
<div id="analysis_live_chart" class='live_chart_wrapper grd-grid-12'>
<div>
[% ELSE %]
<div id="live_chart_div" class='live_chart_wrapper grd-grid-12'>
</div>
[% END %]
