import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Checkbox               from '../checkbox.jsx';

configure({ adapter: new Adapter() });

describe('Checkbox', () => {
    it('should render one <Checkbox /> component', () => {
        const wrapper = shallow(<Checkbox />);
        expect(wrapper).to.have.length(1);
    });
    it('should have label as passed in props', () => {
        const wrapper = shallow(<Checkbox label='This is a label' />);
        expect(wrapper.contains(<div className='checkbox__label'>This is a label</div>)).to.be.true;
    });
    it('should have class toggling with value', () => {
        let wrapper = shallow(<Checkbox value={true} />);
        expect(wrapper.find('.checkbox__box--active').exists()).to.be.true;
        wrapper = shallow(<Checkbox value={false} />);
        expect(wrapper.find('.checkbox__box--active').exists()).to.be.false;
    });
});
