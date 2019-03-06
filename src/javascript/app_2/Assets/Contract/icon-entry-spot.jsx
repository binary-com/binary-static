import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

const IconEntrySpot = () => (
    <svg className='chart-spot__icon' width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path d='M0 0h16v16H0z' />
            <path fill='#fff' fillRule='nonzero' d='M9.033 7.912c-1.107 1.014-2.214 2.03-3.33 3.037L5.701 8.84H0V6.88h5.7c.001-.979.002-1.822.005-2.107 1.099.982 2.178 1.987 3.27 2.977.044.047.151.108.058.16z' />
            <path fill='#fff' fillRule='nonzero' d='M7.66 3.005c2.9 0 5.258 2.244 5.258 5 0 2.757-2.357 5-5.258 5a5.329 5.329 0 0 1-4.178-2h-2.46c1.184 2.361 3.71 4 6.638 4 4.059 0 7.361-3.14 7.361-7s-3.302-7-7.36-7c-2.929 0-5.455 1.64-6.64 4h2.46a5.33 5.33 0 0 1 4.18-2z' />
        </g>
    </svg>
);

IconEntrySpot.propTypes = {
    color: PropTypes.string,
};

export default observer(IconEntrySpot);
