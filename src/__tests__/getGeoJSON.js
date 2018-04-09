// spatialdatahub.org-static/src/__tests__/getGeoJSON.test.js

jest.mock('@mapbox/leaflet-omnivore');

import { getGeoJSON } from '../pieces/mapFunctions';

// these should be imported from a separate file. maybe from the mocks section?


describe('getGeoJSON function', () => {
    test('should return promise with dataLayer', () => {
        const testUrl = 'https://raw.githubusercontent.com/spatialdatahub/GeoJsonData/master/IndioCa.json';
        expect(getGeoJSON(testUrl)).toEqual({});
    });
});
