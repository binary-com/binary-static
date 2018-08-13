/* eslint-disable */
import React from 'react';

const GA = () => (
    <script dangerouslySetInnerHTML={{__html:`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-40877026-3', 'auto');
        ga('require', 'GTM-KPSSR9K');
        ga('send', 'pageview');`}}/>
);
export default GA;