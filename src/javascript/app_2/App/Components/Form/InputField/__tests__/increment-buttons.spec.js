import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import IncrementButtons       from '../increment-buttons.jsx';

configure({ adapter: new Adapter() });

describe('IncrementButtons', () => {
    it('should render one <IncrementButtons /> component', () => {
        const wrapper = shallow(<IncrementButtons />);
        expect(wrapper).to.have.length(1);
    });
    it('increment button\'s is_disabled should depend on max_is_disabled in props', () => {
        let wrapper = shallow(<IncrementButtons />);
        expect(wrapper.find('.input-wrapper__button--increment').prop('is_disabled')).to.be.undefined;
        wrapper.setProps({max_is_disabled: true});
        expect(wrapper.find('.input-wrapper__button--increment').prop('is_disabled')).to.be.true;
        wrapper.setProps({max_is_disabled: false});
        expect(wrapper.find('.input-wrapper__button--increment').prop('is_disabled')).to.be.false;
    });
    it('decrement button\'s is_disabled should depend on max_is_disabled in props', () => {
        let wrapper = shallow(<IncrementButtons />);
        expect(wrapper.find('.input-wrapper__button--decrement').prop('is_disabled')).to.be.undefined;
        wrapper.setProps({min_is_disabled: true});
        expect(wrapper.find('.input-wrapper__button--decrement').prop('is_disabled')).to.be.true;
        wrapper.setProps({min_is_disabled: false});
        expect(wrapper.find('.input-wrapper__button--decrement').prop('is_disabled')).to.be.false;
    });
});
