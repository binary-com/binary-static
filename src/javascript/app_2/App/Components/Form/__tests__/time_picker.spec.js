import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import TimePicker             from '../time_picker.jsx';

configure({ adapter: new Adapter() });

describe('TimePicker', () => {
    it('should render one <TimePicker /> component', () => {
        const wrapper = shallow(<TimePicker />);
        expect(wrapper).to.have.length(1);
    });
    it('should have input of type time if is_nativepicker is true', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={true} />);
        expect(wrapper.find('input').prop('type')).to.equal('time');
    });
    it('should have input of type text if is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} />);
        expect(wrapper.find('input').prop('type')).to.equal('text');
    });
    it('should have id of time-picker-input', () => {
        const wrapper = shallow(<TimePicker />);
        expect(wrapper.find('#time-picker-input').exists()).to.be.true;
    });
    it('should have input with class .time-picker-input if is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} />);
        expect(wrapper.find('.time-picker-input').exists()).to.be.true;
    });
    it('should not have input with class .time-picker-input if is_nativepicker is true', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={true} />);
        expect(wrapper.find('.time-picker-input').exists()).to.be.false;
    });
    it('should have TimePickerDropdown if is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} />);
        expect(wrapper.find('TimePickerDropdown').exists()).to.be.true;
    });
    it('should have TimePickerDropdown with preClass prop equal to .time-picker if is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} />);
        expect(wrapper.find('TimePickerDropdown').prop('preClass')).to.equal('time-picker');
    });
    it('should have input with value passed as props if is_nativepicker is true', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={true} value='2019' />);
        expect(wrapper.find('input').prop('value')).to.equal('2019');
    });
    it('should have input and TimePickerDropdown with value passed as props if is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} value='2019' />);
        expect(wrapper.find('input').prop('value')).to.equal('2019');
        expect(wrapper.find('TimePickerDropdown').prop('value')).to.equal('2019');
    });
    it('should have input with name passed as props if is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} name='birthdate' />);
        expect(wrapper.find('input').prop('name')).to.equal('birthdate');
    });
    it('should have input with name passed as props if is_nativepicker is true', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} name='birthdate' />);
        expect(wrapper.find('input').prop('name')).to.equal('birthdate');
    });
    it('should have class .from-right if is_align_right is true and is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} is_align_right={true} />);
        expect(wrapper.find('.from-right').exists()).to.be.true;
    });
    it('should not have class .form-right if is_align_right is false and is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={false} is_align_right={false} />);
        expect(wrapper.find('.form-right').exists()).to.be.false;
    });
    it('should not have class .form-right if is_align_right is true and is_nativepicker is true', () => {
        const wrapper = shallow(<TimePicker is_nativepicker={true} is_align_right={true} />);
        expect(wrapper.find('.form-right').exists()).to.be.false;
    });
    it('should have TimePickerDropdown with start_date passed as prop when is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker start_date='1991' />);
        expect(wrapper.find('TimePickerDropdown').prop('start_date')).to.equal('1991');
    });
    it('should have input with placeholder passed as props when is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker placeholder='this is placeholder' />);
        expect(wrapper.find('input').prop('placeholder')).to.equal('this is placeholder');
    });
    it('should have TimePickerDropdown with placeholder passed as props when is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker sessions={['1', '2']} />);
        expect(wrapper.find('TimePickerDropdown').prop('sessions')).to.eql(['1', '2']);
    });
    it('should have TimePickerDropdown with is_clearable as passed in props when is_nativepicker is false', () => {
        const wrapper = shallow(<TimePicker is_clearable={true} />);
        expect(wrapper.find('TimePickerDropdown').prop('is_clearable')).to.be.true;
    });
    it('should have class .padding if padding is true in props', () => {
        const wrapper = shallow(<TimePicker padding={true} />);
        expect(wrapper.find('.padding').exists()).to.be.true;
    });
    // it('should ', () => {
    //     const wrapper = shallow(<TimePicker />);
    //     wrapper.find('TimePickerDropdown').simulate('toggle');
    //     expect(wrapper.state('is_open')).to.be.true;
    // });
});
