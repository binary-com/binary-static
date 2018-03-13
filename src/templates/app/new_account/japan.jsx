import React from 'react';
import { FormRow, Fieldset } from '../../_common/components/forms.jsx';
import {
    FirstName,
    LastName,
    DateOfBirth,
    AddressLine1,
    AddressLine2,
    AddressCity,
    AddressState,
    AddressPostcode,
    Phone,
    SecretQuestion,
    SecretAnswer,
    ClientMessage,
} from '../../_common/components/forms_common_rows.jsx';

const Money = () => (
    <React.Fragment>
        <option value=''>{it.L('Please select')}</option>
        <option value='Less than 1 million JPY'>{it.L('Less than 1 million JPY')}</option>
        <option value='1-3 million JPY'>{it.L('1-3 million JPY')}</option>
        <option value='3-5 million JPY'>{it.L('3-5 million JPY')}</option>
        <option value='5-10 million JPY'>{it.L('5-10 million JPY')}</option>
        <option value='10-30 million JPY'>{it.L('10-30 million JPY')}</option>
        <option value='30-50 million JPY'>{it.L('30-50 million JPY')}</option>
        <option value='50-100 million JPY'>{it.L('50-100 million JPY')}</option>
        <option value='Over 100 million JPY'>{it.L('Over 100 million JPY')}</option>
    </React.Fragment>
);

const Experience = () => (
    <React.Fragment>
        <option value=''>{it.L('Please select')}</option>
        <option value='No experience'>{it.L('No experience')}</option>
        <option value='Less than 6 months'>{it.L('Less than 6 months')}</option>
        <option value='6 months to 1 year'>{it.L('6 months to 1 year')}</option>
        <option value='1-3 years'>{it.L('1-3 years')}</option>
        <option value='3-5 years'>{it.L('3-5 years')}</option>
        <option value='Over 5 years'>{it.L('Over 5 years')}</option>
    </React.Fragment>
);

const Checkbox = ({ id, text, children }) => (
    <div className='gr-padding-10 gr-12'>
        <input id={id} type='checkbox' />
        <label htmlFor={id} className='gr-gutter-left'>{text}</label>
        {children}
    </div>
);

