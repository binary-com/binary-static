import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Transition             from '../transition.jsx';

configure({ adapter: new Adapter() });

describe('Transition', () => {
    it('should render one <Transition /> component', () => {
        const wrapper = shallow(<Transition />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(
            <Transition>
                { child_div }
            </Transition>
        );
        expect(wrapper.contains(child_div)).to.be.true;
    });
});
