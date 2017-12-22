import React from 'react';
import { Fieldset } from '../../_common/components/forms.jsx';

const ProfessionalClient = () => (
    <Fieldset legend={it.L('Professional Client')} id='fs_professional' className='invisible'>
        <div className='gr-padding-10 gr-12'>
            <input id='chk_professional' type='checkbox' />
            <label htmlFor='chk_professional'>{it.L('I want to be treated as a professional client.')}</label>
            <a id='professional_info_toggle' className='toggle-arrow' href='javascript:;'>{it.L('What is this?')}</a>
            <div id='professional_info' style={{display: 'none'}}>
                <div id='non_uk' className='invisible'>
                    <p>{it.L('In order for us to be able to treat you as Professional Client, as a minimum, you have to satisfy two of the following criteria:')}</p>
                    <ul className='checked'>
                        <li>{it.L('You have carried out transactions, in significant size, on the relevant market that we are going to offer you, at an average frequency of 10 per quarter of the previous four quarters; and/or')}</li>
                        <li>{it.L('The size of your instrument portfolio (including Instruments &amp; Cash), with us or elsewhere, exceeds EUR500,000, or the equivalent; and/or')}</li>
                        <li>{it.L('You have worked in the financial sector for at least 1 year in a professional position that requires knowledge of the envisaged transactions.')}</li>
                    </ul>
                    <p>{it.L('By opting to be treated as a Professional Client, we shall not presume that you possess market knowledge and experience as defined by the term \'Professional Client\'. We will take all reasonable steps to ensure that your request for this Categorization meets the aforementioned criteria, including, but not limited to copies of:')}</p>
                </div>
                <div id='uk' className='invisible'>
                    <p>{it.L('By opting to be treated as a Professional Client, we shall not presume that you possess market knowledge and experience as defined by the term \'Professional Client\'. We will contact you with the relevant form to complete and will take all reasonable steps to ensure that your request for this Categorization meets the aforementioned criteria, including, but not limited to copies of:')}</p>
                </div>
                <ul className='bullet'>
                    <li>{it.L('Statements reflecting your transactions of the previous four quarters;')}</li>
                    <li>{it.L('Portfolio held elsewhere;')}</li>
                    <li>{it.L('Proof of your employment position.')}</li>
                </ul>
            </div>
            <div id='popup' className='invisible gr-padding-20 gr-gutter'>
                <h2>{it.L('Professional Clients')}</h2>
                <p>{it.L('As a Professional Client, you will be offered a lower degree of client protection, wherein:')}</p>
                <ul className='bullet'>
                    <li>{it.L('The Company presumes that you possess the experience, knowledge and expertise to make your own investment decisions and properly assess the risks involved in relation to the requested transaction/s;')}</li>
                    <li>{it.L('The Company is neither obliged to conduct an appropriateness test, nor to provide you with any risk warnings.')}</li>
                </ul>
                <p>{it.L('As a Professional Client, you are responsible for keeping the Company informed about any change which could affect your categorization as a Professional Client. At any time, you may choose to be treated as a Retail Client, even if you would ordinarily fall within the definition of a Professional Client.')}</p>
                <div className='center-text'>
                    <a className='button' id='btn_accept' href='javascript:;'><span>{it.L('ACCEPT')}</span></a>
                    <a className='button' id='btn_decline' data-value='decline' href='javascript:;'><span>{it.L('DECLINE')}</span></a>
                </div>
                <p><strong>{it.L('Note: If you decline to be treated as a professional, you can continue with the application to be treated as a retail client.')}</strong></p>
            </div>
        </div>
    </Fieldset>
);

export default ProfessionalClient;
