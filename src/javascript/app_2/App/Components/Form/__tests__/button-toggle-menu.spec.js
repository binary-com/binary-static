import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import ButtonToggleMenu       from '../button-toggle-menu.jsx';
import Button                 from '../button.jsx';

configure({ adapter: new Adapter() });

describe('ButtonToggleMenu', () => {
    // it('should render one <ButtonToggleMenu /> component', () => {
    //     const wrapper = shallow(<ButtonToggleMenu />);
    //     expect(wrapper).to.have.length(1);
    // });
    it('should render all buttons passed in buttons_arr', () => {
        const buttons_arr = [{ text: 'first' }, { text: 'second' }];
        const wrapper = shallow(<ButtonToggleMenu buttons_arr={buttons_arr} />);
        expect(wrapper.find(Button)).to.have.length(2);
    });
    // it('should render all buttons passed in buttons_arr', () => {
    //     const buttons_arr = [{ text: 'first' }, { text: 'second' }];
    //     const wrapper = shallow(<ButtonToggleMenu buttons_arr={buttons_arr} value={{ text: 'second' }} />);
    //     expect()
    // });
});
