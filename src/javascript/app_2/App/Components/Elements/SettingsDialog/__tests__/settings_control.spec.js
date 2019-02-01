import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import SettingsControl        from '../settings_control.jsx';

configure({ adapter: new Adapter() });

describe('SettingsControl', () => {
    it('should render one <SettingsControl /> component', () => {
        const wrapper = shallow(<SettingsControl />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(
            <SettingsControl>
                { child_div }
            </SettingsControl>
        );
        expect(wrapper.contains(child_div)).to.equal(true);
    });
});
