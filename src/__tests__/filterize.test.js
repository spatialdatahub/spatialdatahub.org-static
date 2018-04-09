// spatialdatahub.org-static/src/__tests__/filterize.test.js
'use strict';

import { getDatasetFilterParams } from '../pieces/filterize.js';


describe('filtereize.js file tests', () => {
    describe('getDatasetFilterParams function', () => {
        test('should return params for single key and value pair', () => {
            // mock window.location.search
            const urlString = '?City=Berlin';
            const expected = [{"key": "City", "value": "Berlin"}];
            expect(getDatasetFilterParams(urlString)).toEqual(expected);
        });

        test('should return params for more than one key and value pair', () => {
            // mock window.location.search
            const urlString = '?City=Berlin&Author=Westphal';
            const expected = [{"key": "City", "value": "Berlin"}, {"key": "Author", "value": "Westphal"}];
            expect(getDatasetFilterParams(urlString)).toEqual(expected);
        });
    });
});
