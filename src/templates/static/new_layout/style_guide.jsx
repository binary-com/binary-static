import React from 'react';
import Button from '../../../javascript/app_2/components/form/button.jsx';
import Tooltip from '../../../javascript/app_2/components/elements/tooltip.jsx';
import InputField from '../../../javascript/app_2/components/form/input_field.jsx';
import Breadcrumb from '../../../javascript/app_2/components/elements/breadcrumbs.jsx';

const StyleGuide = () => (
    <div className='container'>
        <div className='gr-row gr-padding-20'>
            <div className='gr-8 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Buttons</h2>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <Button
                            id='test_btn'
                            className='primary orange'
                            text='primary'
                            has_effect
                        />
                        <Button
                            id ='test_btn'
                            className='primary green'
                            text='primary'
                            has_effect
                        />
                        <Button
                            id ='test_btn'
                            className='primary green'
                            text='primary'
                            has_effect
                            is_disabled
                        />
                    </div>
                    <div className='gr-12'>
                        <Button
                            id ='test_btn'
                            className='secondary orange'
                            text='secondary'
                            has_effect
                        />
                        <Button
                            id='test_btn'
                            className='secondary green'
                            text='secondary'
                            has_effect
                        />
                        <Button
                            id='test_btn'
                            className='secondary green'
                            text='secondary'
                            has_effect
                            is_disabled
                        />
                    </div>
                    <div className='gr-12 gr-centered'>
                        <Button
                            id='test_btn'
                            className='flat'
                            text='is used in a card'
                            has_effect
                        />
                    </div>
                </div>
            </div>
            <div className='gr-4 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Input Field</h2>
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <InputField
                            type='text'
                            name='text'
                            placeholder='Placeholder Text'
                            label='Text Field'
                            helper='Helper messages go here'
                        />
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <InputField
                            type='number'
                            name='number'
                            placeholder='Placeholder Number'
                            label='Numbers Field'
                            helper='Helper messages go here'
                        />
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Tooltips</h2>
                        <div className='gr-row'>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='top' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Top</span>
                                </p>
                            </div>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='left' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Left</span>
                                </p>
                            </div>
                        </div>
                        <div className='gr-row'>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='right' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Right</span>
                                </p>
                            </div>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='bottom' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Bottom</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='gr-row gr-padding-20'>
            <div className='gr-8 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Breadcrumbs</h2>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-6'>
                        <Breadcrumb routes= {
                        [{
                            name: 'Home',
                            href: it.url_for('home'),
                        }, {
                            name: 'Getting started',
                            href: it.url_for('get-started'),
                        }, {
                            name: 'Some',
                        }]}
                        />
                    </div>
                    <div className='gr-6'>
                        <Breadcrumb routes= {
                        [{
                            name: 'Home',
                            icon: it.url_for('images/common/print.svg'),
                            href: it.url_for('home'),
                        }, {
                            name: 'Getting started',
                            href: it.url_for('get-started'),
                        }, {
                            name: 'Some',
                        }]}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );

export default StyleGuide;
