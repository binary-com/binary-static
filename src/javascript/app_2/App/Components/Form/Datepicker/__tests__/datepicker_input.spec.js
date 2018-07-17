import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DatePickerInput from '../datepicker_input.jsx';

// TODO: add tests
describe('<DatePickerInput />', () => {
    it('should render one <DatePickerInput /> component', () => {
        const wrapper = shallow(<DatePickerInput />);
        expect(wrapper).to.have.length(1);
    });
});