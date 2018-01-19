import React from 'react';
import Menu from '../../_common/components/menu.jsx';

const MainMenu = () => (
    <div id='main-menu' className='tab-menu no-print fill-bg-color mt-hide'>
        <div className='tab-menu-wrap container gr-hide-m gr-hide-p'>
            <div className='gr-12 gr-no-gutter'>
                <ul className='items'>
                    <Menu />
                </ul>
            </div>
        </div>
    </div>
);
export default MainMenu;
