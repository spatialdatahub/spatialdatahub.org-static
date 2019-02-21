// spatialdatahub.org-static/src/bundle.js

console.log('spatialdatahub.org-static');

const L = require('leaflet');
// this needs to be fixed so that it is not en.en
const en = require('easy-nominatim').en;

const within = require('@turf/within');

import { feature, featureCollection } from '@turf/helpers';
//import { getPlaceData, nominatim, normalizeGeoJSON, possiblePlaces } from 'easy-nominatim';

const markercluster = require('leaflet.markercluster');
const filesaver = require('file-saver');

const basic = require('./pieces/basic.js'); // tested
const mapFunctions = require('./pieces/mapFunctions.js');
import { addPopups } from './pieces/mapFunctions.js';
//const datasetList = require('./pieces/datasetList.js')
const editMap = require('./pieces/editMap.js');

const filterize = require('./pieces/filterize.js');

import { getDatasetFilterParams } from './pieces/embed-filter.js';


// Things I need to fix
// - filesaver doesn't save data from all sources, only the test urls
// - csv files (and possibly other non-geojson files) do not load on dataset detail page -- FIXED
// - the load data to page or get data function is loading clusters into the wrong containers -- FIXED
// - the toggle test datasets button is not toggling the datasets on and off -- FIXED

// Maybe I should just do all the function calling here, and all the function
// defining in the other files

// ////////////////////////// //
// initMap.js //
// ////////////////////////// //
// ////////////////////////////////////////////////////////////////////////////
/*
// CUSTOM MAP FUNCTIONS
*/
/*
// As I get better at programming I will try and put more functions in here
// but for right now I'm going to keep most of the javascript in the page
// specific javascript files.
*/
// ////////////////////////////////////////////////////////////////////////////

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">
  OpenStreetMap</a>`,
    minZoom: 1,
    maxZoom: 19
});

const stamenToner = L.tileLayer(`https://stamen-tiles-{s}.a.ssl.fastly.net/
toner/{z}/{x}/{y}.{ext}`, {
    attribution: `Map tiles by <a href="https://stamen.com">Stamen Design</a>,
  <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>
  &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 19,
    ext: 'png'
});

