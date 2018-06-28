import FinancialAssessmentModel from './sections/financial_assessment_model';

export default class SettingsModel {
    constructor() {
        this.financial_assessment = new FinancialAssessmentModel();
    }
}
