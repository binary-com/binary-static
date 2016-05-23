<span class='grd-grid-5 form_label'>
    <label for="tick">[% l("Number of ticks") %]: </label>
</span>
<span class='grd-grid-7'>
        <select id="tick" name="tick_count">
            [% FOREACH tick IN tick_options %]
                <option value="[% tick.value %]" [% IF selected_tick == tick.value %] selected="selected" [% END %]>[% tick.text %]</option>
            [% END %]
        </select>
</span>
<input type="hidden" id="expiry_type" name="expiry_type" value="tick">
