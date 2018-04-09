// spatialdatahub.org-static/src/__tests__/getGeoJSON.test.js
const L = require('leaflet');
import { getGeoJSON } from '../pieces/mapFunctions';

const omnivore = require('@mapbox/leaflet-omnivore');

jest.mock('@mapbox/leaflet-omnivore');



test('should return leaflet geojson layer', async () => {

    const pointGeoJson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "color": "blue"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -4,
                        38
                    ]
                }
            }
        ]
    };
    const resp = L.geoJSON(pointGeoJson);

    const testUrl = 'https://raw.githubusercontent.com/spatialdatahub/GeoJsonData/master/IndioCa.json';
    const result = omnivore.geojson.mockResolvedValue(resp);
    console.log(result);
    //expect(result).toEqual(resp);
});
