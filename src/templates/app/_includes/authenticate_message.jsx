import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const File = ({
    document,
    type = ['.jpg', '.jpeg', '.gif', '.png', '.pdf'],
    j,
}) => (
    <React.Fragment>
        <h3>{document.name}</h3>
        <div className='fields'>
            {document.input ? (
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
                </React.Fragment>
                ) : null }
            <div className='gr-row form-row center-text-m'>
                {document.labels.map((file, k) => {
                    const id = Math.floor(Math.random() * 10**10);
                    return (
                        <div className='gr-12' key={k}>
                            <input
                                id={`${document.id}_${k}_${id}`}
                                data-placeholder={file}
                                data-name={document.name}
                                className='file-picker'
                                type='file'
                                accept={type.join(', ')}
                                data-type={document.value}
                            />
                            <label htmlFor={`${document.id}_${k}_${id}`} className='button'>{file} <span className='add' /></label>
                        </div>
                    );
                })}
            </div>
        </div>
    </React.Fragment>
);

const OtherRows = ({row}) => (
    <React.Fragment>
        <SeparatorLine className='gr-padding-20' invisible />
        <div className='gr-row'>
            <div className='gr-7 gr-12-m'>
                <strong>{row.subHeading}</strong>
                <ul className='bullet'>
                    {row.documentInfo.map((docInfo, i) => (
                        <li key={i}>{docInfo}</li>
                    ))}
                </ul>
                <strong>{it.L('Requirements')}:</strong>
                <ul className='bullet'>
                    {row.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>
            </div>
            <div className='gr-5 gr-12-m'>
                <p className='font-s'>{it.L('Submit one of the documents below')}:</p>
                <div className='files'>
                    { row.documents.map((document, i) => (
                        <File key={i} document={document} type={document.type} j={i+1}/>
                    ))}
                </div>
            </div>
        </div>
    </React.Fragment>
);

const FileSelector = ({
    heading,
    learn_more,
    allowed_documents,
    instructions,
    accepted_documents,
    other_rows,
    className
}) => (
    <div className={`gr-row gr-12 ${className}`}>
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
                        {instructions ? (
                            <React.Fragment>
                                <strong>{it.L('Requirements')}:</strong>
                                <ul className='bullet'>
                                    { instructions.map((instruction, i) => (
                                        <li key={i}>{instruction}</li>
                                    ))}
                                </ul>
                            </React.Fragment>
                        ) : null }
                        { learn_more ? (
                            <p className='learn_more'>
                                <a href='#' target='_blank'>{it.L('Learn more')}</a>
                            </p>
                        ) : null }
                    </div>
                    <div className='gr-5 gr-12-m'>
                        <p className='font-s'>{it.L('Submit one of the documents below')}:</p>
                        <div className='files'>
                            { accepted_documents.map((document, i) => (
                                <File key={i} document={document} j={i+1}/>
                            ))}
                        </div>
                    </div>
                </div>
                { other_rows ?
                    other_rows.map((row, k) => (
                        <OtherRows key={k} row={row} />
                    )) : null }
            </div>
        </fieldset>
    </div>
);


const AuthenticateMessage = () => (
    <React.Fragment>
        <p>{it.L('Authenticate your account by verifying your identity and address.')}</p>
        <div className='ja-hide'>
            <FileSelector
                heading={it.L('1. Proof of identity')}
                learn_more
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
                accepted_documents={[
                    { name: it.L('Passport'), value: 'passport', id: 'passport', input: true, labels: [it.L('Front Side'), it.L('Reverse Side')] },
                    { name: it.L('Identity card'), value: 'proofid', id: 'proofid', input: true, labels: [it.L('Front Side'), it.L('Reverse Side')] },
                    { name: it.L('Driving licence'), value: 'driverslicense', id: 'driverslicense', input: true, labels: [it.L('Front Side'), it.L('Reverse Side')] },
                ]}
            />

            <SeparatorLine className='gr-padding-10' invisible />

            <FileSelector
                heading={it.L('2. Proof of address')}
                learn_more
                allowed_documents={[
                    it.L('Utility bills (electricity, water, gas, broadband and landline)'),
                    it.L('Latest bank statement or any government-issued letter which contains your name and address')]}
                instructions={[
                    it.L('Must be a clear, colour photo or scanned image'),
                    it.L('Issued under your own name'), it.L('Dated within the last six months'),
                    it.L('Only JPG, JPEG, GIF, PNG and PDF formats are accepted'),
                    it.L('Maximum upload size for each file is 3MB'),
                ]}
                accepted_documents={[
                    { name: it.L('Utility bill'), value: 'proofaddress', id: 'proofaddress', labels: [it.L('Add')] },
                    { name: it.L('Bank statement'), value: 'bankstatement', id: 'bankstatement', labels: [it.L('Add')] },
                ]}
            />
        </div>

        <div className='invisible ja-show'>
            <FileSelector
                heading={it.L('1. Photo ID')}
                allowed_documents={[
                    it.L('Driving licence'),
                    it.L('Residence card (one of 3 types)'),
                    it.L('My number photo ID card'),
                ]}
                instructions={[
                    it.L('Must be a clear, colour photo or scanned image'), it.L('Minimum of six months validity'),
                    it.L('Only JPG, JPEG, GIF, PNG and PDF formats are accepted'),
                    it.L('Maximum upload size for each file is 3MB'),
                ]}
                accepted_documents={[
                    { name: it.L('Driving licence'), value: 'driverslicense', id: 'driverslicense', input: false, labels: [it.L('Front Side'), it.L('Reverse Side')] },
                    { name: it.L('Residence card'), value: 'other', id: 'residencecard', input: false, labels: [it.L('Front Side'), it.L('Reverse Side')] },
                    { name: it.L('My number photo ID card'), value: 'other', id: 'mynumberphotocard1', input: false, labels: [it.L('Front Side')] },
                ]}
            />

            <SeparatorLine className='gr-padding-10' invisible />

            <FileSelector
                heading={it.L('2. Non-Photo ID')}
                allowed_documents={[
                    it.L('Medical insurance card'),
                    it.L('Pension book'),
                ]}
                accepted_documents={[
                    { name: it.L('Medical insurance card'), value: 'other', id: 'insurancecard', input: false, labels: [it.L('Front Side')] },
                    { name: it.L('Pension book'), value: 'other', id: 'pensionbook', input: false, labels: [it.L('Inside page')] },
                ]}
                other_rows={[
                    {
                        subHeading  : 'And one of the below are compulsory',
                        documentInfo: [
                            it.L('All pages of resident record (excluding family records and my-number)'),
                            it.L('Registered seal certificate'),
                            it.L('Utility bill (electricity, gas, and water)'),
                        ],
                        documents: [
                            {name: it.L('Resident records (all pages)'), value: 'other', id: 'residentrecords', input: false, labels: [it.L('All pages (pdf)')], type: ['.pdf']},
                            {name: it.L('Registered seal certificate'), value: 'other', id: 'sealcertificate', input: false, labels: [it.L('Certificate')]},
                            {name: it.L('Utility bill (electricity, gas, and water)'), value: 'proofaddress', id: 'utilitybill', input: false, labels: [it.L('Bill')]},
                        ],
                        requirements: [
                            it.L('Must be a clear, colour photo or scanned image'), it.L('Minimum of six months validity'),
                            it.L('Only JPG, JPEG, GIF, PNG and PDF formats are accepted'),
                            it.L('Maximum upload size for each file is 3MB'),
                        ],
                    },
                ]}
            />

            <SeparatorLine className='gr-padding-10' invisible />

            <FileSelector
                className='invisible'
                heading={it.L('3. My number card (compulsory)')}
                allowed_documents={[
                    it.L('My number non-photo ID card'),
                    it.L('My number photo ID card'),
                ]}
                instructions={[
                    it.L('Must be a clear, colour photo or scanned image'), it.L('Minimum of six months validity'),
                    it.L('Only JPG, JPEG, GIF, PNG and PDF formats are accepted'),
                    it.L('Maximum upload size for each file is 3MB'),
                ]}
                accepted_documents={[
                    { name: it.L('My number non-photo ID card'), value: 'other', id: 'mynumbercard', input: false, labels: [it.L('Front Side'), it.L('Reverse Side')] },
                    { name: it.L('My number photo ID card'), value: 'other', id: 'mynumberphotocard', input: false, labels: [it.L('Front Side'), it.L('Reverse Side')] },
                ]}
            />
        </div>

        <div className='center-text'>
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
