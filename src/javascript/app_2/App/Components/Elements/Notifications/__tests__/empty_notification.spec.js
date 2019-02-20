import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { EmptyNotification }  from '../empty_notification';
import { IconBell } from 'Assets/Header/NavBar';

configure({ adapter: new Adapter() });

describe('Notifications', () => {
    it('should render one <EmptyNotification /> component', () => {
        const wrapper = shallow(<EmptyNotification />);
        expect(wrapper).to.have.length(1);
    });
    it('should render IconBell', () => {
        const wrapper = shallow(<EmptyNotification />);
        expect(wrapper.find(IconBell).exists()).to.be.true;
    });
});
