import React from 'react';

const product_hint = 'Some products are not available in all countries.';

export const Asterisk = () => (
    <span className='product-hint no-underline' data-balloon={it.L(product_hint)}>&nbsp;*</span>
);

export const ProductHint = () => (
    <div className='hint' id='product_hint'>* {it.L(product_hint)}</div>
);
