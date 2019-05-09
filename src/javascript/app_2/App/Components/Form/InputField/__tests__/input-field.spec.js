import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import InputField             from '../input-field.jsx';
import IncrementButtons       from '../increment-buttons.jsx';
import Tooltip                from '../../../Elements/tooltip.jsx';

configure({ adapter: new Adapter() });

describe('InputField', () => {
    const onChange = val => val;

    it('should render one <InputField /> component', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper).to.have.length(1);
    });
    it('should render Tooltip', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find(Tooltip).exists()).to.be.true;
    });
    it('Tooltip should render if there is error', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find(Tooltip).prop('message')).to.be.null;
        wrapper.setProps({ error_messages: [] });
        expect(wrapper.find(Tooltip).prop('message')).to.be.null;
        wrapper.setProps({ error_messages: ['this is error!'] });
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
        wrapper.setProps({ name: 'something' });
        expect(wrapper.contains(<label htmlFor='something' className='input-field__label'>this is label</label>)).to.be.true;
    });
    it('prefix symbol should render if it\'s passed', () => {
        const wrapper = shallow(<InputField  />);
        expect(wrapper.find('.symbols').exists()).to.be.false;
        wrapper.setProps({ prefix: 'USD', classNamePrefix: 'class-prefix' });
        expect(wrapper.contains(
            <div className='class-prefix'>
                <span className='class-prefix--symbol symbols symbols--usd' />
            </div>
        )).to.be.true;
    });
    it('display_value should change with unit and is_unit_at_right', () => {
        const wrapper = shallow(<InputField value={10} onChange={onChange} />);
        expect(wrapper.find('.input').prop('display_value')).to.be.equal(10);
        wrapper.setProps({ unit: '$' });
        expect(wrapper.find('.input').prop('display_value')).to.be.equal('$ 10');
        wrapper.setProps({ is_unit_at_right: true });
        expect(wrapper.find('.input').prop('display_value')).to.be.equal('10 $');
    });
    it('should IncrementButtons be rendered based on conditions', () => {
        const wrapper = shallow(<InputField is_incrementable />);
        expect(wrapper.find(IncrementButtons).exists()).to.be.false;
        wrapper.setProps({ type: 'number' });
        expect(wrapper.find(IncrementButtons).exists()).to.be.true;
        wrapper.setProps({ type: 'tel' });
        expect(wrapper.find(IncrementButtons).exists()).to.be.true;
        wrapper.setProps({ is_incrementable: false });
        expect(wrapper.find(IncrementButtons).exists()).to.be.false;
    });
    it('should IncrementButtons has min_is_disabled when value is less than min_value', () => {
        const wrapper = shallow(<InputField is_incrementable type='number' min_value={3} value={2} />);
        expect(wrapper.find(IncrementButtons).prop('min_is_disabled')).to.be.true;
        wrapper.setProps({ value: 4 });
        console.log(wrapper.find(IncrementButtons).prop('min_is_disabled'));
        expect(wrapper.find(IncrementButtons).prop('min_is_disabled')).to.be.false;
        wrapper.setProps({ value: 3 });
        expect(wrapper.find(IncrementButtons).prop('min_is_disabled')).to.be.true;
    });
    it('should ', () => {
        const wrapper = shallow(<InputField is_incrementable type='number' value={2} is_negative_disabled />);
        expect(wrapper.find(IncrementButtons).prop('min_is_disabled')).to.be.false;
        wrapper.setProps({ value: 0.5 });
        expect(wrapper.find(IncrementButtons).prop('min_is_disabled')).to.be.true;
    });
    // TODO: Add more tests
});
