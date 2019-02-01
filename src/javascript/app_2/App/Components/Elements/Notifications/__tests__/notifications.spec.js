import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { Notifications }      from '../notifications.jsx';

configure({ adapter: new Adapter() });

describe('Notifications', () => {
    it('should render one <Notifications /> component', () => {
        const wrapper = shallow(<Notifications />);
        expect(wrapper).to.have.length(1);
    });
    it('should ', () => {
        const wrapper = shallow(<Notifications />);
        expect(wrapper.find('.no-notifications-container').exists()).to.be.true;
    });
});
