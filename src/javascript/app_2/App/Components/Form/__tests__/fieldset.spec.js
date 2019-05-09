import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Fieldset               from '../fieldset.jsx';
import { testChildren }       from '../../../../test-helper';

configure({ adapter: new Adapter() });

describe('Fieldset', () => {
    it('should render one <Fieldset /> component', () => {
        const wrapper = shallow(<Fieldset />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        testChildren(<Fieldset />);
    });
    it('should have header if header is passed', () => {
        const wrapper = shallow(<Fieldset header='This is header' />);
        const header = <div className='trade-container__fieldset-header'>
            <span className='trade-container__fieldset-info trade-container__fieldset-info--left'>This is header</span>
        </div>;
        expect(wrapper.contains(header)).to.be.true;
    });
    it('should not have elements of header if header is false', () => {
        const wrapper = shallow(<Fieldset />);
        expect(wrapper.find('.trade-container__fieldset-header').exists()).to.be.false;
        expect(wrapper.find('.trade-container__fieldset-info').exists()).to.be.false;
    });
    it('should have .is_center and not have .trade-container__fieldset-info--left if is_center is passed true', () => {
        const wrapper = shallow(<Fieldset header='this is header' is_center={true} />);
        expect(wrapper.find('.center-text').exists()).to.be.true;
        expect(wrapper.find('.trade-container__fieldset-info--left').exists()).to.be.false;
    });
    it('should have .trade-container__fieldset-info--left  and not have .is_center if is_center is false', () => {
        const wrapper = shallow(<Fieldset header='this is header' />);
        expect(wrapper.find('.center-text').exists()).to.be.false;
        expect(wrapper.find('.trade-container__fieldset-info--left').exists()).to.be.true;
    });
});
