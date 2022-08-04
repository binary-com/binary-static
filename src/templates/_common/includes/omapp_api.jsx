import React from 'react';

const OmappApi = () => (
    <React.Fragment>
        <script
            dangerouslySetInnerHTML={{
                __html: `
            (function (d, u, ac) {
                var s = d.createElement("script");
                s.type = "text/javascript";
                s.src = "https://a.omappapi.com/app/js/api.min.js";
                s.async = true;
                s.dataset.user = u;
                s.dataset.account = ac;
                d.getElementsByTagName("head")[0].appendChild(s);
              })(document, 163734, 177733); 
            `,
            }}
        />
    </React.Fragment>
);

export default OmappApi;
