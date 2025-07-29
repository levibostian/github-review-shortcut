// ==UserScript==
// @name         GitHub PR review keyboard shortcut
// @version      0.2
// @description  Mark file as "viewed" on GitHub PR UI when hovering and pressing 'Escape' key
// @match        https://github.com/*
// @author       dvdvdmt, nbolton
// @source       https://github.com/orgs/community/discussions/10197
// @namespace    https://github.com/nbolton/github-review-shortcut
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    if (window.disposeMarkAsViewedByEscape) {
        window.disposeMarkAsViewedByEscape();
    }

    window.disposeMarkAsViewedByEscape = start();

    function start() {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown);
    }

    function markFileAsViewed() {
        console.debug("Marking file as viewed");

        const fileElement = document.querySelector(`[id^="diff-"]:hover`);
        if (!fileElement){
            console.warn("No file element under cursor");
            return;
        }

        console.debug("File element found, finding buttons");
        const buttons = [...fileElement.querySelectorAll('button')];
        if (buttons.length === 0) {
            console.warn("No buttons found in file element");
            return;
        }

        console.debug("Buttons found, finding checkbox");
        const checkbox = buttons.find(btn => btn.textContent.trim() === 'Viewed');
        if (!checkbox) {
            console.warn("No checkbox found for file ement");
            return;
        }

        console.debug("Clicking checkbox");
        checkbox.click();
    }

    function handleKeyDown() {
        if (event.key === 'Escape') {
            markFileAsViewed();
        }
    }

})();
