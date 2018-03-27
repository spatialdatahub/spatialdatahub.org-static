// here i have to make a filter function that relies on the url
// this needs to be put into the main bundle.js so that it has access
// to all the variables. these things need to be made into functions that
// run only at specific times. How can I make that happen?

// get map

// get dataset

// get url filter string
// I don't like the way that I have to write this, but it works, which is the
// most important thing.
const getDatasetFilterParamValue = function() {
    const urlParams = new URLSearchParams(window.location.search);
    let response;
    urlParams.forEach((value, key) => {
        if (key === 'f') {
            response = value;
        }
    });
    return response;
};

console.log(getDatasetFilterParamValue());

// the key can be whatever... maybe name or something there should be a
// default value that just shows all data.

