import React      from 'react';
import { expect } from 'chai';
import { 
    configure, 
    shallow }     from 'enzyme';
import Adapter    from 'enzyme-adapter-react-16'; // TODO: move this to a test config file
import Calendar   from '../index';

configure({ adapter: new Adapter() }); // TODO: move this to a test config file

// TODO: add tests
describe('<Calendar />', () => {
    it('should render one <Calendar /> component', () => {
        const wrapper = shallow(<Calendar />);
        expect(wrapper).to.have.length(1);
    });

    it('should render children when passed in', () => {
        const wrapper = shallow(
            <Calendar>
                <div className='sweet-child-of-mine' />
            </Calendar>
        );
        expect(wrapper.contains(<div className='sweet-child-of-mine' />)).to.equal(true);
    });
});