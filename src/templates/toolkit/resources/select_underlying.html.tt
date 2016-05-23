<select id="pricingtable_underlying" name="underlying" style="width: 100%">
    [% FOREACH group = underlyings %]
        <optgroup label="[% group.group %]">
        [% FOREACH underlying = group.underlyings %]
            <option class="[% underlying.class %]" value="[% underlying.value %]" [% IF underlying.value == selected_underlying %] selected="selected" [% END %] [% IF underlying.disabled == 1 %] disabled="disabled" [% END %]>
                [% underlying.name %]
            </option>
        [% END %]
        </optgroup>
    [% END %]
</select>
