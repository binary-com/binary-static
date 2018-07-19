import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DatePickerInput from '../date_picker_input.jsx';

// TODO: add tests
describe('<DatePickerInput />', () => {
    it('should render one <DatePickerInput /> component', () => {
        const wrapper = shallow(<DatePickerInput />);
        expect(wrapper).to.have.length(1);
    });
});