<div id="sell_bet_desc" class='popup_bet_desc drag-handle'>[% longcode %]</div>

<div id='sell_content_wrapper'>

    <div id='sell_content_container'>
        [% IF !missing_data %]
        [% details_content %]
        [% END %]

        <div class='sell_bottom_content'>
        [% IF is_running && can_sell && !is_backoffice %]
            <div class="sell_price_wrapper">
                <div id="sell_price_container">
                    <input name="price" type="hidden" />
                    <div class="stylized_price">
                        <span class="stylized_currency"></span>
                        <span class="stylized_units"></span>
                        <span class="stylized_cents"></span>
                    </div>
                </div>

                <span id="sell_info">
                    <div class="form_button" id='sell_contract_form'>
                        <span class="button">
                            <button id="sell_at_market" class="button">[% l('Sell at market') %]</button>
                        </span>
                    </div>
                </span>

                <div class="note">
                    [% l('Note: Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.') %]
                </div>
            </div>

            <div id="message_container_wrapper">
                <div id="warning_container"></div>
            </div>

            [% ELSIF missing_data %]
                <p class="comment">[% l('There was a market data disruption during the contract period. For real-money accounts we will attempt to correct this and settle the contract properly, otherwise the contract will be cancelled and refunded. Virtual-money contracts will be cancelled and refunded.') %]</p>
            [% ELSIF settle_later %]
                <p class="comment">[% l('For contracts which expire at market close, we will use the official closing value of the market to settle your contract and update your results at settlement time.') %]</p>
            [% ELSIF is_sold %]
                <p class="comment">[% l('This contract has been sold.') %]</p>
            [% ELSIF is_expired %]
                <p class="comment">[% l('This contract has expired.') %]</p>
            [% ELSE %]
                <p class="comment">
                [% unavailable %]
                </p>
            [% END %]
        </div><!-- sell_bottom_content -->
        <div id="sell_extra_info_data" style="display:none;" stream_url="[% stream_url %]" error_message="[% error_message %]" submit_url="[% submit_url %]" barrier="[% barrier %]" barrier2="[% barrier2 %]" path_dependent="[% path_dependent %]" is_immediate="[% is_immediate %]" is_negative="[% is_negative %]" is_forward_starting="[% is_forward_starting %]" trade_feed_delay="[% trade_feed_delay %]"></div>
        <div id="overlay-wrapper" style="display: none;"></div>
    </div><!-- sell_content_container !-->
    <div style="display:none;" id='reload_sell_container'>
        [% IF not_started %]
            <p class="comment"> [% l('Contract started') %]</p>
            <span class="button">
                <button id="reload_sell" class="button">[% l('View progress') %]</button>
            </span>
        [% ELSE %]
            <p class="comment"> [% l('Contract expired') %]</p>
            <span class="button">
                <button id="reload_sell" class="button">[% l('View result') %]</button>
            </span>
        [% END %]
    </div>
</div> <!-- sell_content_wrapper -->

