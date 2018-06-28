import LoginHistoryModel from './sections/login_history_model';
import SelfExclusionModel from './sections/self_exclusion_model';
import FinancialAssessmentModel from './sections/financial_assessment_model';
import CashierPasswordModel from './sections/cashier_password_model';
import AccountPasswordModel from './sections/account_password_model';
import ApiTokenModel from './sections/api_token_model';
import PersonalDetails from './sections/personal_detail_model';

export default class SettingsModel {
    constructor() {
        this.personal_details = new PersonalDetails();
        this.login_history = new LoginHistoryModel();
        this.self_exclusion = new SelfExclusionModel();
        this.financial_assessment = new FinancialAssessmentModel();
        this.cashier_password = new CashierPasswordModel();
        this.account_password = new AccountPasswordModel();
        this.api_token = new ApiTokenModel();
    }
}
