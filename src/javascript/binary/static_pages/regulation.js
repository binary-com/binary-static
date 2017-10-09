const BinaryPjax   = require('../base/binary_pjax');
const Client       = require('../base/client');
const urlFor       = require('../base/url').urlFor;
const BinarySocket = require('../websocket_pages/socket');

const Regulation = (() => {
    const onLoad = () => {
        $(() => {
            $('#accordion').accordion({
                heightStyle: 'content',
                collapsible: true,
                active     : 0,
            });
        });

        const coords    = [];
        const $map_area = $('#planetmap').find('area');
        const $selector = $('img[usemap="#planetmap"]');
        $map_area.each(function () {
            coords.push($(this).attr('coords'));
        });
        const relocateLinks = () => {
            $map_area.each(function (index) {
                let c = '';
                const new_width = $selector[0].getBoundingClientRect().width.toFixed(2);
                coords[index].split(',').map((v) => { c += (c ? ',' : '') + ((v * new_width) / 900).toFixed(2); });
                $(this).attr('coords', c);
            });
        };
        $(document).ready(relocateLinks);
        $(window).resize(relocateLinks);

        document.getElementById('visit_japan').addEventListener('click', () => {
            const redirect_to = urlFor('home-jp');
            if (Client.isLoggedIn()) {
                BinarySocket.send({ logout: '1', passthrough: { redirect_to } });
            } else {
                BinaryPjax.load(redirect_to);
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Regulation;
