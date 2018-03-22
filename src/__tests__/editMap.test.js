// test/editMap.test.js
'use strict';

import { showPlaceContainer } from '../pieces/editMap.js';

describe('editMap.js file tests', () => {
    // Is this an extraneous function?
    // It seems to be toggling visibility
    describe('showPlaceContainer function', () => {
        // there should be a better way to mock stuff
        // I should be able to bring in a template to use. I will start by doing it the long way
        test('showPlaceContainer should change element display style from "" to "block"', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            fixture.appendChild(element);

            // call function
            showPlaceContainer(element);

            // test to see that the function worked
            expect(element.getAttribute('style')).toBe('display: block;');
        });
        test('showPlaceContainer should change element display style from "none" to "block"', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            fixture.appendChild(element);

            // set element style to "display: none"
            element.setAttribute('style', 'display: none');

            // call function
            showPlaceContainer(element);

            // test to see that the function worked
            expect(element.getAttribute('style')).toBe('display: block;');
        });
    });
});
