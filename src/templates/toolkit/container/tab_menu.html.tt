<div class="tab_menu_container has-tabs"[% IF menu_wrapper_id %] id="[% menu_wrapper_id %]" [% END %]>
    <ul>
        [% FOREACH item IN menu_items %]
        <li>
            [% IF item.is_internal %]
            <a href="#[% item.link %]" [% FOREACH par IN item.params %] [% par.key %] = "[% par.value %]" [% END %]>[% item.text %]</a>
            [% ELSE %]
            <a href="[% item.link %]" [% FOREACH par IN item.params %] [% par.key %] = "[% par.value %]" [% END %]>[% item.text %]</a>
            [% END %]
            </li>
        [% END %]
    </ul>
    [% FOREACH item IN menu_contents %]
    <div id="[% item.link %]">
        [% item.content %]
    </div>
    [% END %]
</div>
