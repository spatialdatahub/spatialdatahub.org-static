// mock omnivore.geojson here

// make the mock data that will be returned
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
const geojsonlayer = L.geoJSON(pointGeoJson);

export default geojson = url => {
    return new Promise((resolve, reject) => {
        process.nextTick(() => resolve(geojsonlayer));
    });
};