const Japan = () => (
    <div className='gr-12 static_full'>
        <h1>{it.L('Real Money Account Opening')}</h1>
        <form id='japan-form' className='gr-padding-10'>
            <Fieldset legend={it.L('Details')}>
                <FormRow type='select' id='gender' label={it.L('Gender')}>
                    <option value=''>{it.L('Please select')}</option>
                    <option value='m'>{it.L('Male')}</option>
                    <option value='f'>{it.L('Female')}</option>
                </FormRow>

                <LastName hint={it.L('{JAPAN ONLY}No space between last name and first name')} />

                <FirstName hint={it.L('{JAPAN ONLY}No space between last name and first name')} />

                <DateOfBirth />

                <FormRow type='select' id='occupation' label={it.L('Occupation')}>
                    <option value=''>{it.L('Please select')}</option>
                    <option value='Office worker'>{it.L('Office worker')}</option>
                    <option value='Director'>{it.L('Director')}</option>
                    <option value='Public worker'>{it.L('Public worker')}</option>
                    <option value='Self-employed'>{it.L('Self-employed')}</option>
                    <option value='Housewife / Househusband'>{it.L('Housewife / Househusband')}</option>
                    <option value='Contract / Temporary / Part Time'>{it.L('Contract / Temporary / Part Time')}</option>
                    <option value='Student'>{it.L('Student')}</option>
                    <option value='Unemployed'>{it.L('Unemployed')}</option>
                    <option value='Others'>{it.L('Others')}</option>
                </FormRow>
            </Fieldset>

            <Fieldset legend={it.L('Address')}>
                <AddressPostcode hint={it.L('E.g. 123-4567')} />
                <AddressState />
                <AddressCity hint={it.L('E.g. Shibuya-ku')} />
                <AddressLine1 hint={it.L('E.g. Hiroo')} />
                <AddressLine2 hint={it.L('E.g. Building name, apartment number etc (Optional)')} />
                <Phone hint={it.L('E.g. 03-1234-5678')} />
            </Fieldset>

            <Fieldset legend={it.L('Security')}>
                <SecretQuestion />
                <SecretAnswer />
            </Fieldset>

            <Fieldset legend={it.L('Status')}>
                <FormRow
                    type='checkbox'
                    spaced
                    id='declare_not_fatca'
                    label={it.L('Not FATCA*')}
                    hint={it.L('You must not be a USA resident, citizen, or have any tax reporting to the USA')}
                />

                <FormRow type='select' id='annual_income' label={it.L('Annual Income')}>
                    <Money />
                </FormRow>

                <FormRow type='select' id='financial_asset' label={it.L('Financial Asset')}>
                    <Money />
                </FormRow>

                <FormRow
                    type='text'
                    id='daily_loss_limit'
                    label={it.L('Daily limit on losses')}
                    hint={it.L('Maximum aggregate loss per day.')}
                />
            </Fieldset>

            <Fieldset legend={it.L('Trading Experience')}>
                <FormRow type='select' id='trading_experience_equities' label={it.L('Equities')}>
                    <Experience />
                </FormRow>

                <FormRow type='select' id='trading_experience_commodities' label={it.L('Commodities')}>
                    <Experience />
                </FormRow>

                <FormRow type='select' id='trading_experience_foreign_currency_deposit' label={it.L('Foreign currency deposit')}>
                    <Experience />
                </FormRow>

                <FormRow type='select' id='trading_experience_margin_fx' label={it.L('Margin FX')}>
                    <Experience />
                </FormRow>

                <FormRow type='select' id='trading_experience_investment_trust' label={it.L('Investment trust')}>
                    <Experience />
                </FormRow>

                <FormRow type='select' id='trading_experience_public_bond' label={it.L('Public and corporation bond')}>
                    <Experience />
                </FormRow>

                <FormRow type='select' id='trading_experience_option_trading' label={it.L('OTC Derivative (Option) Trading')}>
                    <Experience />
                </FormRow>

                <FormRow type='select' id='trading_purpose' label={it.L('Purpose of trading')}>
                    <option value=''>{it.L('Please select')}</option>
                    <option value='Targeting short-term profits'>{it.L('Targeting short-term profits')}</option>
                    <option value='Targeting medium-term / long-term profits'>{it.L('Targeting medium-term / long-term profits')}</option>
                    <option value='Both the above'>{it.L('Both the above')}</option>
                    <option value='Hedging'>{it.L('Hedging')}</option>
                </FormRow>

                <FormRow type='select' row_class='hedging-assets invisible' id='hedge_asset' label={it.L('Classification of assets requiring hedge')}>
                    <option value=''>{it.L('Please select')}</option>
                    <option value='Foreign currency deposit'>{it.L('Foreign currency deposit')}</option>
                    <option value='Margin FX'>{it.L('Margin FX')}</option>
                    <option value='Other'>{it.L('Other')}</option>
                </FormRow>

                <FormRow
                    type='text'
                    row_class='hedging-assets invisible'
                    id='hedge_asset_amount'
                    label={it.L('Amount of above assets')}
                    attributes={{maxLength: '20'}}
                />

                <FormRow type='select' id='motivation_circumstances' label={it.L('Motivation/Circumstances')}>
                    <option value=''>{it.L('Please select')}</option>
                    <option value='Web Advertisement'>{it.L('Web Advertisement')}</option>
                    <option value='Homepage'>{it.L('Homepage')}</option>
                    <option value='Introduction by acquaintance'>{it.L('Introduction by acquaintance')}</option>
                    <option value='Others'>{it.L('Others')}</option>
                </FormRow>
            </Fieldset>

            <Fieldset legend={it.L('{JAPAN ONLY}Foreign PEP Declaration')}>
                <div className='gr-12'>
                    <p>{it.L('{JAPAN ONLY}We cannot accept applications from anyone who is a Foreign Politically Exposed Person, which is defined by the Act on Prevention of Transfer of Criminal Proceeds 2007 as anyone in the following categories:')}</p>
                    <ol>
                        <li>{it.L('{JAPAN ONLY}Foreign Head of State')}</li>
                        <li>
                            {it.L('{JAPAN ONLY}In a Government or Juridicial position such as:')}
                            <ul>
                                <li>{it.L('{JAPAN ONLY}Equivalent to Prime Minister, Minister of State, or Vice-Minister of State of Japan')}</li>
                                <li>{it.L('{JAPAN ONLY}Equivalent to Chairperson or Vice-Chairperson of the House of Representatives or the House of Councilors of Japan')}</li>
                                <li>{it.L('{JAPAN ONLY}Equivalent to Justice of the Supreme Court of Japan')}</li>
                                <li>{it.L('{JAPAN ONLY}Equivalent to Ambassador, Envoy, Government delegate, or Plenipotentiary of Japan')}</li>
                                <li>{it.L('{JAPAN ONLY}Equivalent to Head of the Joint Staff, Vice Chief of Staff, Chief of Staff of Ground Self-Defense Force, Vice Chief of Staff of G.S.D.F., Chief of Staff of Maritime Self-Defense Force, Vice Chief of Staff of M.S.D.F., Chief of Staff Air Self-Defense Force, or Vice Chief of Staff of A.S.D.F. of Japan')}</li>
                                <li>{it.L('{JAPAN ONLY}A board member of a Central Bank')}</li>
                                <li>{it.L('{JAPAN ONLY}A board member of a company subject to resolution or approval for its budget from a body equivalent to the Diet of Japan')}</li>
                            </ul>
                        </li>
                        <li>{it.L('{JAPAN ONLY}Current or former member of category 1) or 2)')}</li>
                        <li>{it.L('{JAPAN ONLY}Family members of categories 1) to 3)')}</li>
                        <li>{it.L('{JAPAN ONLY}Any corporation which is substantially owned or controlled by a someone described in categories 1) to 4)')}</li>
                    </ol>
                </div>

                <Checkbox id='not_pep' text={it.L('I declare I am not a Foreign Politically Exposed Person.')} />
            </Fieldset>

            <Fieldset legend={it.L('Agreement for documents')}>
                <p className='gr-12'>{it.L('We will provide all documents in electronic format. Please tick the box if you agree and go to the next step.')}</p>

                <Checkbox id='agree_use_electronic_doc' text={it.L('I hereby agree and accept that all documents such as pre-contract forms, all terms and conditions, trade reports and other legally required materials will be issued in electronic format only.')} />

                <p className='gr-padding-10 gr-12'>{it.L('To begin Binary option trading, you will first need to read all these documents carefully to understand the structure, risk and other important things. Please confirm that you have read and understood the documents listed below checking the box. If you have any questions, please contact our customer support.')}</p>

                <Checkbox checkbox id='agree_warnings_and_policies' text={it.L('I confirm my agreement to the contents of all the documents listed below:')}>
                    <ul>
                        <li><a href={`${it.url_for('terms-and-conditions-jp')}?#account-warning`} target='_blank'>{it.L('General Risk Warning')}</a></li>
                        <li><a href={`${it.url_for('terms-and-conditions-jp')}?#account-risk`} target='_blank'>{it.L('Risks for binary option trading')}</a></li>
                        <li><a href={it.url_for('get-started-jp')} target='_blank'>{it.L('Trading manual')}</a></li>
                        <li><a href={it.url_for('terms-and-conditions-jp')} target='_blank'>{it.L('Terms and conditions')}</a></li>
                        <li><a href={`${it.url_for('terms-and-conditions-jp')}?#account-privacy`} target='_blank'>{it.L('Privacy Policy')}</a></li>
                        <li><a href={`${it.url_for('terms-and-conditions-jp')}?#account-antisocial`} target='_blank'>{it.L('No connection with Antisocial forces')}</a></li>
                    </ul>
                </Checkbox>
            </Fieldset>

            <Fieldset legend={it.L('Confirmation and understandings')}>
                <p className='gr-12'>{it.L('To open a trading account, our customers must confirm they fully understand the mechanisms and risks of transactions. Please acknowledge your understanding and agreement to each of the following statements, by placing a check mark in the boxes alongside.')}</p>

                <Checkbox id='confirm_understand_own_judgment' text={it.L('I agree that I will trade OTC binary options using my own judgment and accept responsibility for any loss that may occur from the transaction, and that it is within a range acceptable with regard to the total value of my financial assets.')} />
                <Checkbox id='confirm_understand_trading_mechanism' text={it.L('I understand and agree that, with regard to over-the-counter binary option trading, I have read and understand the general conditions and mechanisms for trading the contract, including details of the underlying financial index, before committing to a transaction.')} />
                <Checkbox id='confirm_understand_judgment_time' text={it.L('Each option transaction has a specified expiry time and date, known as the judgment time.')} />
                <Checkbox id='confirm_understand_total_loss' text={it.L('If a customer holds a long position and the prediction goes wrong as of the judgment time, the invested principal amount will become zero value.')} />
                <Checkbox id='confirm_understand_sellback_loss' text={it.L('If a customer sells back a long option position before the determination time, then the sale price may be lower than the original purchase price, so there is a possibility of a net loss.')} />
                <Checkbox id='confirm_understand_shortsell_loss' text={it.L('If a customer holds a short position and the prediction is incorrect as of the judgment time, the customer is required to pay the payout amount, and as that will be greater than the trade price that the customer originally received, this will cause a net loss.')} />
                <Checkbox id='confirm_understand_company_profit' text={it.L('[_1] earns a return from the difference between the total amount of all customers\' payment and the total amount of all customers\' receipts.', it.website_name)} />

                <p className='gr-padding-10 gr-12'>{it.L('The customer agrees they understand each the following statements regarding OTC binary options trading:')}</p>

                <Checkbox id='confirm_understand_expert_knowledge' text={it.L('In carrying out OTC binary option trading, a customer needs expert knowledge such as the theoretical value of options, in order to make reasonable investment decisions.')} />
            </Fieldset>

            <div className='center-text'>
                <button className='button' type='submit'>{it.L('Open Account')}</button>
                <p id='submit-message' />
            </div>
        </form>

        <ClientMessage />
    </div>
);

export default Japan;
