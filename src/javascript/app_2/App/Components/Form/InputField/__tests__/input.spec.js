import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Input                  from '../input.jsx';

configure({ adapter: new Adapter() });

describe('Input', () => {
    it('should render one <Input /> component', () => {
        const wrapper = shallow(<Input />);
        expect(wrapper).to.have.length(1);
    });
    it('should have symbol of inline_prefix if inline_prefix is passed', () => {
        const wrapper = shallow(<Input inline_prefix='USD' />);
        expect(wrapper.contains(<span className='symbols symbols--usd' />)).to.be.true;
    });
    it('input\'s autoComplete should depend on is_autocomplete_disabled', () => {
        let wrapper = shallow(<Input />);
        expect(wrapper.find('input').prop('autoComplete')).to.be.undefined;
        wrapper = shallow(<Input is_autocomplete_disabled />);
        expect(wrapper.find('input').prop('autoComplete')).to.equal('off');
        wrapper = shallow(<Input is_autocomplete_disabled={false} />);
        expect(wrapper.find('input').prop('autoComplete')).to.be.undefined;
    });
    it('input\'s checked should depend on checked in props', () => {
        let wrapper = shallow(<Input />);
        expect(wrapper.find('input').prop('checked')).to.be.undefined;
        wrapper = shallow(<Input checked />);
        expect(wrapper.find('input').prop('checked')).to.be.true;
    });
    it('input\'s maxLength should be correct based on maxLength and fractional digits', () => {
        let wrapper = shallow(<Input />);
        expect(wrapper.find('input').prop('maxLength')).to.be.undefined;
        wrapper.setProps({ max_length: 5 });
        expect(wrapper.find('input').prop('maxLength')).to.be.equal(5);
        wrapper.setProps({ fractional_digits: 2 });
        expect(wrapper.find('input').prop('maxLength')).to.be.equal(8);
        wrapper.setProps({ max_length: undefined });
        expect(wrapper.find('input').prop('maxLength')).to.be.undefined;
    });
    it('input\'s type should be correct based on type in props', () => {
        let wrapper = shallow(<Input type='number' />);
        expect(wrapper.find('input').prop('type')).to.be.equal('text');
        wrapper.setProps({ type: 'tel' });
        expect(wrapper.find('input').prop('type')).to.be.equal('tel');
        wrapper.setProps({ type: 'text' });
        expect(wrapper.find('input').prop('type')).to.be.equal('text');
    });
});
