import { expect } from 'chai';
import React      from 'react';
import { isDigitContract, createDigitInfo, getDigitInfo } from '../digits';

describe('digits', () => {
    describe('isDigitContract', () => {
        it('should return true if contract is digits', () => {
            expect(isDigitContract('DIGITMATCH')).to.eql(true);
        });

        it('should return false if contract is not digits', () => {
            expect(isDigitContract('CALLPUT')).to.eql(false);
        });
    });
    // TODO: Add tests for getDigitInfo
});