import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const FileSelector = ({
    heading,
    allowed_documents,
    instructions,
    accepted_documents,
    type,
}) => (
    <div className='gr-row gr-12'>
        <fieldset>
            <div className='gr-padding-30 gr-gutter-left gr-gutter-right'>
                <h2>{heading}</h2>
                <div className='gr-row'>
                    <div className='gr-7 gr-12-m'>
                        <strong>{it.L('We accept')}:</strong>
                        <ul className='bullet'>
                            { allowed_documents.map((document, i) => (
                                <li key={i}>{document}</li>
                            ))}
                        </ul>
                        <strong>{it.L('Requirements')}:</strong>
                        <ul className='bullet'>
                            { instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                            ))}
                        </ul>
                        <p className='learn_more'>
                            <a href='#' target='_blank'>{it.L('Learn more')}</a>
                        </p>
                    </div>
                    <div className='gr-5 gr-12-m'>
                        <p className='font-s'>{it.L('Submit one of the documents below')}:</p>
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
                                                    <div className='gr-row form-row center-text-m'>
                                                        <div className='gr-4 gr-12-m'>
                                                            <label htmlFor={`exp_date_${j}`}>{it.L('Expiry date')}:</label>
                                                        </div>
                                                        <div className='gr-8 gr-12-m'>
                                                            <input className='date-picker' id={`exp_date_${j}`} type='text' maxLength='200' readOnly='true' />
                                                        </div>
                                                    </div>
                                                    <div className='gr-row form-row center-text-m'>
                                                        <div className='gr-12'>
                                                            <input id={`front_file${j}`} className='file-picker' type='file' accept='.jpg, .jpeg, .gif, .png, .pdf' data-type={document.value} />
                                                            <label htmlFor={`front_file${j}`} className='button'>{it.L('Front Side')} <span className='add' /></label>
                                                        </div>
                                                        <div className='gr-12'>
                                                            <input id={`back_file${j}`} className='file-picker' type='file' accept='.jpg, .jpeg, .gif, .png, .pdf' data-type={document.value} />
                                                            <label htmlFor={`back_file${j}`} className='button'>{it.L('Reverse Side')} <span className='add' /></label>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            )}
                                            { type === 'poa' && (
                                                <div className='gr-row form-row gr-centered'>
                                                    <div className='gr-12'>
                                                        <input id={`add_file${j}`} className='file-picker' type='file' accept='.jpg, .jpeg, .gif, .png, .pdf' data-type={document.value} />
                                                        <label htmlFor={`add_file${j}`} className='button'>{it.L('Add')} <span className='add' /></label>
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
        <p>{it.L('Authenticate your account by verifying your identity and address.')}</p>

        <FileSelector
            heading={it.L('1. Proof of identity')}
            allowed_documents={[
                it.L('Passport'),
                it.L('Driving licence'),
                it.L('National ID card or any government issued document which contains a photo, your name, and date of birth'),
            ]}
            instructions={[
                it.L('Must be a clear, colour photo or scanned image'), it.L('Minimum of six months validity'),
                it.L('Only JPG, JPEG, GIF, PNG and PDF formats are accepted'),
                it.L('Maximum upload size for each file is 3MB'),
            ]}
            type='poi'
            accepted_documents={[
                { name: it.L('Passport'), value: 'passport' },
                { name: it.L('Identity card'), value: 'proofid' },
                { name: it.L('Driving licence'), value: 'driverslicense' },
            ]}
        />

        <SeparatorLine className='gr-padding-10' invisible />

        <FileSelector
            heading={it.L('2. Proof of address')}
            allowed_documents={[
                it.L('Utility bills (electricity, water, gas, broadband and landline)'),
                it.L('Latest bank statement or any government-issued letter which contains your name and address')]}
            instructions={[
                it.L('Must be a clear, colour photo or scanned image'),
                it.L('Issued under your own name'), it.L('Dated within the last six months'),
                it.L('Only JPG, JPEG, GIF, PNG and PDF formats are accepted'),
                it.L('Maximum upload size for each file is 3MB'),
            ]}
            type='poa'
            accepted_documents={[
                { name: it.L('Utility bill'), value: 'proofaddress' },
                { name: it.L('Bank statement'), value: 'bankstatement' },
            ]}
        />

        <div className='center-text'>
            <div id='msg_form' className='error-msg invisible' />
            <div className='gr-padding-10'>
                <a className='button-disabled' id='btn_submit' type='submit'>
                    <span>{it.L('Submit for review')}</span>
                </a>
            </div>
        </div>
    </React.Fragment>
);

export default AuthenticateMessage;
