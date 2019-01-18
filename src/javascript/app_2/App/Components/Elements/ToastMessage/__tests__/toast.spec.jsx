import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Toast                  from '../Toast.jsx';

configure({ adapter: new Adapter() });

describe('Toast', () => {
    it('should render one <Toast /> component', () => {
        const wrapper = shallow(<Toast />);
        expect(wrapper).to.have.length(1);
    });
    it('should have onClick as an instance of function when passed', () => {
        const wrapper = shallow(<Toast onClick={() => true} />);
        expect(wrapper.find('.toast__body').prop('onClick')).to.be.an.instanceof(Function);
    });
});
