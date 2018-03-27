(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

// here i have to make a filter function that relies on the url

// get map
// get dataset
// search url for ?f=STRING and use STRING to filter the dataset

// get url filter string
var urlParams = new URLSearchParams(window.location.search);

//for (let p of urlParams.values()) { console.log(p) };

urlParams.forEach(function (value, key) {
    if (key === 'f') {
        console.log(value);
        // do a bunch of cool stuff
    }
    //  console.log(`key: ${key}, value: ${value}`)  
});

},{}]},{},[1]);
