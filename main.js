// ==UserScript==
// @name         GitHub PR review keyboard shortcut
// @version      0.3
// @description  Mark file as "viewed" on GitHub PR UI when hovering and pressing 'Escape' key
// @match        https://github.com/*
// @author       dvdvdmt, nbolton, levibostian
// @source       https://github.com/nbolton/github-review-shortcut
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

    function isInEditableArea(el) {
        if (!el) return false;
        // If the target or any ancestor is input/textarea/select
        if (el.closest && el.closest('input, textarea, select')) return true;
        // If the target or ancestor has contentEditable=true (or is contentEditable)
        const editable = el.closest && el.closest('[contenteditable]');
        if (editable) {
            const ce = editable.getAttribute('contenteditable');
            // treat empty string or "true" as editable; also fallback to isContentEditable
            if (ce === '' || ce === 'true' || editable.isContentEditable) return true;
        }
        // Some GitHub editors use role="textbox"
        if (el.closest && el.closest('[role="textbox"]')) return true;
        return false;
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

    function handleKeyDown(event) {
        // Only act on plain Escape without modifiers
        if (event.key !== 'Escape' || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        // If focus is inside any editable input/textarea/contentEditable, do nothing
        if (isInEditableArea(event.target)) {
            return;
        }

        markFileAsViewed();
    }

})();
