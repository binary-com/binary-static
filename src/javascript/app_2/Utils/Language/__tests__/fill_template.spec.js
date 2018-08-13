import { expect }   from 'chai';
import fillTemplate from '../fill_template';

describe('fillTemplate', () => {
    it('works for string without tags', () => {
        expect(fillTemplate('hello world')).to.eql(['hello world']);
    });
    it('works for template with one tag replaced with string', () => {
        expect(fillTemplate('there is no [_1]', { '1': 'spoon' })).to.eql(['there is no ', 'spoon']);
        expect(fillTemplate('[_1] is no spoon', { '1': 'there' })).to.eql(['there', ' is no spoon']);
        expect(fillTemplate('there is [_1] spoon', { '1': 'no' })).to.eql(['there is ', 'no', ' spoon']);
    });
});
