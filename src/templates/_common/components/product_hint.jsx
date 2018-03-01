import React from 'react';

const product_hint = 'Some products are not available in all countries.';

export const Asterisk = () => (
    <span className='product-hint no-underline' data-balloon={it.L(product_hint)} data-show='default'>&nbsp;*</span>
);

export const ProductHint = () => (
    <div className='hint' id='product_hint' data-show='default'>* {it.L(product_hint)}</div>
);
