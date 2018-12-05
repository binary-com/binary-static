import { expect }         from 'chai';
import React              from 'react';
import { getChartConfig } from '../logic';

describe('logic', () => {
    describe('getChartConfig', () => {
        it('should work as expected with values leading to granularity 0', () => {
            const contract_info = {
                "date_expiry":1544000100,
                "date_start":1544000000,
            };
            expect(getChartConfig(contract_info)).to.eql({
                granularity: 0,
                chart_type: 'mountain',
                end_epoch: 1544000103,
                start_epoch: 1543999997,
            });
        });
        it('should work as expected with values leading to granularity 120', () => {
            const contract_info = {
                "date_expiry":1544005000,
                "date_start":1544000000,
            };
            expect(getChartConfig(contract_info)).to.eql({
                granularity: 120,
                chart_type: 'candle',
                end_epoch: 1544005120,
                start_epoch: 1543999880,
            });
        });
        it('should work as expected with values leading to granularity 600', () => {
            const contract_info = {
                "date_expiry":1544010000,
                "date_start":1544000000,
            };
            expect(getChartConfig(contract_info)).to.eql({
                granularity: 600,
                chart_type: 'candle',
                end_epoch: 1544010600,
                start_epoch: 1543999400,
            });
        });
        it('should work as expected with values leading to granularity 900', () => {
            const contract_info = {
                "date_expiry":1544025000,
                "date_start":1544000000,
            };
            expect(getChartConfig(contract_info)).to.eql({
                granularity: 900,
                chart_type: 'candle',
                end_epoch: 1544025900,
                start_epoch: 1543999100,
            });
        });
        it('should work as expected with values leading to granularity 14400', () => {
            const contract_info = {
                "date_expiry":1546000000,
                "date_start":1544000000,
            };
            expect(getChartConfig(contract_info)).to.eql({
                granularity: 14400,
                chart_type: 'candle',
                end_epoch: 1546014400,
                start_epoch: 1543985600,
            });
        });
    });
});