import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DatePickerWrapper from '../index';

// TODO: add tests
describe('<DatePickerWrapper />', () => {
    it('should render one <DatePicker /> component', () => {
        const wrapper = shallow(<DatePickerWrapper />);
        expect(wrapper).to.have.length(1);
    });
});