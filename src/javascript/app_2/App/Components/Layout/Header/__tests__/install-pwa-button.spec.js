import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { InstallPWAButton }   from '../install-pwa-button.jsx';
import Button                 from '../../../Form/button';

configure({ adapter: new Adapter() });

describe('InstallPWAButton', () => {
    it('should render one <InstallPWAButton /> component', () => {
        const wrapper = shallow(<InstallPWAButton />);
        expect(wrapper).to.have.length(1);
    });
    it('should have onClick as an instance of Function', () => {
        const wrapper = shallow(<InstallPWAButton />);
        expect(wrapper.find(Button).prop('onClick')).to.be.an.instanceof(Function);
    });
});
