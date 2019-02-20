import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import LanguageDialog         from '../language_dialog.jsx';

configure({ adapter: new Adapter() });

describe('LanguageDialog', () => {
    it('should render one <LanguageDialog /> component', () => {
        const wrapper = shallow(<LanguageDialog />);
        expect(wrapper).to.have.length(1);
    });
    it('should have .show when is_visible is true and is_settings_on is true', () => {
        const wrapper = shallow(<LanguageDialog is_visible={true} is_settings_on={true} />);
        expect(wrapper.find('.show').exists()).to.be.true;
    });
    it('should not have .show when is_visible is true and is_settings_on is false', () => {
        const wrapper = shallow(<LanguageDialog is_visible={true} is_settings_on={false} />);
        expect(wrapper.find('.show').exists()).to.be.false;
    });
    it('should not have .show when is_visible is false and is_settings_on is true', () => {
        const wrapper = shallow(<LanguageDialog is_visible={false} is_settings_on={true} />);
        expect(wrapper.find('.show').exists()).to.be.false;
    });
    it('should not have .show when is_visible is false and is_settings_on is false', () => {
        const wrapper = shallow(<LanguageDialog is_visible={false} is_settings_on={false} />);
        expect(wrapper.find('.show').exists()).to.be.false;
    });
});
