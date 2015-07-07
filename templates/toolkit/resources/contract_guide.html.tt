<div class="grd-grid-12">
    <h1>[% l("Trading Guide") %]</h1>
    <p>[% l("[_1] gives you many different ways to trade on the markets. Learn more about each contract type by clicking on the links below.", broker_name) %]</p>
</div>

<div id="bet_guide_content" itemscope itemtype="http://schema.org/Product">
    [% FOREACH bet_type IN bet_types %]
    <div class="grd-grid-6 grd-grid-mobile-12">
        <a itemprop="name" href="[% bet_type.url %]" id="[% bet_type.id %]" class="li-boxes-content-icon">[% bet_type.title %]</a>
        <div class="li-2-boxes-content">
            <h2><a href="[% bet_type.url %]">[% bet_type.title %]</a></h2>
            <p>[% bet_type.explanation %] <a class="bet_demo_link" href="[%= request.url_for('contract_demo.cgi', { bet_type =>  bet_type.default}) =%]">[% l('See demo') %]</a></p>
        </div>
    </div>
    [% END %]
</div>
