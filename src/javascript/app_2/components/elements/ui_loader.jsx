import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';

const UILoader = ({ className }) => {
    const loading_class = classNames('loading', className);
    return (
        <div className='block-ui'>
            <div className={loading_class}>
                <div className='spinner'>
                    <div className='mask'>
                        <div className='maskedCircle' />
                    </div>
                </div>
            </div>
        </div>
    );
};

UILoader.propTypes = {
    className: PropTypes.string,
};

export default UILoader;
