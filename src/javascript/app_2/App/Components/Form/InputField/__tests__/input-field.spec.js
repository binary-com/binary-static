import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import InputField             from '../input-field.jsx';
import Tooltip                from '../../../Elements/tooltip.jsx';

configure({ adapter: new Adapter() });

describe('InputField', () => {
    it('should render one <InputField /> component', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper).to.have.length(1);
    });
    it('should render Tooltip', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find(Tooltip).exists()).to.be.true;
    });
    it('should have null message in Tooltip if there is eno error message', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find(Tooltip).prop('message')).to.be.null;
        wrapper.setProps({ error_messages: [] });
        expect(wrapper.find(Tooltip).prop('message')).to.be.null;
    });
    it('should have message in Tooltip if there is an error message', () => {
        const wrapper = shallow(<InputField error_messages={['this is error!']} />);
        expect(wrapper.find(Tooltip).prop('message')).to.be.equal('this is error!');
    });
    it('should have className passed to it as props', () => {
        const wrapper = shallow(<InputField className='a-cool-className' />);
        expect(wrapper.find('.a-cool-className').exists()).to.be.true;
    });
    it('should have an input_helper with helper passed as prop and vice versa', () => {
        const wrapper = shallow(<InputField helper='this is helper' />);
        expect(wrapper.contains(<span className='input-field__helper'>this is helper</span>)).to.be.true;
        wrapper.setProps({ helper: '' });
        expect(wrapper.contains(<span className='input-field__helper'>this is helper</span>)).to.be.false;
    });
    it('should have label with label passed', () => {
        const wrapper = shallow(<InputField label='this is label' />);
        expect(wrapper.contains(<label className='input-field__label'>this is label</label>)).to.be.true;
    });
    it('should have label with htmlFor if label and name are passed', () => {
        const wrapper = shallow(<InputField name='something' label='this is label' />);
        expect(wrapper.contains(<label htmlFor='something' className='input-field__label'>this is label</label>)).to.be.true;
    });
    it('should prefix if prefix is passed', () => {
        const wrapper = shallow(<InputField prefix='USD' classNamePrefix='class-prefix' />);
        expect(wrapper.contains(
            <div className='class-prefix'>
                <span className='class-prefix--symbol symbols symbols--usd' />
            </div>
        )).to.be.true;
    });
    it('should not have .symbols if prefix is not passed', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find('.symbols').exists()).to.be.false;
    });

    // TODO: Add more tests
});
