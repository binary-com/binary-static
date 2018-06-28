import { observable, action } from 'mobx';
import WS from '../../../../data/ws_methods';

export default class SelfExclusionModel {
    @observable is_loading = true;

    @observable data = {
        max_balance           : '',
        max_turnover          : '',
        max_losses            : '',
        max_7day_turnover     : '',
        max_7day_losses       : '',
        max_30day_turnover    : '',
        max_30day_losses      : '',
        max_open_bets         : '',
        session_duration_limit: '',
        timeout_until         : '',
        exclude_until         : '',
    }

    @action.bound
    async getSelfExclusion() {
        const { get_self_exclusion } = await WS.getSelfExclusion();
        if ( get_self_exclusion ) {
            Object.entries(this.data).forEach(
                ([k,v]) =>
                    this.data[k] = get_self_exclusion[k] ?
                    get_self_exclusion[k] :
                    v);
            this.is_loading = false;
        } else {
            // To-Do: Show the error page.
            console.log('You must login to see this page');
        }
    }

    @action.bound
    handleSubmit = async (e) => {
        e.preventDefault();
        const data = this.data;
        data.set_self_exclusion = 1;
        const response = await WS.setSelfExclusion(data);
        if (!response.error) {
            // To-Do: Show Success Submission Msg
            console.log('Self Exclusion Success');
        } else {
            // To-Do: Show Error Msg
            console.log(response.error.message);
        }
    }

    @action.bound
    onChange = (e) => {
        const { name, value } = e.target;
        this.data[name] = value;
    }
}
