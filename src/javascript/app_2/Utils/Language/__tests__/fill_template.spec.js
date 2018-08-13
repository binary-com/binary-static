import { expect }   from 'chai';
import React        from 'react';
import fillTemplate from '../fill_template';

describe('fillTemplate', () => {
    it('works for string without tags', () => {
        expect(fillTemplate('hello world')).to.eql(['hello world']);
    });
    it('works for 1 tag at the start replaced with string', () => {
        expect(fillTemplate('[_1] is no spoon', { '1': 'there' })).to.eql(['there is no spoon']);
    });
    it('works for 1 tag at the start replaced with component', () => {
        const span = <span className='amazing-text'>There</span>
        expect(fillTemplate('[_1] is no spoon', { '1': span })).to.eql([span, ' is no spoon']);
    });
    it('works for 1 tag in the middle replaced with string', () => {
        expect(fillTemplate('there is [_1] spoon', { '1': 'no' })).to.eql(['there is no spoon']);
    });
    it('works for 1 tag in the middle replaced with component', () => {
        const a = <a href='javascript:;'>no</a>;
        expect(fillTemplate('there is [_1] spoon', { '1': a })).to.eql(['there is ', a, ' spoon']);
    });
    it('works for 1 tag at the end replaced with string', () => {
        expect(fillTemplate('there is no [_1]', { '1': 'spoon' })).to.eql(['there is no spoon']);
    });
    it('works for 1 tag at the end replaced with component', () => {
        const div = <div className='test' />;
        expect(fillTemplate('there is no [_1]', { '1': div })).to.eql(['there is no ', div]);
    });
    it('works for 2 tags replaced with strings', () => {
        expect(fillTemplate('[_1] think therefore [_1] am', { '1': 'I' })).to.eql(['I think therefore I am']);
    });
});
