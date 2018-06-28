import { observable, action } from 'mobx';
import WS from '../../../../data/ws_methods';

export default class FinancialAssessmentModel {
    @observable is_loading = true;

    @observable data = {
        income_source      : '',
        employment_status  : '',
        employment_industry: '',
        occupation         : '',
        source_of_wealth   : '',
        education_level    : '',
        net_income         : '',
        estimated_worth    : '',
        account_turnover   : '',
    }

    @action.bound
    async getFinancialAssessment() {
        // TODO: handle permission denied (virtual account)
        const { get_financial_assessment } = await WS.getFinancialAssessment();
        if ( get_financial_assessment ) {
            Object.entries(this.data).forEach(
                ([k,v]) =>
                    this.data[k] = get_financial_assessment[k] ?
                    get_financial_assessment[k] :
                    v);
            this.is_loading = false;
        } else {
            // To-Do: Show the error page.
            console.log('You must login to see this page');
        }
    }

    @action.bound
    handleSubmit = (e) => {
        e.preventDefault();
        // WS.setFinancialAsessment(
        //     this.data,
        //     ()=> {
        //         // To-Do: Show Success page.
        //         console.log('successfully self-excluted!');
        //     },
        //     (message) => {
        //         // To-Do: Show the error page.
        //         // To-DO: Validation: timeout_until.
        //         console.log(message);
        //     },
        // );
    }

    @action.bound
    onChange = (e) => {
        const { name, value } = e.target;
        this.data[name] = value;
    }
}
