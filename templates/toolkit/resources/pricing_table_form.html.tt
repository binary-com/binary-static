<div class='grd-grid-12'>
    <h1>[% l('Pricing Table') %]</h1>
    <div id="pricing_table_form_div" class='grd-row-padding'>
        <form id="pricing_table_input" name="pricing_table_input" method="GET" action=[% form_url %]>
            <fieldset>
                <div class='grd-parent grd-grid-12 grd-row-padding'>
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label for="pricingtable_bet_type">[% l('Contract Type') %]:</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <select id="pricingtable_bet_type" name="bet_type">
                            [% FOREACH bet_type = bet_types %]
                            <option value=[% bet_type.value %] [% IF bet_type.value == selected_bet_type %] selected="selected" [% END %]>[% bet_type.name %]</option>
                            [% END %]
                        </select>
                    </div>

                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label for="pricingtable_underlying">[% l('Market') %]:</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <span id="pricingtable_underlying_div">
                            [% select_underlying %]
                        </span>
                    </div>

                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label for="pricingtable_currency">[% l('Payout Currency') %]:</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <select id="pricingtable_currency" name="currency">
                            [% FOREACH currency = currencies %]
                            <option value="[% currency %]" [% IF currency == selected_currency %]selected="selected"[% END %]> [% currency %] </option>
                            [% END %]
                        </select>
                    </div>
                </div>

                [% IF selected_bet_type == 'RANGE' || selected_bet_type == 'UPORDOWN' || selected_bet_type == 'EXPIRYRANGE' || selected_bet_type == 'EXPIRYMISS' %]
                    [% double_barrier = 1 %]
                [% ELSE %]
                    [% double_barrier = 0 %]
                [% END %]
                <div id="lower_strike" class="lower_strike grd-parent grd-grid-12 grd-row-padding " [% IF double_barrier == 0 %] style="display:none;" [% END %]>
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label for="low_strike">[% l('Low barrier') %]:</label>
                    </div>
                    <div class="grd-grid-4 grd-grid-mobile-8">
                        <input size="5" type="text" id="low_strike" name="low_strike" [% IF selected_low_strike %] value="[% selected_low_strike %]" [% END %] />
                        <span style="padding-left:10px;">([% l('Absolute barrier') %])</span>
                    </div>
                </div>

                <div class='grd-parent grd-grid-12 grd-row-padding'>
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label>[% l('Horizontal') %]:</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <label id="strike_label" [% IF double_barrier == 1 %] style="display:none;" [% END %]>[% l('Barrier') %]</label>
                        <label id="high_strike_label" [% IF double_barrier == 0 %] style="display:none;" [% END %]>[% l('High barrier') %]</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label for="strike_step">[% l('Step') %] (%):</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <input size="13" type="text" name="strike_step" id="strike_step" [% IF selected_strike_step %] value=[% selected_strike_step %] [% END %] />
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <select id="strike_type" name="strike_type">
                            [% FOREACH strike_type = strike_types %]
                            <option value="[% strike_type.value %]" [% IF strike_type.value == selected_strike_type %] selected="selected" [% END %]>
                                [% strike_type.text %]
                            </option>
                            [% END %]
                        </select>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">

                        <label for="from_strike" id="from_strike_percent">[% l('From') %] (%):</label>
                        <label for="from_strike" id="from_strike_label" style="display:none;">[% l('From') %]:</label>
                        <input size="5" type="text" id="from_strike" name="from_strike" [% IF selected_from_strike %] value=[% selected_from_strike %] [% END %]  />
                    </div>
                </div>

                <div class="grd-parent grd-grid-12 grd-row-padding">
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label>[% l('Vertical') %]:</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <label>[% l('Expiry') %]</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label for="expiry_step">[% l('Step') %]:</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <select name="expiry_step" id="expiry_step">
                            [% FOREACH expiry_step = expiry_steps %]
                            <option value="[% expiry_step.value %]" [% IF expiry_step.value == selected_expiry_step %] selected="selected" [% END %]> [% expiry_step.label %] </option>
                            [% END %]
                        </select>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-4">
                        <label for="from_expiry" id="from_expiry_label">[% l('From') %]:</label>
                    </div>
                    <div class="grd-grid-2 grd-grid-mobile-8">
                        <input size="9" type="text" id="from_expiry" name="from_expiry" [% IF selected_from_expiry %] value=[% selected_from_expiry %] [% END %] />
                    </div>
                </div>

                <div class="grd-grid-12 center-aligned">
                    <input type="hidden" value="price" name="action" />
                    <input type="hidden" id="calculating" value=[% l('Calculating') %] />
                    <span class="button">
                        <button id="pricingtable_calculate" class="button" value="calculate" type="submit">[% l('Calculate') %]</button>
                        <button style="display:none;" disabled="disabled" id="pricingtable_calculating" class="button" value="calculating" type="submit">[% l('Calculating') %]</button>
                    </span>
                </div>
            </fieldset>
        </form>
    </div>
</div>
<div id="pricing_table_prices_div">
[% prices %]
</div>
