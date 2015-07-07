<div class='grd-hide grd-show-mobile grd-show-phablet' id='mobile-menu-container'>
    <div class='grd-hide' id='mobile-menu'>
        <ul>
            <li>
                <a class="pjaxload" href="[% request.url_for('why-us') %]"[% target %]>[% l("Why Us?") %]</a>
            </li>
            <li>
                <a class="pjaxload" href="[% request.url_for('get-started') %]"[% target %]>[% l("Get Started") %]</a>
            </li>
            <li>
                <a class="pjaxload" href="[% request.url_for('tour') %]"[% target %]>[% l("Tour") %]</a>
            </li>
            [%= FOREACH item IN menu.main_menu=%]
            <li id="[%= item.id =%]" class="item [%= item.class =%]">
                <a class="pjaxload link [% item.link_class %]" href="[%= item.url =%]">[%= item.text =%]</a>
                [% IF item.sub_items %]
                    <ul class="sub_items">
                    [%= FOREACH sub_item IN item.sub_items =%]
                        <li id="[%= sub_item.id =%]" class="sub_item [%= sub_item.class %]">
                            <a class="pjaxload link [% sub_item.link_class %]" href="[%= sub_item.url =%]">[%= sub_item.text =%]</a>
                        </li>
                    [%= END =%]
                    </ul>
                [% END %]
            </li>
            [%= END =%]
        </ul>
    </div>
</div>
