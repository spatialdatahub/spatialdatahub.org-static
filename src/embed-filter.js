// here i have to make a filter function that relies on the url

// get map
// get dataset
// search url for ?f=STRING and use STRING to filter the dataset

// get url filter string
var urlParams = new URLSearchParams(window.location.search);

//for (let p of urlParams.values()) { console.log(p) };

urlParams.forEach((value, key) => {
    if (key === 'f') {
        console.log(value);
        // do a bunch of cool stuff
    }
//  console.log(`key: ${key}, value: ${value}`)  
});