const esriWorldImagery = L.tileLayer(`https://server.arcgisonline.com/ArcGIS/
rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`, {
    attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA,
  USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,
  and the GIS User Community`
});

const myMap = L.map('mapid', {
    center: {lat: 0, lng: 8.8460},
    zoom: 1,
    layers: osm,
    scrollWheelZoom: false
});

const baseLayers = {
    'Open Street Maps': osm,
    'Black and White': stamenToner,
    'ESRI World Map': esriWorldImagery
};

const baseLayerControl = L.control.layers(baseLayers);

baseLayerControl.addTo(myMap);

// watermark leaflet control
L.control.watermark = options => new L.Control.Watermark(options);
L.control.watermark({position: 'bottomleft'}).addTo(myMap);

// home button leaflet control
L.control.homebutton = options => new L.Control.HomeButton(options);
L.control.homebutton({position: 'topleft'}).addTo(myMap);

// toggle scroll button leaflet control
L.control.togglescrollbutton = options => new L.Control.ToggleScrollButton(options);
L.control.togglescrollbutton({position: 'topleft'}).addTo(myMap);

// Trying to add 'alt' to tile layers
osm.on('tileload', function (tileEvent) {
    tileEvent.tile.setAttribute('alt', 'Open Street Map Tile Layer');
});

stamenToner.on('tileload', function (tileEvent) {
    tileEvent.tile.setAttribute('alt', 'Stamen Toner black and white tile layers');
});

esriWorldImagery.on('tileload', function (tileEvent) {
    tileEvent.tile.setAttribute('alt', 'ESRI World Imagery Tile');
});

/*
  Example of image overlay, going to use this type of stuff to add lines at tropics and
  sub tropics

  var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg'
  var imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];

  L.imageOverlay(imageUrl, imageBounds).addTo(myMap);
*/

// ////////////// //
// datasetList.js //
// ////////////// //
// The functions for stuff has been put into the mapFunctions file
// into something else
// I have an idea, I will just make the dataset specific page work like a
// dataset list page

// Maybe the functions should be put into a different file, and everything else
// can just stay here


// dataset filter parameter
// this only happens once per page so it can be a const
const datasetFilterParameters = getDatasetFilterParams();
//console.log(datasetFilterParameters);

// colors
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
let linkDatasetColorCounter = 0; // this is for the datasets from the links

// pointMarkerOptions
const markerOptions = {
    radius: 6,
    color: 'black',
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.4
};

const datasetLinksNodeList = document.getElementsByName('dataset');
const datasetLinks = Array.prototype.slice.call(datasetLinksNodeList);
const datasets = {};
const datasetClusters = {};
const activeDatasetButtons = [];

// The initial value will start the page with either layers or clusters.
let layerClusterState = 0; // 0 is layers, 1 is clusters. // something is wrong

//datasetLinks.forEach(l => mapFunctions.handleDatasetLink(l))

// const handleResponseCluster = function () {}

datasetLinks.forEach(function handleDatasetLink (link) {
    const pk = link.id;
    const ext = link.getAttribute('value'); // I have to use this because 'value' is a loaded arguement
    const url = mapFunctions.returnCorrectUrl(link, pk);

    // deal with colors
    // this can be lifted... does it need to be?
    linkDatasetColorCounter++;
    const color = colors[linkDatasetColorCounter % colors.length];
    // a new layer needs to be created for every link
    const layerMod = mapFunctions.returnLayer(color, markerOptions, datasetFilterParameters);
    // a new cluster layer needs to be created for every link
    const layerCluster = mapFunctions.returnCluster(color);

    // I don't like this
    // It's just not working
    // what are the functions I would need to define to break this up?

    // addDataToContainer // I've already made and deleted this one
    // return original data after callback
    // return modified data after callback

    // this is my handle promise stuff
    /*
      const extSelectAndThenLayer = function (map, ext, url) {
      mapFunctions.extSelect(ext, url)
      .then(res => layerMod.addData(res.toGeoJSON()))
      .then(lm => datasets[pk] = lm)
      .then(lm => {
      map.addLayer(lm).fitBounds(layerMod.getBounds())
      return lm
      })
      .then(lm => layerCluster.addLayer(lm))
      .then(lc => datasetClusters[pk] = lc)
      .catch(error => console.log(error))
      }
    */

    // how do I lift this?
    const linkEvent = function (link, map) {
        basic.classToggle(link, 'active');

        //
        //mapFunctions.layerLoadOrOnMap(map, datasets, pk, mapFunctions.extSelect(ext, url))
        //mapFunctions.layerLoadOrOnMap(map, datasets, pk, extSelect(ext, url, mapFunctions.handlePromiseLayer(map, layerMod, layerCluster, datasets, datasetClusters, key)))

        //
        // start simple, then make it into nice functions. It'll be ugly and hacky, then refactored to something good
        if (layerClusterState === 0) {
            datasets[pk]
                ? myMap.hasLayer(datasets[pk])
                ? myMap.removeLayer(datasets[pk])
                : myMap.addLayer(datasets[pk])
            : mapFunctions.extSelect(ext, url)
            // convert data to geojson and add it to layerMod
                .then(res => layerMod.addData(res.toGeoJSON())) // return layerMod
            // add layerMod to datasetsContainer[key], return layerMod
                .then(lm => datasets[pk] = lm)
            // add layerMod to the map, return layerMod
                .then(lm => {
                    map.addLayer(lm).fitBounds(layerMod.getBounds());
                    return lm;
                })
            // add layerMod to the layerCluster, return layerCluster
                .then(lm => layerCluster.addLayer(lm))
            // add layerCluster to the clusterContainer
                .then(lc => datasetClusters[pk] = lc)
            // catch any errors and log them
                .catch(error => console.log(error));
        } else {
            //  mapFunctions.layerLoadOrOnMap(map, datasetClusters, pk, mapFunctions.extSelect(ext, url))
            // convert data to geojson and add it to layerMod
            datasets[pk]
                ? myMap.hasLayer(datasetClusters[pk])
                ? myMap.removeLayer(datasetClusters[pk])
                : myMap.addLayer(datasetClusters[pk])
            : mapFunctions.extSelect(ext, url)
            
                .then(res => layerMod.addData(res.toGeoJSON())) // return layerMod
            // add layerMod to datasetsContainer[key], return layerMod
                .then(lm => {
                    datasets[pk] = lm;
                    return lm;
                })

            // add layerMod to the layerCluster, return layerCluster
                .then(lm => layerCluster.addLayer(lm))

            // add layerCluster to the clusterContainer
                .then(lc => datasetClusters[pk] = lc)

            // add layer Cluster to the map, return layerCluster
                .then(lc => map.addLayer(lc).fitBounds(layerMod.getBounds()))

            // catch any errors and log them
                .catch(error => console.log(error));
        }
        activeDatasetButtons.push(link);
    };

    // if there is only a single dataset for the page, call the event, else
    // wait for the buttons to be pressed

    // ok... why isn't getCSV working here? Is it an async issue? This seems to be
    // linkEvent works on the same csv file when it's part of a list, and 
    // the geojson single dataset pages work
    // how does a kml file work? No. There is a problem with the kml file as well
    link.getAttribute('detail')
        ? linkEvent(link, myMap)
        : link.addEventListener('click', () => linkEvent(link, myMap));
});


// ////////// //
// editMap.js //
// ////////// //
// /////////////////////////////////////////////////////////////////////////
// nominatim
// /////////////////////////////////////////////////////////////////////////

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const showFindPlaceContainerButton = document.getElementById('show_find_place_container_button');
const findPlaceContainer = document.getElementById('find_place_container');

showFindPlaceContainerButton.addEventListener('click', () => {
    basic.classToggle(showFindPlaceContainerButton, 'active');
    editMap.showPlaceContainer(findPlaceContainer);
});

// (2) get elements
const placeInput = document.getElementById('place_input');
//const placeButton = document.getElementById('place_button')
const placeToggle = document.getElementById('place_toggle');
const selector = document.getElementById('selector');
const selectButton = document.getElementById('select_button');

// define containers
const possiblePlaceLayers = {}; // this is where i keep the layers to query the map with
const selectedPlace = [];

activeDatasetButtons.push(/*placeButton,*/ placeToggle, selectButton);

// this is going to need to be used to make selector too
function makeSelectorOptions (array) {
    selector.innerHTML = '';
    array.forEach(place => {
        const option = document.createElement('option');
        option.value = place.display_name;
        const text = document.createTextNode(place.display_name);
        option.appendChild(text);
        selector.appendChild(option);

        const lyr = L.geoJSON(place.geojson);
        possiblePlaceLayers[place.display_name] = lyr;
    });
}

// add place(s) to the selector
/*
  placeButton.addEventListener('click', function findPlace () {
  const val = placeInput.value
  en.getPlaceData(val, makeSelectorOptions)
  })
*/

// now the event fires on the enter key press and when the focus
// shifts to a separate element
placeInput.addEventListener('keydown', function findPlace(e) {
    if (e.keyCode === 13) {
        const val = placeInput.value;
        en.getPlaceData(val, makeSelectorOptions);
    }
});

/*
  placeInput.addEventListener('blur', function findPlace() {
  const val = placeInput.value
  en.getPlaceData(val, makeSelectorOptions)
  })
*/


// select place to display
selectButton.addEventListener('click', function selectPlace () {

    Object.keys(possiblePlaceLayers).forEach(n => {
        const p = possiblePlaceLayers[n];
        myMap.removeLayer(p);
    });

    selectedPlace.length !== 0
        ? (selectedPlace.pop(), selectedPlace.push(possiblePlaceLayers[selector.value]))
        : selectedPlace.push(possiblePlaceLayers[selector.value]);

    const lyr = selectedPlace[0];
    lyr.addTo(myMap);
    myMap.fitBounds(lyr.getBounds());
});

// map and layer should be arguements for a predefined function
placeToggle.addEventListener('click', () => {
    myMap.hasLayer(selectedPlace[0])
        ? myMap.removeLayer(selectedPlace[0])
        : myMap.addLayer(selectedPlace[0]);
});

// /////////////////////////////////////////////////////////////////////////
// end nominatim
// /////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////
// test url
// /////////////////////////////////////////////////////////////////////////

// (1) hide and show stuff (do this after I've gotten it working)
const showTestUrlContainerButton = document.getElementById('show_test_url_container_button');
const testUrlContainer = document.getElementById('test_url_container');

showTestUrlContainerButton.addEventListener('click', function showTestUrlContainer () {

    basic.classToggle(showTestUrlContainerButton, 'active');

    testUrlContainer.style.display === 'none' || testUrlContainer.style.display === ''
        ? testUrlContainer.style.display = 'block'
        : testUrlContainer.style.display = 'none';
});

// (2) get elements
const testUrlInput = document.getElementById('test_url_input');
const toggleTestUrlsButton = document.getElementById('toggle_test_urls');
const testUrls = document.getElementById('test_urls');

const testDatasets = {};
let testDatasetCount = 0;

// pointMarkerOptions
const testUrlMarkerOptions = {
    radius: 6,
    color: 'white',
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.4
};


function getDataFromTestUrl () {
    // get ext and url
    const ext = basic.getExt(testUrlInput.value);
    const url = testUrlInput.value;

    // increment the color counter
    testDatasetCount++;
    const testDatasetColor = colors[testDatasetCount % colors.length];

    // get the data with the correct ext, why is this stuff different than
    // the  functions we already have? I'll refactor later
    mapFunctions.extSelect(ext, url)
        .then(function handleResponse (response) {
            // make this into a layer
            // this should be lifted from this function
            const layerMod = L.geoJSON(null, {
                // set the points to little circles
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, markerOptions);
                },
                onEachFeature: (feature, layer) => {
                    // make sure the fill is the color
                    layer.options.fillColor = testDatasetColor;
                    // and make sure the perimiter is black (if it's a point) and the color otherwise
                    feature.geometry.type === 'Point'
                        ? layer.options.color = 'white'
                        : layer.options.color = testDatasetColor;
                    // add those popups
                    addPopups(feature, layer); // this comes from the index_maps.js file
                }
            });

            // if the response is good then add abutton for it
            // Ugh, I'm using the 'this' keyword. Not cool.
            // refactor later
            const btn = basic.addButton(testDatasetCount, testDatasetColor, testUrls);

            //      btn.setAttribute('id', )

            activeDatasetButtons.push(btn);

            btn.addEventListener('click', function () {
                basic.classToggle(btn, 'active');
                const val = btn.getAttribute('value');
                myMap.hasLayer(testDatasets[val])
                    ? myMap.removeLayer(testDatasets[val])
                    : myMap.addLayer(testDatasets[val]);
            });

            // modify data here
            layerMod.addData(response.toGeoJSON());

            testDatasets[testDatasetCount] = layerMod;

            myMap.addLayer(layerMod).fitBounds(layerMod.getBounds());
        }, function handleError (error) {
            console.log(error);
        });
}

testUrlInput.addEventListener('keydown', function executeGetDataFromTestUrl(e) {
    if (e.keyCode === 13) {
        getDataFromTestUrl();
    }
});

/*
  testUrlInput.addEventListener('blur', getDataFromTestUrl)
*/


// toggle testDatasets on and off
// this should be broken into a function that toggle the datasets
// and a function that toggles the button state

toggleTestUrlsButton.addEventListener('click', () => {
    Object.keys(testDatasets).forEach(x => {
        // also need to make the buttons active and not active
        // this is going to be hacky but it will work
        const btn = document.getElementById(`newbutton${x}`);
        basic.classToggle(btn, 'active');

        myMap.hasLayer(testDatasets[x])
            ? myMap.removeLayer(testDatasets[x])
            : myMap.addLayer(testDatasets[x]);
    });
});

// /////////////////////////////////////////////////////////////////////////
// end test url
// /////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////
// within polygon
// this stuff should be 'required' into the page
// /////////////////////////////////////////////////////////////////////////

const fileContainer = [];

// (1) hide and show nominatim stuff (do this after I've gotten it working)
// rename this to showWithinPolygonContainer
const showWithinPolygonContainerButton = document.getElementById('show_within_polygon_container_button');
const withinPolygonContainer = document.getElementById('within_polygon_container');

// Instead of making a button here makeit in the html, and display/hide it here
// (2) make buttons that will get the data
const getDataWithinPolygonButton = basic.addButton('Get data within polygon', 'black', withinPolygonContainer);
getDataWithinPolygonButton.setAttribute('class', 'btn btn-default');

function showWithinPolygonContainerFunc () {
    basic.classToggle(showWithinPolygonContainerButton, 'active');

    if (editMap.getSelectedPlacePolygon(selectedPlace) !== 'not a polygon') {
        withinPolygonContainer.innerHTML = ''; // why doesn't this clear everything in the container?
        withinPolygonContainer.appendChild(getDataWithinPolygonButton);
    } else {
        withinPolygonContainer.innerHTML = '<h4>You need a polygon first, get one with the' +
            ' place selector or draw one.</h4>';
    }

    withinPolygonContainer.style.display === 'none' || withinPolygonContainer.style.display === ''
        ? withinPolygonContainer.style.display = 'block'
        : withinPolygonContainer.style.display = 'none';
}


// /////////////////////////////////////////////////////////////////////////
// toggle markers to clusters
// Now I need to make the data addition thing work with this
// /////////////////////////////////////////////////////////////////////////
const toggleMarkerClustersButton = document.getElementById('toggle_marker_clusters');

const pctoggler = function (map, obj1, obj2) {
    Object.keys(obj1).forEach(key => {
        if (map.hasLayer(obj1[key])) {
            map.removeLayer(obj1[key]);
            map.addLayer(obj2[key]);
        }
    });
};

const toggleMarkerClusters = function (map, layers, clusters) {
    // If the layer cluster state is 0, which means layers and not clusters, then the
    // function will
    if (layerClusterState === 0) {
        pctoggler(map, layers, clusters);
        layerClusterState++;
    } else {
        pctoggler(map, clusters, layers);
        layerClusterState--;
    }
};

toggleMarkerClustersButton.addEventListener('click', function clusterToLayer () {
    toggleMarkerClusters(myMap, datasets, datasetClusters);
});


function saveFile (layer, fileNameInput) {
    const filename = fileNameInput.value;
    const data = JSON.stringify(layer.toGeoJSON());
    const blob = new Blob([data], {type: 'text/plain; charset=utf-8'});

    // this doesn't seem to work with markerClusters
    //console.log(data)
    filesaver.saveAs(blob, filename + '.geojson');
}

// how do I get every active layer points on the map?
// make this return a feature collection with the points
// here I have to call the convert clusters to layers function

const activePointsLayersToFeatureCollection = function (map) {
    const arr = [];
    map.eachLayer(mapLayer => {
        if (mapLayer.feature) {
            const lt = mapLayer.feature.geometry.type;
            if (lt === "Point" || lt === "MultiPoint") {
                arr.push(mapLayer.toGeoJSON());
            }
        }
    });
    return featureCollection(arr);
};

// this is probably where I need to get the data
// turf.within works with feature collections
// this isn't the prettiest function, but it can be refactored layer. It works
// Now I need to figure out how to turn the new dataset on and off
const getDataWithinPolygonFunc = function (map, poly) {
    let data;
    if (layerClusterState === 0) {
        data = within(activePointsLayersToFeatureCollection(map), poly);
    } else {
        toggleMarkerClusters(myMap, datasets, datasetClusters);
        data = within(activePointsLayersToFeatureCollection(map), poly);
        toggleMarkerClusters(myMap, datasets, datasetClusters);
    }
    return data;
};

showWithinPolygonContainerButton.addEventListener('click', showWithinPolygonContainerFunc);

// now to get this working
getDataWithinPolygonButton.addEventListener('click', () => {
    // This is pretty ugly, but right now it works, it will be
    // refactored
    const pointsWithinLayer = L.geoJSON(
        getDataWithinPolygonFunc(myMap, editMap.getSelectedPlacePolygon(selectedPlace))                
    ).addTo(myMap);

    if (document.getElementById('file_name_input')) {
        const fni = document.getElementById('file_name_input');
        const fsb = document.getElementById('file_save_button');
        fni.parentNode.removeChild(fni);
        fsb.parentNode.removeChild(fsb);
    }

    // How do I delete this input and save button and re create them on every button press
    // make file name input
    const fileNameInput = document.createElement('input');
    fileNameInput.id = 'file_name_input';
    fileNameInput.setAttribute('class', 'form-control');
    fileNameInput.setAttribute('placeholder', 'Enter the file name here');
    fileNameInput.setAttribute('type', 'text');
    withinPolygonContainer.appendChild(fileNameInput);

    // Instead of having a save button, I should just have the html in the template
    // make save button
    const saveButton = basic.addButton('Save to geojson file', 'black', withinPolygonContainer);
    saveButton.id = 'file_save_button';
    saveButton.classList.remove('active');
    saveButton.addEventListener('click', () => saveFile(pointsWithinLayer, fileNameInput));

});

// (3) add event listener to button that gets the data

// should this function be defined separately, and have arguements?

////////////////////////////////////////////////////////////////////////
// This button/function converts the polygon stored in the selectedPlace
// container and coverts it to geojson. It then gets all the active points
// layers from the map and checks if they fall within a polygon. If they
// are in the polygon, then they are added to a leaflet geojson layer
// which is added to the map. This layer can then be saved to a file
// using the 'filesaver' javascript script functionality. The function
// creates buttons that save the data to a file, and clears the data
// from the saved
////////////////////////////////////////////////////////////////////////


// clear map
// get button and add click event


// the goal is to check if the layers on the map match any of
// the layers in an array. If they do match, they are not to be
// removed, if they don't match, they must be removed.

// For each layer on the map, if that layer equals a layer in the
// array, do not remove the layer, otherwise, remove the layer
//

/*
  const clearLayers = function (map) {
  map.eachLayer(mapLayer => {
  if (mapLayer.feature) {
  map.removeLayer(mapLayer) 
  }
  })
  }
*/


// this was extremely frustrating to write
// However, this works with the markerCluster function
// simply specifying that the layer should have features doesn't work
// it separates the tile layers out, but it also separates out the 
// markerCluster layers
// of course I could just call the toggleMarkerClusters function...
const clearLayers = function (map, arr) {
    map.eachLayer(mapLayer => {
        const arrayLayer = arr.map(aL => map.hasLayer(aL) ? aL : undefined)
              .filter(x => {
                  if (x !== undefined) {
                      return x
                  }
              })
        if (mapLayer !== arrayLayer[0]) {
            map.removeLayer(mapLayer);
        }
    });
};

const clearMapButton = document.getElementById('clear_map');

const tileLayers = Object.keys(baseLayers).map(n => baseLayers[n]);

clearMapButton.addEventListener('click', function clearMap () {
    // toggle 'active' class off
    activeDatasetButtons.forEach(function deactivate (link) {
        link.classList.remove('active');
    });

    // remove all layers from map, except the active tile layers
    clearLayers(myMap, tileLayers);
});


// /////////////////////////////////////////////////////////////////////////
// Filterize 
// /////////////////////////////////////////////////////////////////////////
// make a button, that when pressed, reveals a selector with the datasets
// as well as an input box

// get all active datasets on map that are not tile layers

// this must be called with the toggleMarkeClusters function
// toggleMarkerClusters(myMap, datasets, datasetClusters)
// this must be called with the toggleMarkeClusters function
// first put all active datasets in array

// this is difficult because it pulls from the map, and the map gives 
// layers back, not necessarily single names
// so how do I get the names from the datasets container and use them?

// I probably have to compare those datasets with the active layers on
// the map

// this shouldn't be too bad. I'll just switch it up so that the array is
// the datasets array, and so that it compares them .... and returns the
// positives, instead of looking for negatives

// there needs to be a function that gets marker layers and toggles them
// to datasets, but doesn't get the non-marker layers
const activeNonTileLayerKeys = function (map, obj) {
    return Object.keys(obj)
        .filter(key => {
            if (map.hasLayer(obj[key])) {
                return obj
            }
        })
}

// get filter by container button stuff
// make container show up
// there also needs to be a hide container function. There should be a toggle function somewhere
const showFilterByContainer = document.getElementById('filter_by_container_button');
const filterByContainer = document.getElementById('filter_by_container');

showFilterByContainer.addEventListener('click', () => {

    // filter description text
    const descriptionText = `This section will contain a selector containing all of the
unique field names (keys) for a dataset. It will also include a text input -or- another selector
that will allow the field values to be searched. On the value search only the data points that
match the search query will be displayed on the map.`;

    const descriptionTextNode = document.createTextNode(descriptionText);

    // make selector, that has all active datasets on it.
    const filterBySelector = layerClusterState === 0 
          ? filterize.makeSelector(activeNonTileLayerKeys(myMap, datasets))
          : filterize.makeSelector(activeNonTileLayerKeys(myMap, datasetClusters));

    filterBySelector.setAttribute('id', 'filter_by_selector');
    filterByContainer.appendChild(descriptionTextNode);
    filterByContainer.appendChild(filterBySelector);
    //console.log(filterByContainer)

});

// get text input
const filter_by_input = document.getElementById('filter_by_input');

// get selected dataset on selector choice

// on text input submit run the dataset filter function

// update the filtered layer to show only filtered points or polygons or lines

// I bet that marker cluster isn't working because it was being called on
// non-points layers
// listen to map
myMap.on('layeradd', () => {
    //toggleMarkerClusters(myMap, datasets, datasetClusters)
    //  var x = activeNonTileLayersOnMap(myMap, tileLayers)
    //  console.log(x.length)
    //toggleMarkerClusters(myMap, datasets, datasetClusters)
});


// then populate selector with results from the array

// use array to select the layer to search

// get layer, convert to geojson, and search its properties for the term

// filterize.featurePropertiesInclude(searchTerm, geojson)

// remove selected layer from map, and add new filtered layer to map


