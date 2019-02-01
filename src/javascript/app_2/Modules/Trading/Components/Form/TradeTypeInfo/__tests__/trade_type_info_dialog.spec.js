import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import TradeTypeInfoDialog    from '../trade_type_info_dialog.jsx';

configure({ adapter: new Adapter() });

describe('TradeTypeInfoDialog', () => {
    it('should render one <TradeTypeInfoDialog /> component', () => {
        const wrapper = shallow(<TradeTypeInfoDialog />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(
            <TradeTypeInfoDialog>
                { child_div }
            </TradeTypeInfoDialog>
        );
        expect(wrapper.contains(child_div)).to.equal(true);
    });
    it('should have prop wrapperClassName equal to trade-type-info-modal if is_mobile is true', () => {
        const wrapper = shallow(<TradeTypeInfoDialog is_mobile={true} />);
        expect(wrapper.prop('wrapperClassName')).to.be.eql('trade-type-info-modal');
    });
    it('should not have prop wrapperClassName if is_mobile is false', () => {
        const wrapper = shallow(<TradeTypeInfoDialog is_mobile={false} />);
        expect(wrapper.prop('wrapperClassName')).to.be.undefined;
    });
    it('should have .trade-type-info-popup if is_mobile is false', () => {
        const wrapper = shallow(<TradeTypeInfoDialog is_mobile={false} />);
        expect(wrapper.find('.trade-type-info-popup').exists()).to.be.true;
    });
    it('should not have .trade-type-info-popup if is_mobile is true', () => {
        const wrapper = shallow(<TradeTypeInfoDialog is_mobile={true} />);
        expect(wrapper.find('.trade-type-info-popup').exists()).to.be.false;
    });
});