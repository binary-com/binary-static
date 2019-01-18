import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import ToggleButton           from '../toggle_button.jsx';

configure({ adapter: new Adapter() });

describe('ToggleButton', () => {
    it('should render one <ToggleButton /> component', () => {
        const wrapper = shallow(<ToggleButton />);
        expect(wrapper).to.have.length(1);
    });
    it('should have class equal to style passed in props', () => {
        const wrapper = shallow(<ToggleButton style='red' />);
        expect(wrapper.hasClass('red')).to.be.true;
    });
    it('should have toggle-button class if style is not passed', () => {
        const wrapper = shallow(<ToggleButton />);
        expect(wrapper.hasClass('toggle-button')).to.be.true;
    });
    it('should have class .toggled if toggled is passed true in props', () => {
        const wrapper = shallow(<ToggleButton toggled={true} />);
        expect(wrapper.find('.toggled').exists()).to.be.true;
    });
    it('should not have .toggled if toggled is passed false in props', () => {
        const wrapper = shallow(<ToggleButton toggled={false} />);
        expect(wrapper.find('.toggled').exists()).to.be.false;
    });
    it('should not have .toggled if toggled is not passed in props', () => {
        const wrapper = shallow(<ToggleButton />);
        expect(wrapper.find('.toggled').exists()).to.be.false;
    });
});
