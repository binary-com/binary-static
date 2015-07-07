<div class="grd-grid-12">
    <h1>[% l("Rise / Fall Table") %]</h1>
    <form name="rise_fall" id="rise_fall_form" method="post" action="[%= request.url_for('rise_fall_table.cgi') %]">
        <fieldset>
            <div class="grd-parent grd-grid-4 grd-grid-mobile-12" >
                <span class='grd-grid-5 form_label'>
                    <label for="atleast">[% l('Start time') %]:</label>
                </span>
                <span class='grd-grid-7'>
                    <select id="atleast" name="date_start">
                        [% FOREACH option IN start_options.options %]
                            <option value="[% option.value %]" [% IF start_options.selected == option.value %] selected="selected" [% END %]>[% option.text %]</option>
                        [% END %]
                    </select>
                </span>
            </div>
            <div id='duration_container' class="grd-parent grd-grid-5 grd-grid-mobile-12">
                <span class='grd-grid-3 form_label'>
                    <label for="duration_amount">[% l('Duration') %]:</label>
                </span>
                <span id="expiry_type_duration" class='grd-grid-9 grd-parent'>
                    <span class='grd-grid-4'>
                        <input type="text" name="duration_amount" id="duration_amount" size="4" maxlength="5" value="[% duration_selected.duration_amount %]"/>
                    </span>
                    <span class='grd-grid-5'>
                        <select id="duration_units" name="duration_units">
                            [% FOREACH pair IN duration_options.pairs %]
                                [% FOREACH duration_option IN pair.value %]
                                <option value="[% duration_option.value %]" class="[% pair.key %]" [% IF duration_option.value == duration_selected.duration_unit %]selected="selected"[% END %]>[% duration_option.text %]</option>
                                [% END %]
                            [% END %]
                        </select>
                    </span>
                    <span class='grd-grid-3 grd-no-gutter'>
                        [% FOREACH pair IN minimums.pairs %]
                            [% FOREACH minimum IN pair.value %]
                        <span class="[% IF pair.key == 'forward_starting' %]forward_starting [% END %]non_input [% minimum.unit %]"><abbr rel='tooltip' title="[% l("minimum available duration") %]">[% l("min") %]</abbr>: [% minimum.value %]</span>
                            [% END %]
                        [% END %]
                    </span>
                </span>
            </div>
            <div class="grd-parent grd-grid-3 grd-grid-mobile-12">
                <div class="grd-grid-8 right-aligned">
                    <label for="payout">[% l('Payout Currency') %]:</label>
                </div>
                <div class="grd-grid-4">
                    <select id="bet_currency" name="currency">
                        [% FOREACH currency = currency_options %]
                            <option value=[% currency %] [% IF selected_currency == currency %] selected="selected" [% END %]>[% currency %]</option>
                        [% END %]
                    </select>
                </div>
            </div>
            <input type="hidden" name="table_action" value="price"></input>

            <div id="submit" class="form_button grd-grid-12 grd-with-padding">
                <span class="button">
                    <button id="rise_fall_calculate" class="button" value="calculate" type="submit">[% l('Calculate') %]</button>
                    <button style="display:none;" id="rise_fall_calculating" class="button" value="calculating" type="submit">[% l('Calculating') %]</button>
                </span>
            </div>
        </fieldset>
    </form>
</div>

<div id="rise_fall_prices_div" class="grd-grid-12">
[% prices %]
</div>
