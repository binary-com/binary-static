import React from 'react';
import { expect }   from 'chai';
import * as Helpers from '../helpers';
import getRoutesConfig from '../../../Constants/routes_config';
import Trade from '../../../../Modules/Trading';

describe('Helpers', () => {
    describe('normalizePath', () => {
        it('should return / as if path is empty', () => {
            expect(Helpers.normalizePath('')).to.eql('/');
        });
        it('should return / + path as if path does not have /', () => {
            expect(Helpers.normalizePath('trade')).to.eql('/trade');
        });
        it('should return / + path as if path does have /', () => {
            expect(Helpers.normalizePath('/trade')).to.eql('/trade');
        });
    });

    describe('findRouteByPath', () => {
        it('should return undefined when path is not in routes_config', () => {
            expect(Helpers.findRouteByPath('invalidRoute', getRoutesConfig())).to.eql(undefined);
        });
        it('should return route_info when path is in routes_config and is not nested', () => {
            expect(Helpers.findRouteByPath('/trade', getRoutesConfig())).to.eql({
                path: '/trade',
                component: Trade,
                title: 'Trade',
                exact: true
            });
        });
        it('should return route_info when path is in routes_config and is nested', () => {
            expect(Helpers.findRouteByPath('/settings/personal', getRoutesConfig())).to.have.all.keys('path', 'component', 'is_authenticated', 'routes');
        });
        // it('should return route_info when path is in routes_config and is nested', () => {
        //     expect(Helpers.findRouteByPath('/settings/personal', getRoutesConfig())).to.include({
        //             path: '/settings',
        //             component: Settings,
        //             is_authenticated: true,
        //             routes: [
        //                 { path: '/settings/personal',         component: PersonalDetails,        title: 'Personal Details' },
        //                 { path: '/settings/financial',        component: FinancialAssessment,    title: 'Financial Assessment' },
        //                 { path: '/settings/account_password', component: AccountPassword,        title: 'Account Password' },
        //                 { path: '/settings/cashier_password', component: CashierPassword,        title: 'Cashier Password' },
        //                 { path: '/settings/exclusion',        component: SelfExclusion,          title: 'Self Exclusion' },
        //                 { path: '/settings/limits',           component: Limits,                 title: 'Account Limits' },
        //                 { path: '/settings/history',          component: LoginHistory,           title: 'Login History' },
        //                 { path: '/settings/token',            component: ApiToken,               title: 'API Token' },
        //                 { path: '/settings/apps',             component: AuthorizedApplications, title: 'Authorized Applications' },
        //             ],
        //         });
        // });
    });

    describe('isRouteVisible', () => {
        it('should return true if route needs user to be authenticated and user is logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: true }, true)).to.eql(true);
        });
        it('should return false if route needs user to be authenticated and user is not logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: true }, false)).to.eql(false);
        });
        it('should return true if route does not need user to be authenticated and user is not logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: false }, false)).to.eql(true);
        });
        it('should return true if route does not need user to be authenticated and user is logged in', () => {
            expect(Helpers.isRouteVisible({ path: '/contract', is_authenticated: false }, true)).to.eql(true);
        });
    });

    describe('getPath', () => {
        it('should return param values in params as a part of path', () => {
            expect(Helpers.getPath('/contract/:contract_id', { contract_id: '37511105068' })).to.equal('/contract/37511105068');
            expect(Helpers.getPath('/something_made_up/:something_made_up_param1/:something_made_up_param2', { something_made_up_param1: '789', something_made_up_param2: '123456' })).to.equal('/something_made_up/789/123456');
        });
        it('should return path as before if there is no params', () => {
            expect(Helpers.getPath('/contract')).to.equal('/contract');
        });
    });

    describe('getContractPath', () => {
        it('should return the path of contract with contract_id passed', () => {
            expect(Helpers.getContractPath('1234')).to.equal('/contract/1234');
        });
    });
});
