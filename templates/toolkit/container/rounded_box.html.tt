<div[% IF id %] id="[% id %]"[% END %] class="[% IF extra_class %]rbox [% extra_class %][% ELSE %]rbox[% END %][% IF expandable %] expandable[% END %][% IF collapsible %] collapsible[% END %]">
    <div class="rbox-wrap">
        [% IF heading %]
            <div class="rbox-heading">
                <h4 class="[% IF class %][% class %][% END %]">[% heading %]</h4>
            </div>
        [% END %]
        [% content %]
        <span class="tl">&nbsp;</span><span class="tr">&nbsp;</span><span class="bl">&nbsp;</span><span class="br">&nbsp;</span>
        [% IF expandable OR collapsible %]
            <div class="arrow-expand-collapse">
                <div class="arrow-expand-collapse-text">
                    <span class="show-all[% IF collapsible %] invisible[% END%]">show all</span>
                    <span class="hide-all[% IF expandable %] invisible[% END%]">hide bets</span>
                </div>
            </div>
        [% END %]
        [% IF close_button %]<div class="close_button"></div>[% END %]
    </div>
</div>
