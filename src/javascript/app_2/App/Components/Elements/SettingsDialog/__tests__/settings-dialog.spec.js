import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import SettingsDialog         from '../settings-dialog.jsx';

configure({ adapter: new Adapter() });

describe('SettingsDialog', () => {
    it('should render one <SettingsDialog /> component', () => {
        const wrapper = shallow(<SettingsDialog />);
        expect(wrapper).to.have.length(1);
    });
    it('should have .settings-dialog__container--show when is_open is true in props', () => {
        const wrapper = shallow(<SettingsDialog is_open={true} />);
        expect(wrapper.hasClass('settings-dialog__container--show')).to.be.true;
    });
    it('should not have .settings-dialog__container--show when is_open is false in props', () => {
        const wrapper = shallow(<SettingsDialog is_open={false} />);
        expect(wrapper.hasClass('settings-dialog__container--show')).to.be.false;
    });
    it('should have .settings-dialog__container--hide when is_language_dialog_visible is true in props', () => {
        const wrapper = shallow(<SettingsDialog is_language_dialog_visible={true} />);
        expect(wrapper.find('.settings-dialog__container--hide').exists()).to.be.true;
    });
    it('should not have .settings-dialog__container--hide when is_language_dialog_visible is false in props', () => {
        const wrapper = shallow(<SettingsDialog is_language_dialog_visible={false} />);
        expect(wrapper.find('.settings-dialog__container--hide').exists()).to.be.false;
    });
});
