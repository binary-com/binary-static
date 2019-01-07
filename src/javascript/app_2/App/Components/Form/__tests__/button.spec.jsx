import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Button                 from '../button.jsx';

configure({ adapter: new Adapter() });

describe('Button', () => {
    it('should render one <Button /> component', () => {
        const wrapper = shallow(<Button />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(
            <Button>
                { child_div }
            </Button>
        );
        expect(wrapper.contains(child_div)).to.equal(true);
    });
    it('should have .effect when has_effect is true', () => {
        const wrapper = shallow(<Button has_effect={true} />);
        expect(wrapper.find('.effect').exists()).to.equal(true);
    });
    it('should not have .effect when has_effect is false', () => {
        const wrapper = shallow(<Button has_effect={false} />);
        expect(wrapper.find('.effect').exists()).to.equal(false);
    });
    it('should have className passed to it', () => {
        const wrapper = shallow(<Button className='a_cool_className' />);
        expect(wrapper.find('.a_cool_className').exists()).to.equal(true);
    });
    it('should return button if wrapperClassName is undefined', () => {
        const wrapper = shallow(<Button />);
        expect(wrapper.find('button').exists()).to.equal(true);
    });
    it('should return button in a wrapper with wrapperClassName if wrapperClassName is defined', () => {
        const wrapper = shallow(<Button wrapperClassName='wrapper_class_name' />);
        expect(wrapper.find('.wrapper_class_name').exists().and.wrapper.find('button').exists()).to.equal(true);
    });
    it('should have id passed to it', () => {
        const wrapper = shallow(<Button id='cool_id' />);
        expect(wrapper.prop('id')).to.equal('cool_id');
    });
    it('should contain a span with text passed to it', () => {
        const wrapper = shallow(<Button text='this is a text' />);
        expect(wrapper.contains(<span>this is a text</span>)).to.equal(true);
    });
    it('should have onClick as an instance of function when passed', () => {
        const wrapper = shallow(<Button onClick={() => true} />);
        expect(wrapper.prop('onClick')).to.be.an.instanceof(Function);
    });
    it('should not have onClick as undefined when it\'s not passed', () => {
        const wrapper = shallow(<Button />);
        expect(wrapper.prop('onClick')).to.be.undefined();
    });
    it('should be disabled when is_disabled is true', () => {
        const wrapper = shallow(<Button is_disabled={true} />);
        expect(wrapper.prop('disabled')).to.be.equal(true);
    });
    it('should not be disabled when is_disabled is false', () => {
        const wrapper = shallow(<Button is_disabled={false} />);
        expect(wrapper.prop('disabled')).to.be.equal(false);
    });
});
