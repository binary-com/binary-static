import React from 'react';

const ConfirmDialog = () => (
    <React.Fragment>
        <div id='confirm_dialog_content' className='gr-padding-20 gr-gutter'>
            <div className='gr-gutter'>
                <div className='gr-gutter'>
                    <p id='confirm_dialog_text' className='gr-padding-10 no-margin'></p>
                    <div className='gr-row gr-row-align-right gr-padding-10'>
                        <form id='frm_confirm'>
                            <a className='button button-secondary' id='btn_cancel' href='javascript:;'><span>{it.L('Cancel')}</span></a>
                            <a className='button' id='btn_ok' href='javascript:;'><span>{it.L('OK')}</span></a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default ConfirmDialog;
