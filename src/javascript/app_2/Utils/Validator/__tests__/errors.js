import { expect } from 'chai';
import Errors from '../errors';

describe('Errors', () => {
    const error = new Errors();

    describe('.add', () => {

        error.add('Error', 'This is a test!');
        expect(error.errors).to.eql({
            'Error': [
                'This is a test!',
            ],
        });

        error.add('Error', 'This is a second test!');
        expect(error.errors).to.eql({
            'Error': [
                'This is a test!',
                'This is a second test!',
            ],
        });
    });

    describe('.all', () => {
        expect(error.errors).to.eql({
            'Error': [
                'This is a test!',
                'This is a second test!',
            ],
        })
    });

    describe('.first', () => {
        expect(error.first('Error')).to.eql('This is a test!');
    });

    describe('.get', () => {
        expect(error.get('Error')).to.eql([
            'This is a test!',
            'This is a second test!',
        ])
    });

    describe('.has', () => {
        expect(error.has('Error')).to.eql(true);
        expect(error.has('Not Exist')).to.eql(false);
    });
});
