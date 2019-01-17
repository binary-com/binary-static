import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import CloseButton            from '../close_button.jsx';

configure({ adapter: new Adapter() });

describe('CloseButton', () => {
    it('should render one <CloseButton /> component', () => {
        const wrapper = shallow(<CloseButton />);
        expect(wrapper).to.have.length(1);
    });
    it('should have onClick as an instance of function when passed', () => {
        const wrapper = shallow(<CloseButton onClick={() => true} />);
        expect(wrapper.find('Button').prop('onClick')).to.be.an.instanceof(Function);
    });
});
