import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconTradeType = ({ type, className }) => {
    let IconType;
    if (type) {
        switch (type) {
            case 'asiand':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 16h16V0H0z' />
                        <path fill='#2A3052' d='M1 10.667h13.333V9.334H1zM1 6.667h13.333v-1H1zM1 4h13.333V3H1z' />
                        <path fill='#2A3052' fillRule='nonzero' d='M7.765 6.093l5.541 6.427-1.01.87-4.728-5.483L6.22 8.918l-4.737-5.83 1.034-.842 3.93 4.836z' />
                        <path fill='#2A3052' d='M13.576 13.6v-2.208l-1.006-1.007v2.19h-2.266l1.052 1.025z' />
                    </g>
                );
                break;
            case 'asianu':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path fill='#2A3052' d='M1 5.333h13.333v1.333H1zM1 9.333h13.333v1H1zM1 12h13.333v1H1z' />
                        <path fill='#2A3052' fillRule='nonzero' d='M7.765 9.907l5.541-6.427-1.01-.87-4.728 5.483L6.22 7.082l-4.737 5.83 1.034.842 3.93-4.836z' />
                        <path fill='#2A3052' d='M13.576 2.4v2.208L12.57 5.615v-2.19h-2.266L11.356 2.4z' />
                    </g>
                );
                break;
            case 'call_barrier':
                IconType = (
                    <g fill='#2A3052' fillRule='evenodd'>
                        <rect x='3' y='8' width='10' height='1' rx='.5' />
                        <path d='M3.812 8.11a.5.5 0 0 0-.624.78l2.5 2a.5.5 0 0 0 .68-.05l6-6.5a.5.5 0 0 0-.735-.68L5.949 9.82l-2.137-1.71z' fillRule='nonzero' />
                        <path d='M12 4v1.5a.5.5 0 1 0 1 0v-2a.5.5 0 0 0-.5-.5h-2a.5.5 0 1 0 0 1H12z' fillRule='nonzero' />
                    </g>

                );
                break;
            case 'call':
                IconType = (
                    <g fill='#2A3052'>
                        <path d='M3.812 8.11a.5.5 0 0 0-.624.78l2.5 2a.5.5 0 0 0 .68-.05l6-6.5a.5.5 0 0 0-.735-.68L5.949 9.82 3.812 8.11z' />
                        <path d='M12 4v1.5a.5.5 0 1 0 1 0v-2a.5.5 0 0 0-.5-.5h-2a.5.5 0 1 0 0 1H12z' />
                    </g>

                );
                break;
            case 'calle_light':
                IconType = (
                    <path d='M6.671 8l3.422-4.79A.5.5 0 0 1 10.5 3h1.79l-1.144-1.147a.5.5 0 1 1 .708-.706l1.963 1.966a.499.499 0 0 1 0 .774l-1.963 1.966a.5.5 0 0 1-.708-.706L12.291 4h-1.534L7.9 8h4.6a.5.5 0 1 1 0 1H7.186l-1.28 1.79a.5.5 0 0 1-.76.064l-2-2A.498.498 0 0 1 3.5 8h3.171zm-.714 1h-1.25l.73.73.52-.73zm6.897-2.147a.5.5 0 0 1-.708-.706l1.997-2a.5.5 0 1 1 .707.706l-1.996 2z' fill='#2A3052' fillRule='evenodd' />
                );
                break;
            case 'digitdiff':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M5.5 6.75h-4v-1.5h4L4.5 4H6l1.5 2L6 8H4.5l1-1.25zM10.5 11.75h4v-1.5h-4l1-1.25H10l-1.5 2 1.5 2h1.5l-1-1.25zM7.5 0h1v16h-1z' fill='#2A3052' />
                    </g>
                );
                break;
            case 'digiteven':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M4.5 11.5h7v-7h-7v7zm8-8v9h-9v-9h9z' fill='#2A3052' fillRule='nonzero' />
                        <path d='M2.698 9.5H.218v-.537L1.36 7.762c.281-.32.422-.576.422-.764 0-.153-.033-.27-.1-.35-.067-.08-.163-.12-.29-.12a.362.362 0 0 0-.306.16.657.657 0 0 0-.117.4H.144A1.167 1.167 0 0 1 .762 6.05c.193-.104.41-.156.65-.156.383 0 .68.089.887.266.207.178.31.432.31.764 0 .14-.025.277-.077.41a1.793 1.793 0 0 1-.243.417 6.12 6.12 0 0 1-.531.584l-.46.53h1.4V9.5zM9.107 8.194h.47v.825h-.47V10h-1.07v-.98H6.252l-.064-.655 1.85-2.977v-.01h1.07v2.816zm-1.9 0h.83V6.772l-.066.108-.765 1.314zM15.205 5.894v.647h-.037c-.308 0-.56.074-.758.221a.933.933 0 0 0-.365.614.962.962 0 0 1 .703-.273c.308 0 .553.112.735.336.182.225.273.52.273.884 0 .226-.053.434-.16.623a1.141 1.141 0 0 1-.446.443c-.192.107-.404.16-.636.16-.253 0-.478-.058-.677-.172a1.183 1.183 0 0 1-.463-.492 1.62 1.62 0 0 1-.171-.738v-.33c0-.365.078-.695.235-.987.157-.292.381-.52.673-.687.291-.166.614-.249.97-.249h.124zm-.743 1.838a.47.47 0 0 0-.437.262v.246c0 .45.156.674.467.674.125 0 .23-.056.313-.168a.687.687 0 0 0 .126-.423.674.674 0 0 0-.128-.426.41.41 0 0 0-.34-.165z' fill='#2A3052' />
                    </g>
                );
                break;
            case 'digitmatch':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M5.5 8.75H2v-1.5h3.5L4.5 6H6l1.5 2L6 10H4.5l1-1.25zM10.5 8.75H14v-1.5h-3.5l1-1.25H10L8.5 8l1.5 2h1.5l-1-1.25zM7.5 0h1v16h-1z' fill='#2A3052' />
                    </g>
                );
                break;
            case 'digitodd':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M4.5 11.5h7v-7h-7v7zm8-8v9h-9v-9h9z' fill='#2A3052' fillRule='nonzero' />
                        <path fill='#2A3052' d='M2.041 9.5h-.825V6.873l-.81.237v-.625l1.56-.54h.075zM7.26 7.242h.505c.4 0 .6-.196.6-.587a.508.508 0 0 0-.143-.373c-.096-.096-.23-.145-.403-.145a.58.58 0 0 0-.37.124.378.378 0 0 0-.157.308h-1.07c0-.243.068-.46.203-.65.136-.191.323-.34.564-.446.24-.107.504-.16.792-.16.514 0 .918.117 1.212.352.294.234.441.557.441.968 0 .198-.06.386-.182.563a1.3 1.3 0 0 1-.532.43c.245.089.438.224.578.405.14.18.21.404.21.67 0 .414-.16.744-.477.991-.317.248-.734.371-1.25.371a2.05 2.05 0 0 1-.843-.172 1.32 1.32 0 0 1-.589-.48 1.246 1.246 0 0 1-.2-.696h1.076c0 .141.057.264.171.368a.605.605 0 0 0 .423.155.634.634 0 0 0 .45-.157.525.525 0 0 0 .168-.401c0-.233-.058-.398-.174-.495-.116-.098-.277-.146-.482-.146H7.26v-.797zM13.266 7.762l.217-1.817h2.078v.64h-1.409l-.08.706a.973.973 0 0 1 .23-.09c.096-.027.189-.04.28-.04.353 0 .625.105.814.314.19.209.285.502.285.88 0 .228-.051.434-.153.619a1.049 1.049 0 0 1-.428.426c-.184.1-.402.149-.652.149-.223 0-.432-.046-.628-.138a1.126 1.126 0 0 1-.459-.379.92.92 0 0 1-.163-.543h.825c.008.13.05.234.124.31a.395.395 0 0 0 .296.115c.277 0 .415-.205.415-.615 0-.38-.17-.569-.508-.569-.192 0-.335.062-.43.186l-.654-.154z' />
                    </g>
                );
                break;
            case 'digitover':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <rect fill='#2A3052' transform='rotate(180 8 8)' y='7.5' width='16' height='1' rx='.5' />
                        <path d='M12.866 5.834a.5.5 0 0 0 1 0V3.713a.5.5 0 0 0-.5-.5h-2.121a.5.5 0 0 0 0 1h1.62v1.621z' fill='#2A3052' fillRule='nonzero' />
                        <path d='M.5 11a.5.5 0 1 0 0 1h5a.5.5 0 0 0 .354-.146l7.5-7.5a.5.5 0 0 0-.708-.708L5.293 11H.5z' fill='#2A3052' fillRule='nonzero' />
                    </g>
                );
                break;
            case 'digitunder':
                IconType = (
                    <g transform='matrix(1 0 0 -1 0 16)' fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <rect fill='#2A3052' transform='rotate(180 8 8)' y='7.5' width='16' height='1' rx='.5' />
                        <path d='M12.866 5.834a.5.5 0 0 0 1 0V3.713a.5.5 0 0 0-.5-.5h-2.121a.5.5 0 0 0 0 1h1.62v1.621z' fill='#2A3052' fillRule='nonzero' />
                        <path d='M.5 11a.5.5 0 1 0 0 1h5a.5.5 0 0 0 .354-.146l7.5-7.5a.5.5 0 0 0-.708-.708L5.293 11H.5z' fill='#2A3052' fillRule='nonzero' />
                    </g>
                );
                break;
            case 'expirymiss':
                IconType = (
                    <g fill='#2A3052' fillRule='evenodd'><rect transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <rect transform='rotate(180 8 11)' y='10.5' width='16' height='1' rx='.5' />
                        <g fillRule='nonzero'><path d='M13.646 3.146a.5.5 0 1 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 1 0-.708.708L14.793 2l-1.147 1.146z' />
                            <path d='M15.5 1.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 1 0 0-1z' />
                        </g>
                    </g>
                );
                break;
            case 'expiryrange':
                IconType = (
                    <g fill='#2A3052' fillRule='evenodd'>
                        <rect transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <rect transform='rotate(180 8 11)' y='10.5' width='16' height='1' rx='.5' />
                        <g fillRule='nonzero'><path d='M13.646 9.146a.5.5 0 1 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 1 0-.708.708L14.793 8l-1.147 1.146z' />
                            <path d='M15.5 7.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 1 0 0-1z' />
                        </g>
                    </g>
                );
                break;
            case 'expiryrangee':
                IconType = (
                    <g fill='#2A3052' fillRule='evenodd'><rect transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <rect transform='rotate(180 8 11)' y='10.5' width='16' height='1' rx='.5' />
                        <g fillRule='nonzero'>
                            <path d='M13.646 9.146a.5.5 0 1 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 1 0-.708.708L14.793 8l-1.147 1.146z' />
                            <path d='M15.5 7.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 1 0 0-1z' />
                        </g>
                    </g>
                );
                break;
            case 'lbfloatcall':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 16h16V0H0z' />
                        <path d='M.5 11a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z' fill='#2A3052' fillRule='nonzero' />
                        <g fill='#2A3052' fillRule='nonzero'><path d='M12.5 9V3a.5.5 0 0 1 1 0v6a.5.5 0 0 1-1 0z' />
                            <path d='M13.021 8.586l1.061-1.06a.5.5 0 1 1 .707.706l-1.414 1.414a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.06 1.06zM13.021 3.172l1.061 1.06a.5.5 0 1 0 .707-.707l-1.414-1.414a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 0 0 .707.707l1.06-1.06z' />
                        </g>
                        <g fill='#2A3052' fillRule='nonzero'>
                            <path d='M.812 7.11a.5.5 0 0 0-.624.78l2.5 2a.5.5 0 0 0 .68-.05l6-6.5a.5.5 0 1 0-.735-.68L2.949 8.82.812 7.109z' />
                            <path d='M9 3v1.5a.5.5 0 1 0 1 0v-2a.5.5 0 0 0-.5-.5h-2a.5.5 0 1 0 0 1H9z' />
                        </g>
                    </g>
                );
                break;
            case 'lbfloatput':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M.5 5a.5.5 0 0 1 0-1h15a.5.5 0 1 1 0 1H.5z' fill='#2A3052' fillRule='nonzero' />
                        <g fill='#2A3052' fillRule='nonzero'>
                            <path d='M12.5 7v6a.5.5 0 0 0 1 0V7a.5.5 0 0 0-1 0z' />
                            <path d='M13.021 7.414l1.061 1.06a.5.5 0 1 0 .707-.706l-1.414-1.414a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 0 0 .707.707l1.06-1.06zM13.021 12.828l1.061-1.06a.5.5 0 1 1 .707.707l-1.414 1.414a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.06 1.06z' />
                        </g>
                        <g fill='#2A3052' fillRule='nonzero'>
                            <path d='M.812 8.89a.5.5 0 0 1-.624-.78l2.5-2a.5.5 0 0 1 .68.05l6 6.5a.5.5 0 1 1-.735.68L2.949 7.18.812 8.891z' />
                            <path d='M9 13v-1.5a.5.5 0 1 1 1 0v2a.5.5 0 0 1-.5.5h-2a.5.5 0 1 1 0-1H9z' />
                        </g>
                    </g>
                );
                break;
            case 'lbhighlow':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M.5 14a.5.5 0 1 1 0-1h15a.5.5 0 1 1 0 1H.5zM.5 3a.5.5 0 0 1 0-1h15a.5.5 0 1 1 0 1H.5z' fill='#2A3052' fillRule='nonzero' />
                        <g fill='#2A3052' fillRule='nonzero'>
                            <path d='M12.5 4.536v6.428c0 .296.224.536.5.536s.5-.24.5-.536V4.536C13.5 4.24 13.276 4 13 4s-.5.24-.5.536z' />
                            <path d='M13.021 4.914l1.061 1.06a.5.5 0 1 0 .707-.706l-1.414-1.414a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 0 0 .707.707l1.06-1.06zM13.021 11.088l1.061-1.06a.5.5 0 1 1 .707.707l-1.414 1.414a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.06 1.06z' />
                        </g>
                        <g fill='#2A3052' fillRule='nonzero'>
                            <path d='M9.496 6.5V8a.5.5 0 1 0 1 0V6a.5.5 0 0 0-.5-.5h-2a.5.5 0 1 0 0 1h1.5z' />
                            <path d='M5.246 10.923L3.486 3.88c-.125-.497-.826-.508-.967-.016l-2 7a.5.5 0 1 0 .962.274l1.487-5.204 1.547 6.188a.5.5 0 0 0 .87.2l5-6a.5.5 0 1 0-.77-.641l-4.369 5.243z' />
                        </g>
                    </g>
                );
                break;
            case 'notouch':
                IconType = (
                    <g fill='#2A3052' fillRule='nonzero'>
                        <path d='M9.839 9.87a.5.5 0 0 0 .707 0l2.019-2.019a.5.5 0 1 0-.707-.707l-1.666 1.665-3.794-3.793a.5.5 0 0 0-.707 0l-.454.454-.823-.824a.5.5 0 1 0-.707.708L4.884 6.53a.5.5 0 0 0 .707 0l.454-.454L9.839 9.87z' />
                        <path d='M12.428 8.79a.5.5 0 1 0 1 0V6.667a.5.5 0 0 0-.5-.5h-2.12a.5.5 0 1 0 0 1h1.62v1.621zM3 11.7h10.5a.5.5 0 1 0 0-1H3a.5.5 0 1 0 0 1z' />
                    </g>
                );
                break;
            case 'onetouch':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='stroke-white' d='M3 4h10.5' stroke='#2A3052' strokeLinecap='round' />
                        <path d='M11.074 5.454a.5.5 0 0 0-.707-.708L5.924 9.191a.5.5 0 0 0 .041.744l.953.762-1.272 1.272a.5.5 0 0 0 .707.707l1.666-1.667a.5.5 0 0 0-.04-.744l-.953-.762 4.048-4.05z' fill='#2A3052' fillRule='nonzero' />
                        <path fill='#2A3052' d='M11.263 4.556l.034 3.944H10.282V6.26l-.676-.76H7.34v-.944z' />
                    </g>
                );
                break;
            case 'put_barrier':
                IconType = (
                    <g fill='#2A3052' fillRule='evenodd'>
                        <rect x='3' y='6.5' width='10' height='1' rx='.5' />
                        <path d='M11.62 12.325a.5.5 0 0 0 .76-.65l-6-7a.5.5 0 0 0-.692-.065l-2.5 2a.5.5 0 0 0 .624.78l2.123-1.698 5.685 6.633z' fillRule='nonzero' />
                        <path d='M12 12h-1.5a.5.5 0 1 0 0 1h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 1 0-1 0V12z' fillRule='nonzero' />
                    </g>
                );
                break;
            case 'put':
                IconType = (
                    <g fill='#2A3052'><path d='M11.62 12.325a.5.5 0 0 0 .76-.65l-6-7a.5.5 0 0 0-.692-.065l-2.5 2a.5.5 0 0 0 .624.78l2.123-1.698 5.685 6.633z' />
                        <path d='M12 12h-1.5a.5.5 0 1 0 0 1h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 1 0-1 0V12z' />
                    </g>
                );
                break;
            case 'range':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <rect fill='#2A3052' transform='rotate(180 8 11.5)' y='11' width='16' height='1' rx='.5' />
                        <rect fill='#2A3052' transform='rotate(180 8 4.5)' y='4' width='16' height='1' rx='.5' />
                        <path d='M12.646 9.146a.5.5 0 0 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 0 0-.708.708L13.793 8l-1.147 1.146z' fill='#2A3052' fillRule='nonzero' />
                        <path d='M11.167 7.5L9.3 6.1a.5.5 0 0 0-.716.123L6.955 8.665 4.885 6.18a.5.5 0 0 0-.739-.034L2.293 8H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .354-.146L4.466 7.24l2.15 2.58a.5.5 0 0 0 .8-.044l1.707-2.56L10.7 8.4a.5.5 0 0 0 .3.1h3.5a.5.5 0 1 0 0-1h-3.333z' fill='#2A3052' fillRule='nonzero' />
                    </g>
                );
                break;
            case 'upordown':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <rect fill='#2A3052' transform='rotate(180 8 12)' y='11.5' width='16' height='1' rx='.5' />
                        <rect fill='#2A3052' transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <path d='M13.277 3.772a.5.5 0 0 0 .966-.259l-.55-2.049a.5.5 0 0 0-.612-.353l-2.049.549a.5.5 0 0 0 .259.966l1.566-.42.42 1.566z' fill='#2A3052' fillRule='nonzero' />
                        <path d='M4.876 6.17a.5.5 0 0 0-.766.018L2.26 8.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .39-.188L4.517 7.28l3.107 3.55a.5.5 0 0 0 .807-.075l5-8.5a.5.5 0 0 0-.862-.508L7.92 9.65 4.876 6.17z' fill='#2A3052' fillRule='nonzero' />
                    </g>
                );
                break;
            default:
                IconType = (
                    <path fill='#B0B3BF' fillRule='evenodd' d='M7 10.4L7.4 9 8 7.9l1-1c.4-.5.6-1 .6-1.5 0-.6-.1-1-.4-1.3-.2-.3-.6-.4-1.2-.4-.5 0-.9.1-1.2.4-.3.3-.4.6-.4 1H5c0-.7.3-1.4.9-1.9.5-.5 1.2-.7 2.1-.7 1 0 1.7.3 2.2.8.5.5.8 1.1.8 2 0 .9-.4 1.7-1.2 2.6l-.8.8c-.4.4-.5 1-.5 1.7H7zm0 2.3c0-.2 0-.4.2-.5l.6-.3c.3 0 .5.1.6.3.2.1.2.3.2.5 0 .3 0 .4-.2.6l-.6.2c-.2 0-.4 0-.6-.2a.8.8 0 0 1-.2-.6z' />
                );
                break;
        }
    }
    return (
        <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
            {IconType}
        </svg>

    );
};

IconTradeType.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export { IconTradeType };
