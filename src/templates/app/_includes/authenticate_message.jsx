import React             from 'react';
import { Table }         from '../../_common/components/elements.jsx';

const FileSelector = ({
    heading,
    data_show,
    allowed_documents,
    instructions,
    accepted_documents,
    type,
}) => (
    <div className='gr-12 gr-no-gutter' data-show={data_show}>
        <fieldset>
            <div className='gr-padding-10 gr-gutter-left gr-gutter-right'>
                <h2>{heading}</h2>
                <div className='gr-row'>
                    <div className='gr-7 gr-12-m'>
                        {allowed_documents &&
                            <React.Fragment>
                                <strong>{it.L('We accept')}:</strong>
                                <ul className='bullet'>
                                    { allowed_documents.map((document, i) => (
                                        <li key={i}>{document}</li>
                                    ))}
                                </ul>
                            </React.Fragment>
                        }
                        <strong>{it.L('Requirements')}:</strong>
                        <ul className='bullet'>
                            { instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='gr-5 gr-12-m'>
                        <p className='font-s'>
                            {accepted_documents.length > 1
                                ? `${it.L('Submit one of the documents below')}:`
                                : `${it.L('Submit the document below')}:`
                            }
                        </p>
                        <div className='files'>
                            { accepted_documents.map((document, i) => {
                                const j = i + 1;
                                return (
                                    <React.Fragment key={i}>
                                        <h3>{document.name}</h3>
                                        <div className='fields'>
                                            { type === 'poi' && (
                                                <React.Fragment>
                                                    <div className='gr-row form-row center-text-m'>
                                                        <div className='gr-4 gr-12-m'>
                                                            <label htmlFor={`id_number_${j}`}>{it.L('ID number')}:</label>
                                                        </div>
                                                        <div className='gr-8 gr-12-m'>
                                                            <input id={`id_number_${j}`} type='text' maxLength='30' />
                                                        </div>
                                                    </div>
                                                    <div className='gr-row form-row center-text-m' id={`expiry_datepicker_${document.value}`}>
                                                        <div className='gr-4 gr-12-m'>
                                                            <label htmlFor={`exp_date_${j}`}>{it.L('Expiry date')}:</label>
                                                        </div>
                                                        <div className='gr-8 gr-12-m'>
                                                            <input className='date-picker' id={`exp_date_${j}`} type='text' maxLength='200' readOnly='readonly' />
                                                        </div>
                                                    </div>
                                                    <div className='gr-row form-row center-text-m'>
                                                        <div className='gr-12'>
                                                            <input id={`front_file${j}`} className='file-picker' type='file' accept='.jpg, .jpeg, .gif, .png, .pdf' data-type={document.value} data-name={document.name} data-page-type='front' />
                                                            <label htmlFor={`front_file${j}`} className='button'>{it.L('Front side')} <span className='add' /></label>
                                                        </div>
                                                        <div className='gr-12'>
                                                            <input id={`back_file${j}`} className='file-picker' type='file' accept='.jpg, .jpeg, .gif, .png, .pdf' data-type={document.value} data-name={document.name} data-page-type='back' />
                                                            <label htmlFor={`back_file${j}`} className='button'>{it.L('Reverse side')} <span className='add' /></label>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            )}
                                            { type === 'poa' && (
                                                <div className='gr-row form-row gr-centered'>
                                                    <div className='gr-12'>
                                                        <input id={`add_file${j}`} className='file-picker' type='file' accept='.jpg, .jpeg, .gif, .png, .pdf' data-type={document.value} data-name={document.name} />
                                                        <label htmlFor={`add_file${j}`} className='button'>{it.L('Add')} <span className='add' /></label>
                                                    </div>
                                                </div>
                                            )}
                                            { type === 'selfie' && (
                                                <div className='gr-row form-row gr-centered'>
                                                    <div className='gr-12'>
                                                        <input id={`selfie${j}`} className='file-picker' type='file' accept='.jpg, .jpeg, .gif, .png' data-type='other' data-name={document.name} data-page-type='photo' />
                                                        <label htmlFor={`selfie${j}`} className='button'>{it.L('Add')} <span className='add' /></label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
);

const AuthenticateMessage = () => (
    <React.Fragment>
        <FileSelector
            allowed_documents={[
                it.L('Utility bills (electricity, water, gas, broadband and landline)'),
                it.L('Latest bank statement or any government-issued letter which contains your name and address')]}
            instructions={[
                it.L('Must be a clear, colour photo or scanned image'),
                it.L('Issued under your own name'), it.L('Dated within the last six months'),
                it.L('Only JPG, JPEG, GIF, PNG and PDF formats are accepted'),
                it.L('Maximum upload size for each file is [_1]', '8MB'),
            ]}
            type='poa'
            accepted_documents={[
                { name: it.L('Utility bill'), value: 'proofaddress' },
                { name: it.L('Bank statement'), value: 'bankstatement' },
            ]}
        />

        <div className='submit-status gr-centered gr-padding-30 invisible'>
            <h2 className='center-text'>{it.L('Document submission status')}</h2>
            <Table
                data={{
                    thead: [
                        [
                            { text: it.L('Document Type'), className: 'gr-padding-10 align-start' },
                            { text: it.L('File Name'),     className: 'gr-padding-10 align-start' },
                            { text: it.L('Status'),        className: 'gr-padding-10 align-start' },
                        ],
                    ],
                }}
            />
        </div>

        <div className='center-text'>
            <div id='resolve_error' className='invisible center-text'>{it.L('Please resolve all pending issues to continue')}</div>
            <div id='msg_form' className='error-msg invisible center-text' />
            <div className='gr-padding-10'>
                <a className='button-disabled' id='btn_submit' type='submit'>
                    <span>{it.L('Submit for review')}</span>
                </a>
            </div>
        </div>
    </React.Fragment>
);

export default AuthenticateMessage;
