import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { ButtonLink } from "../index";
import { Link }       from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('<ButtonLink />', () => {
    it('should render one <ButtonLink /> component', () => {
        const wrapper = shallow(<ButtonLink />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(
            <ButtonLink>
                { child_div }
            </ButtonLink>
        );
        expect(wrapper.contains(child_div)).to.equal(true);
    });
    it('should render one <Link />', () => {
        const wrapper = shallow(
            <ButtonLink />
        );
        expect(wrapper.find(Link)).to.have.lengthOf(1);
    });
    it('should render component with className if any given', () => {
        const wrapper = shallow(
            <ButtonLink className='a-cool-classname' />
        );
        expect(wrapper.find('.a-cool-classname').exists());
    });
});