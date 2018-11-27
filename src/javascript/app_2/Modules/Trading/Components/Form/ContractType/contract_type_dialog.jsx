import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import FullScreenDialog  from '../../Elements/full_screen_dialog.jsx';

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
        <CSSTransition
            in={open}
            timeout={100}
            classNames='contracts-popup-list'
            unmountOnExit
        >
            <div className='contracts-popup-list'>
                <div className='list-container'>
                    {children}
                </div>
            </div>
        </CSSTransition>
);

ContractTypeDialog.propTypes = {
    children : PropTypes.element,
    is_mobile: PropTypes.bool,
    onClose  : PropTypes.func,
    open     : PropTypes.bool,
};

export default ContractTypeDialog;
