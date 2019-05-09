import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Button                 from '../button.jsx';
import { testChildren }       from '../../../../test-helper';

configure({ adapter: new Adapter() });

describe('Button', () => {
    it('should render one <Button /> component', () => {
        const wrapper = shallow(<Button />);
        expect(wrapper).to.have.length(1);
    });
    it('should render with wrapper if wrapperClassName is passed', () => {
        const wrapper = shallow(
            <Button />
        );
        expect(wrapper.find('.wrapper-class').exists()).to.be.false;
        wrapper.setProps({ wrapperClassName: 'wrapper-class' });
        expect(wrapper.find('.wrapper-class').exists()).to.be.true;
    });
    it('should render children when passed in', () => {
        testChildren(<Button />);
    });
    it('should have .effect when has_effect is true', () => {
        const wrapper = shallow(<Button has_effect />);
        expect(wrapper.find('.effect').exists()).to.be.true;
    });
    it('should have className when passed', () => {
        const wrapper = shallow(<Button className='a-cool-classname' />);
        expect(wrapper.find('.a-cool-classname').exists()).to.be.true;
    });
    it('should have tabIndex when passed and zero when not passed', () => {
        const wrapper = shallow(<Button />);
        expect(wrapper.prop('tabIndex')).to.be.equal('0');
        wrapper.setProps({ tabIndex: '2' });
        expect(wrapper.prop('tabIndex')).to.be.equal('2');
    });
    it('should have tabIndex when passed and zero when not passed', () => {
        const wrapper = shallow(<Button />);
        const onClick = () => true;
        expect(wrapper.prop('onClick')).to.be.undefined;
        wrapper.setProps({ onClick });
        expect(wrapper.prop('onClick')).to.be.equal(onClick);
    });
    it('should have tabIndex when passed and zero when not passed', () => {
        const wrapper = shallow(<Button is_disabled={false} />);
        expect(wrapper.prop('disabled')).to.be.false;
        wrapper.setProps({ is_disabled: true });
        expect(wrapper.prop('disabled')).to.be.true;
    });
});
