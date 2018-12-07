/* eslint-disable */
import React from 'react';

const GoogleOptimizer = () => (
    <React.Fragment>
        <style dangerouslySetInnerHTML={{__html: `.async-hide { opacity: 0 }`}}></style>
        <script dangerouslySetInnerHTML={{ __html: `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;})(window,document.documentElement,'async-hide','dataLayer',4000,{'GTM-MZWFF7':true});`}}></script>
    </React.Fragment>
);
export default GoogleOptimizer;
