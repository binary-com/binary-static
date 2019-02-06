import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import InputField             from '../input_field.jsx';
import Tooltip                from '../../Elements/tooltip.jsx';

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
    it('should have null message in Tooltip if there is no error_messages in props', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find(Tooltip).prop('message')).to.be.null;
    });
    it('should have null message in Tooltip if error_messages is empty array in props', () => {
        const wrapper = shallow(<InputField error_messages={[]} />);
        expect(wrapper.find(Tooltip).prop('message')).to.be.null;
    });
    it('should have message in Tooltip if there is an error message', () => {
        const wrapper = shallow(<InputField error_messages={['this is error!']} />);
        expect(wrapper.find(Tooltip).prop('message')).to.be.equal('this is error!');
    });
    it('should render input with .error when it has error messages', () => {
        const wrapper = shallow(<InputField error_messages={['this is error!']} />);
        expect(wrapper.find('input').prop('className')).to.be.equal('error');
    });
    it('should render input without .error when it does not have any error message', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find('input').prop('className')).to.be.empty;
    });
    it('should have className passed to it as props', () => {
        const wrapper = shallow(<InputField className='a_cool_className' />);
        expect(wrapper.find('.a_cool_className').exists()).to.be.true;
        expect(wrapper.prop('className')).to.be.equal('input-field a_cool_className');
    });
    it('should have input with maxLength equal to max_length passed as props if fractional_digits is not passed', () => {
        const wrapper = shallow(<InputField max_length={2} />);
        expect(wrapper.find('input').prop('maxLength')).to.be.equal(2);
    });
    it('should have input with maxLength equal to max_length + fractional_digits + 1 if fractional_digits is passed', () => {
        const wrapper = shallow(<InputField max_length={2} fractional_digits={2} />);
        expect(wrapper.find('input').prop('maxLength')).to.be.equal(5);
    });
    it('should have an input_helper with helper passed as prop', () => {
        const wrapper = shallow(<InputField helper='this is helper' />);
        expect(wrapper.contains(<span className='input-helper'>this is helper</span>)).to.be.true;
    });
    it('should not have input_helper if helper is not passed as prop', () => {
        const wrapper = shallow(<InputField helper='this is helper' />);
        expect(wrapper.find('.input-helper').exists()).to.be.true;
    });
    it('should have disabled input if is_disabled is true', () => {
        const wrapper = shallow(<InputField is_disabled={true} />);
        expect(wrapper.find('input').prop('disabled')).to.be.true;
    });
    it('should have input with disabled equal to false if is_disabled is false', () => {
        const wrapper = shallow(<InputField is_disabled={false} />);
        expect(wrapper.find('input').prop('disabled')).to.be.false;
    });
    it('should not have prop disabled defined in input if is_disabled is not passed', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find('input').prop('disabled')).to.be.undefined;
    });
    it('should have label with label passed', () => {
        const wrapper = shallow(<InputField label='this is label' />);
        expect(wrapper.contains(<label className='input-label'>this is label</label>)).to.be.true;
    });
    it('should have label with htmlFor if label and name are passed', () => {
        const wrapper = shallow(<InputField name='something' label='this is label' />);
        expect(wrapper.contains(<label htmlFor='something' className='input-label'>this is label</label>)).to.be.true;
    });
    it('should have icon with prefix lowercased as class if prefix is passed', () => {
        const wrapper = shallow(<InputField prefix='Something' />);
        expect(wrapper.contains(<span className='symbols something' />)).to.be.true;
    });
    it('should not have .symbols if prefix is not passed', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find('.symbols').exists()).to.be.false;
    });
    it('should have input with placeholder if placeholder is passed', () => {
        const wrapper = shallow(<InputField placeholder='this is placeholder' />);
        expect(wrapper.find('input').prop('placeholder')).to.be.equal('this is placeholder');
    });
    it('should have input with undefined placeholder if placeholder is not passed', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find('input').prop('placeholder')).to.be.undefined;
    });
    it('should have input with undefined placeholder if placeholder is empty string', () => {
        const wrapper = shallow(<InputField placeholder='' />);
        expect(wrapper.find('input').prop('placeholder')).to.be.undefined;
    });
    it('should have required input if required is passed as true', () => {
        const wrapper = shallow(<InputField required={true} />);
        expect(wrapper.find('input').prop('required')).to.be.true;
    });
    it('should have an input which is not required if required is not passed', () => {
        const wrapper = shallow(<InputField required={false} />);
        expect(wrapper.find('input').prop('required')).to.be.undefined;
    });
    it('should have an input which is not required if required is not passed', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find('input').prop('required')).to.be.undefined;
    });
    it('should have input with autoComplete off if is_autocomplete_disabled is true', () => {
        const wrapper = shallow(<InputField is_autocomplete_disabled={true} />);
        expect(wrapper.find('input').prop('autoComplete')).to.be.equal('off');
    });
    it('should have input with autoComplete undefined if is_autocomplete_disabled is false', () => {
        const wrapper = shallow(<InputField is_autocomplete_disabled={false} />);
        expect(wrapper.find('input').prop('autoComplete')).to.be.undefined;
    });
    it('should have input with value if value is passed', () => {
        const wrapper = shallow(<InputField value={123} />);
        expect(wrapper.find('input').prop('value')).to.be.equal(123);
    });
    it('should have input with no value if value is not passed', () => {
        const wrapper = shallow(<InputField />);
        expect(wrapper.find('input').prop('value')).to.be.empty;
    });
    it('should have input with value and unit if they are passed', () => {
        const wrapper = shallow(<InputField value={123} unit='s' />);
        expect(wrapper.find('input').prop('value')).to.be.equal('s 123');
    });
    it('should have input with value and unit in right if they are passed', () => {
        const wrapper = shallow(<InputField value={123} unit='s' is_unit_at_right={true} />);
        expect(wrapper.find('input').prop('value')).to.be.equal('123 s');
    });
    //    TODO: Add more tests to cover functions (after refactor)
});
