[% relative_style = "display:none" %]
[% absolute_style = "display:none" %]
[% barrier_tooltip = l("Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received") %]

[% IF barrier_type == 'relative' %]
    [% relative_style = "" %]
[% ELSE %]
    [%  absolute_style = "" %]
[% END %]

[% IF H %]
<div>
    <span class='grd-grid-5 form_label'>
        <label for="bet_H" class="barrier_text_relative" style="[% relative_style %]">
            <abbr rel="tooltip" title="[% barrier_tooltip %]">[% IF two_barriers %][% l("High barrier offset") %][% ELSE %][% l("Barrier offset") %][% END %]:</abbr>
        </label>
        <label for="bet_H" class="barrier_text_absolute" style="[% absolute_style %]">
            [% IF two_barriers %][% l("High barrier") %][% ELSE %][% l("Barrier") %][% END %]:
        </label>
    </span>
    <span class='grd-grid-7'>
        <input id="bet_H" type="text" name="H" maxlength="40" size="8" value="[% H %]" class="barrierbox"/>
        <abbr rel="tooltip" title="[% l("This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.") %]">
            <span class="calculated_barrier_from_relative_high non_input" style="[% relative_style %]"></span>
        </abbr>
    </span>
</div>
[% END %]

[% IF L && two_barriers %]
<div>
    <span class='grd-grid-5 form_label'>
        <label for="bet_L" class="barrier_text_relative" style="[% relative_style %]">
            <abbr rel="tooltip" title="[% barrier_tooltip %]">[% l("Low barrier offset") %]:</abbr>
        </label>
        <label for="bet_L" class="barrier_text_absolute" style="[% absolute_style %]">
            [% l("Low barrier") %]:
        </label>
    </span>
    <span class='grd-grid-7'>
        <input id="bet_L" type="text" name="L" maxlength="40" size="8" value="[% L %]" class="barrierbox"/>
        <abbr rel="tooltip" title="[% l("This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.") %]">
        <span class="calculated_barrier_from_relative_low non_input" style="[% relative_style %]"></span>
    </span>
</abbr>
</div>
[% END %]

<input type="hidden" name="pip_size" value="[%- pip_size -%]">
