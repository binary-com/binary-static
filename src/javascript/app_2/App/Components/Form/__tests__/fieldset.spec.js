import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Fieldset               from '../fieldset.jsx';
import Tooltip                from '../../Elements/tooltip.jsx';

configure({ adapter: new Adapter() });

describe('Fieldset', () => {
    it('should render one <Fieldset /> component', () => {
        const wrapper = shallow(<Fieldset />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(
            <Fieldset>
                { child_div }
            </Fieldset>
        );
        expect(wrapper.contains(child_div)).to.equal(true);
    });
    it('should have className passed as icon prop and header is true', () => {
        const wrapper = shallow(<Fieldset icon='ic_smile' header={true} />);
        expect(wrapper.find('.ic_smile').exists()).to.equal(true);
    });
    it('should not have className passed as icon prop and header is false', () => {
        const wrapper = shallow(<Fieldset icon='ic_smile' />);
        expect(wrapper.find('.ic_smile').exists()).to.equal(false);
    });
    it('should have a div with header if header is true', () => {
        const wrapper = shallow(<Fieldset header='this is header' />);
        expect(wrapper.contains(<div className='fieldset-header'>
            <span className='field-info left'>this is header</span>
        </div>)).to.equal(true);
    });
    it('should have Tooltip if tooltip is true', () => {
        const wrapper = shallow(<Fieldset tooltip='this is tooltip' />);
        expect(wrapper.contains(<span className='field-info right'>
            <Tooltip
                alignment='left'
                icon='info'
                message='this is tooltip'
            /></span>)).to.equal(true);
    });
});
