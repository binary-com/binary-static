import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconChevronDoubleLeft = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path fill='#5C5C5C' fillRule='evenodd' d='M4.247 8l4.587 4.128a.5.5 0 0 1-.668.744l-5-4.5a.5.5 0 0 1 0-.744l5-4.5a.5.5 0 0 1 .668.744L4.247 8zm8.587 4.128a.5.5 0 0 1-.668.744l-5-4.5a.5.5 0 0 1 0-.744l5-4.5a.5.5 0 0 1 .668.744L8.247 8l4.587 4.128z' />
    </svg>
);

IconChevronDoubleLeft.propTypes = {
    className: PropTypes.string,
};

export { IconChevronDoubleLeft };
