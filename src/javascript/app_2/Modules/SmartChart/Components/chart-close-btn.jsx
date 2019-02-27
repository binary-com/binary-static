import PropTypes       from 'prop-types';
import React           from 'react';
import { Link }        from 'react-router-dom';
import { localize }    from '_common/localize';
import routes          from 'Constants/routes';

const ChartCloseBtn = ({
    is_contract_mode,
    onClose,
}) => {
    if (!is_contract_mode) return null;
    return (
        <div className='chart-close-btn'>
            <Link
                className='btn btn--link btn--secondary btn--secondary--orange'
                to={routes.trade}
                onClick={onClose}
            >
                <span className='btn__text'>{localize('Start a new trade')}</span>
            </Link>
        </div>
    );
};

ChartCloseBtn.propTypes = {
    is_contract_mode: PropTypes.bool,
    onClose         : PropTypes.func,
};

export default ChartCloseBtn;
