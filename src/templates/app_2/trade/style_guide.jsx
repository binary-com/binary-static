import React from 'react';
import { Button } from '../../../javascript/app_2/pages/trading/components/form/button.jsx';

const StyleGuide = () => (
    <div className='container'>
        <div className='gr-row'>
            <div className='gr-3 gr-centered'>
                <h2 className='center-text'>Buttons</h2>
            </div>
        </div>
        <div className='gr-row'>
            <div className='gr-3'>
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
            <div className='gr-3'>
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
);

export default StyleGuide;
