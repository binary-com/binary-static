import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import NumberSelector         from '../time_picker.jsx';

configure({ adapter: new Adapter() });

describe('NumberSelector', () => {
    it('should render one <NumberSelector /> component', () => {
        const wrapper = shallow(<NumberSelector />);
        expect(wrapper).to.have.length(1);
    });
    // it('should have input of type time if is_nativepicker is true', () => {
    //     const wrapper = shallow(<TimePicker is_nativepicker={true} />);
    //     expect(wrapper.find('input').prop('type')).to.equal('time');
    // });
});
