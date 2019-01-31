import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import ErrorBox               from '../error_box.jsx';


configure({ adapter: new Adapter() });

describe('ErrorBox', () => {
    it('should render one <ErrorBox /> component', () => {
        const wrapper = shallow(<ErrorBox />);
        expect(wrapper).to.have.length(1);
    });
    it('should render header as passed to it', () => {
        const wrapper = shallow(<ErrorBox header='This is a header' />);
        expect(wrapper.find('.page-error-header').text()).to.be.eql('This is a header');
    });
});
