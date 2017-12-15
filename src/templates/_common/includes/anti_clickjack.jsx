import React from 'react'; // eslint-disable-line

export default () => (
    <React.Fragment>
        <style id="antiClickjack">{'body{display:none !important;}'}</style>
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: `
            if (self === top) {
                var antiClickjack = document.getElementById("antiClickjack");
                antiClickjack.parentNode.removeChild(antiClickjack);
            } else {
                top.location = self.location;
            }
        `}}></script>
    </React.Fragment>
);
