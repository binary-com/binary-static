import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Popover                from '../popover.jsx';

configure({ adapter: new Adapter() });

describe('Popover', () => {
    it('should render one <Popover /> component', () => {
        const wrapper = shallow(<Popover />);
        expect(wrapper).to.have.length(1);
    });
    it('should have .popover-title when title is passed in props', () => {
        const wrapper = shallow(<Popover title='This is a title'>
            <div></div>
        </Popover>);
        expect(wrapper.find('.popover-title').exists()).to.be.true;
    });
    it('should have .popover-subtitle when title is passed in prop', () => {
        const wrapper = shallow(<Popover subtitle='This is a subtitle'>
            <div></div>
        </Popover>);
        expect(wrapper.find('.popover-subtitle').exists()).to.be.true;
    });
    it('should have the state is_open equal to true on mouseenter and false on mouseleave', () => {
        const wrapper = shallow(<Popover subtitle='This is a subtitle'>
            <div className='sweet-child-of-mine'></div>
        </Popover>);
        wrapper.find('.sweet-child-of-mine').simulate('mouseenter');
        expect(wrapper.state('is_open')).to.be.true;
        wrapper.find('.sweet-child-of-mine').simulate('mouseleave');
        expect(wrapper.state('is_open')).to.be.false;
    });

});
