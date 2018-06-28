import { observable, action, computed } from 'mobx';
import WS from '../../../../data/ws_methods';

export default class PersonalDetailsModel {
    @observable is_loading = true;
    // Note: Details Can't be changed in client side.
    @observable details_data = {
        account_opening_reason: '',
        date_of_birth         : 697420800,
        email                 : '',
        first_name            : '',
        last_name             : '',
        place_of_birth        : '',
        salutation            : '',
        full_name             : '',
    }
    @observable tax_data = {
        tax_identification_number: {},
        tax_residence            : {},
    }
    @observable address_data = {
        address_city    : '',
        address_line_1  : '',
        address_line_2  : '',
        address_postcode: '',
        address_state   : '',
        country         : '',
        country_code    : '',
        phone           : '',
    }
    @observable email_consent = 0;

    @computed get fullName() {
        const { salutation, first_name, last_name } = this.details_data;
        return `${ salutation } ${ first_name } ${ last_name }`;
    }

    // To-Do: Optimize this algorithm
    @action.bound
    async getPersonalDetails() {
        const { get_settings } = await WS.getSettings();
        if ( get_settings ) {
            Object.entries(this.details_data).forEach(
                ([k,v]) => {
                    this.details_data[k] = get_settings[k] ? get_settings[k] : v;
                }
            );
            Object.entries(this.tax_data).forEach(
                ([k,v]) => {
                    this.tax_data[k] = get_settings[k] ? get_settings[k] : v;
                }
            );
            Object.entries(this.address_data).forEach(
                ([k,v]) => {
                    this.address_data[k] = get_settings[k] ? get_settings[k] : v;
                }
            );
            this.is_loading = false;
        } else {
            // To-Do: Show the error page.
            console.log('You must login to see this page');
        }
    }

    @action.bound
    onAddressDataChange = (e) => {
        const { name, value } = e.target;
        this.address_data[name] = value;
    }
    @action.bound
    onChange = (e) => {
        const { name, value } = e.target;
        this.data[name] = value;
    }
    @action.bound
    onTaxDataChange = (e) => {
        const { name, value } = e.target;
        this.tax_data[name] = value;
    }
}
