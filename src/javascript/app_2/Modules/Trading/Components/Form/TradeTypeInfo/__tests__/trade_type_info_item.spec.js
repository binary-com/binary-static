import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import TradeTypeInfoItem      from '../trade_type_info_item.jsx';

configure({ adapter: new Adapter() });

describe('TradeTypeInfoItem', () => {
    const item = { text: 'Higher/Lower' , value: 'high_low' };
    const navigationList = ['high_low', 'rise_fall'];

    it('should render one <TradeTypeInfoItem /> component', () => {
        const wrapper = shallow(<TradeTypeInfoItem item={item} navigationList={navigationList} />);
        expect(wrapper).to.have.length(1);
    });
    it('should have .info-header if is_mobile is false', () => {
        const wrapper = shallow(<TradeTypeInfoItem item={item} navigationList={navigationList} is_mobile={false} />);
        expect(wrapper.find('.info-header').exists()).to.be.true;
    });
    it('should have item\'s text as title if is_mobile is false', () => {
        const wrapper = shallow(<TradeTypeInfoItem item={item} navigationList={navigationList} is_mobile={false} />);
        expect(wrapper.find('.title').text()).to.be.eql('Higher/Lower');
    });
    it('should not have .info-header if is_mobile is true', () => {
        const wrapper = shallow(<TradeTypeInfoItem item={item} navigationList={navigationList} is_mobile={true} />);
        expect(wrapper.find('.info-header').exists()).to.be.false;
    });
    it('should have 2 .circle-button (equal to navigationList\'s length)', () => {
        const wrapper = shallow(<TradeTypeInfoItem item={item} navigationList={navigationList} />);
        expect(wrapper.find('.circle-button')).to.have.length(2);
    });
});