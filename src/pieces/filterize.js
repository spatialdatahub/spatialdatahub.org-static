// spatialdatahub.org-static/src/pieces/filterize.js
// here I have to make a filter function that relies on the url
// this needs to be put into the main bundle.js so that it has access
// to all the variables. these things need to be made into functions that
// run only at specific times. How can I make that happen?

const getDatasetFilterParams = function(urlString) {
    const urlParams = new URLSearchParams(urlString);
    let response = [];
    urlParams.forEach((value, key) => {
	// q is used in the python form stuff, so it cannot be used here.
        if (key !== 'q') {
            response.push({value: value, key: key});
        }
    });
    return response;
};

module.exports = {
  getDatasetFilterParams: getDatasetFilterParams
};
