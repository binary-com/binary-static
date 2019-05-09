import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import NumberSelector         from '../number-selector.jsx';

configure({ adapter: new Adapter() });

describe('NumberSelector', () => {
    it('should render one <NumberSelector /> component', () => {
        const wrapper = shallow(<NumberSelector arr_arr_numbers={[[1,2],[3,4]]} />);
        expect(wrapper).to.have.length(1);
    });
    it('should have .selected where the data-value is equal to selected_number', () => {
        const wrapper = shallow(<NumberSelector selected_number={2} arr_arr_numbers={[[1,2],[3,4]]} />);
        expect(wrapper.findWhere(n => n.prop('data-value') === 2).hasClass('number-selector__selection--selected')).to.be.true;
    });
});
