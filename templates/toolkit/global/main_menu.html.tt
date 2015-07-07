<div id="main-menu" class="tab-menu">
    <div class="tab-menu-wrap grd-container grd-hide-mobile grd-hide-phablet">
        <div class='grd-grid-12'>
            <ul class="items">
            [%= FOREACH item IN menu.main_menu=%]
                <li id="[%= item.id =%]" class="item [%= item.class =%]">
                    <a class="link [% item.link_class %]" href="[%= item.url =%]">[%= item.text =%]</a>
                    [% IF item.sub_items %]
                        <ul class="sub_items">
                        [%= FOREACH sub_item IN item.sub_items =%]
                            <li id="[%= sub_item.id =%]" class="sub_item [%= sub_item.class %]">
                                <a class="link [% sub_item.link_class %]" href="[%= sub_item.url =%]">[%= sub_item.text =%]</a>
                            </li>
                        [%= END =%]
                        </ul>
                    [% END %]
                </li>
            [%= END =%]
            </ul>
        </div>
    </div>
</div>
