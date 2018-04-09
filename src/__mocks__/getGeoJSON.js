// spatialdatahub.org-static/src/__mocks__/getGeoJSON.js

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


const getGeoJSON = url => {
    return new Promise((resolve, reject) => {
        // when this promise resolves it should return a leaflet omnivore dataLayer
        
    });
};


export default getGeoJSON;
