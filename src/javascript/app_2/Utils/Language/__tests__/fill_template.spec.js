import { expect }   from 'chai';
import fillTemplate from '../fill_template';

describe('fillTemplate', () => {
    it('works for string without tags', () => {
        expect(fillTemplate('hello world')).to.eql(['hello world']);
    });
});
