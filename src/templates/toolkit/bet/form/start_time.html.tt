<div [% IF extra_class %] class="[% extra_class %]" [% END %]>
    [% IF explanation %]
        <span class='grd-grid-5 form_label'>
            <label for="atleast"><abbr rel='tooltip' title='[% explanation %]'>[% l('Start time') %]:</abbr></label>
        </span>
    [% ELSE %]
        <span class='grd-grid-5'>
            <label for="atleast">[% l('Start time') %]:</label>
        </span>
    [% END %]
    <span class='grd-grid-7'>
        <select id="atleast" name="date_start">
            [% FOREACH start_option IN start_options %]
                <option value="[% start_option.value %]" [% IF selected_start_time == start_option.value %] selected="selected" [% END %]>[% start_option.text %]</option>
            [% END %]
        </select>
    </span>
</div>
