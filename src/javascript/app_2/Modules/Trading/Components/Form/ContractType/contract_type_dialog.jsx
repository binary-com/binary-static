import PropTypes        from 'prop-types';
import React            from 'react';
import FullScreenDialog from '../../Elements/full_screen_dialog.jsx';

const ContractTypeDialog = ({
    children,
    is_mobile,
    open,
    onClose,
}) => (
    is_mobile ?
        <React.Fragment>
            <span className='select-arrow' />
            <FullScreenDialog
                title='Select Trading Type'
                visible={open}
                onClose={onClose}
            >
                {children}
            </FullScreenDialog>
        </React.Fragment>
    :
        <div className='contracts-popup-list'>
            <div className='list-container'>
                {children}
            </div>
        </div>
);

ContractTypeDialog.propTypes = {
    children : PropTypes.element,
    is_mobile: PropTypes.bool,
    open     : PropTypes.bool,
    onClose  : PropTypes.func,
};

export default ContractTypeDialog;
