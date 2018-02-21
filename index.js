"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var m = require("mithril");
/**
 * mithril-select Component
 */
var mithrilSelect = function mithrilSelect(vnode) {
    var curValue;
    var isOpen = false;
    var isFocused = false;
    var rootElement;
    var options = vnode.attrs.options;
    var onchange = vnode.attrs.onchange;
    var uid = generateUid();
    (function init() {
        var _a = vnode.attrs, defaultValue = _a.defaultValue, value = _a.value, promptView = _a.promptView, promptContent = _a.promptContent;
        var initialValue = vnode.attrs.initialValue;
        if (!promptView && !promptContent && options && options.length > 0) {
            curValue = options[0].value;
        }
        if (defaultValue !== undefined && initialValue === undefined) {
            console.warn('mithril-select: defaultValue is deprecated. Use initialValue instead.');
            initialValue = defaultValue;
        }
        if (value !== undefined) {
            // If a `value` attr was supplied it overrides/is used as initialValue
            if (findOption(options, value)) {
                initialValue = value;
            }
            else {
                console.warn("mithril-select: value (" + value + ") does not exist in supplied options.");
            }
        }
        if (initialValue !== undefined) {
            if (findOption(options, initialValue)) {
                curValue = initialValue;
            }
            else {
                console.warn("mithril-select: initialValue (" + initialValue + ") does not exist in supplied options.");
            }
        }
        // Destroy reference to our initial vnode
        vnode = undefined;
    }());
    /** Handle event when child element is focused */
    function onFocus(e) {
        if (e.target instanceof Node && rootElement.contains(e.target)) {
            isFocused = true;
        }
    }
    /** Handle event when child element is blurred */
    function onBlur(e) {
        if (e.target instanceof Node && rootElement.contains(e.target)) {
            isFocused = false;
            // Elements will blur THEN focus, so there is a moment where none of the
            // select's elements will be focused. In order to prevent closing the
            // select in these cases, we delay a frame to be sure no elements
            // are going to be focused and that the select should really close.
            requestAnimationFrame(function () {
                if (isOpen && !isFocused) {
                    close();
                    m.redraw();
                }
            });
        }
    }
    function toggle() {
        if (!isOpen) {
            open();
        }
        else {
            close();
        }
    }
    function open() {
        isOpen = true;
        // When the component is opened, the idea is to focus
        // either the currently selected option or the first one
        // (like a native browser select.)
        // Then we want to allow the arrow keys to move up & down.
        if (options && options.length > 0) {
            var i = curValue !== undefined ? Math.max(0, findOptionIndex(options, curValue)) : 0;
            var elOpt_1 = rootElement.childNodes[1].childNodes[0].childNodes[i];
            // Must delay a frame before focusing
            requestAnimationFrame(function () {
                elOpt_1.focus();
            });
        }
    }
    function close() {
        isOpen = false;
    }
    /** Select next option in closed select with keyboard */
    function selectNextOption(dir) {
        if (!options || options.length < 1)
            return;
        var index = 0;
        if (curValue !== undefined) {
            index = findOptionIndex(options, curValue);
            index = (index >= 0) ? pmod(index + dir, options.length) : 0;
        }
        curValue = options[index].value;
        onchange && onchange(curValue);
    }
    /** Focus next option when navigating open select with keyboard */
    function focusNextOption(index, dir) {
        var i = pmod(index + dir, options.length);
        var elOpt = rootElement.childNodes[1].childNodes[0].childNodes[i];
        // Must delay a frame before focusing
        requestAnimationFrame(function () {
            elOpt.focus();
        });
    }
    /** Handle click events on select head */
    function onClickHead(e) {
        e.stopPropagation();
        if (!isOpen)
            e.preventDefault();
        toggle();
    }
    /** Handle keydown events on select head */
    function onKeydownHead(e) {
        if (e.keyCode === 32) {
            e.preventDefault();
            toggle();
        }
        else if (e.keyCode === 27) {
            if (isOpen) {
                close();
                // Re-focus head on close
                requestAnimationFrame(function () {
                    rootElement.childNodes[0].focus();
                });
            }
        }
        else if (e.keyCode === 37 || e.keyCode === 38) {
            // When select head is focused, arrow keys cycle through options.
            // Change to previous selection
            selectNextOption(-1);
        }
        else if (e.keyCode === 39 || e.keyCode === 40) {
            // Change to next selection
            selectNextOption(1);
        }
    }
    /** Handle click events on select options */
    function onClickOption(e) {
        e.stopPropagation();
        var opt = options[Number(e.currentTarget.getAttribute('data-index'))];
        curValue = opt.value;
        isFocused = false;
        close();
        // Re-focus head on close
        requestAnimationFrame(function () {
            rootElement.childNodes[0].focus();
        });
        onchange && onchange(opt.value);
    }
    /** Handle keydown events on select options */
    function onKeydownOption(e) {
        var index = Number(e.currentTarget.getAttribute('data-index'));
        var opt = options[index];
        if (e.keyCode === 13) {
            // Enter selects
            curValue = opt.value;
            isFocused = false;
            close();
            // Re-focus head on close
            requestAnimationFrame(function () {
                rootElement.childNodes[0].focus();
            });
            onchange && onchange(opt.value);
        }
        else if (e.keyCode === 27) {
            // Escape closes
            close();
            // Re-focus head on close
            requestAnimationFrame(function () {
                rootElement.childNodes[0].focus();
            });
        }
        else if (e.keyCode === 37 || e.keyCode === 38) {
            // Left or up keys - focus previous
            focusNextOption(index, -1);
        }
        else if (e.keyCode === 39 || e.keyCode === 40) {
            // Right or down keys - focus next
            focusNextOption(index, 1);
        }
    }
    // Return object with component hooks
    return {
        oncreate: function (_a) {
            var dom = _a.dom;
            window.addEventListener('focus', onFocus, true);
            window.addEventListener('blur', onBlur, true);
            rootElement = dom;
        },
        onupdate: function (_a) {
            var dom = _a.dom;
            rootElement = dom;
        },
        onremove: function () {
            window.removeEventListener('focus', onFocus, true);
            window.removeEventListener('blur', onBlur, true);
        },
        view: function (_a) {
            var attrs = _a.attrs;
            options = attrs.options;
            onchange = attrs.onchange;
            if (attrs.value !== undefined) {
                curValue = attrs.value;
            }
            var curOpt = findOption(options, curValue);
            if (!curOpt) {
                curValue = undefined;
                if (options.length > 0 && !attrs.promptView && !attrs.promptContent) {
                    curOpt = options[0];
                    curValue = options[0].value;
                }
            }
            return m('.mithril-select', { class: attrs.class }, m('.mithril-select-head', {
                role: 'combobox',
                'aria-expanded': isOpen ? 'true' : 'false',
                'aria-haspopup': 'true',
                'aria-owns': uid,
                'aria-labelledby': attrs.labelId,
                id: attrs.id,
                tabIndex: '0',
                onclick: onClickHead,
                onkeydown: onKeydownHead
            }, !!curOpt
                ? curOpt.view != null
                    ? typeof curOpt.view === 'string' ? curOpt.view : curOpt.view()
                    : renderContent(curOpt.content != null ? curOpt.content : curOpt.value, curOpt.attrs)
                : attrs.promptView != null
                    ? typeof attrs.promptView === 'string' ? attrs.promptView : attrs.promptView()
                    : renderContent(attrs.promptContent, attrs.promptAttrs)), m('.mithril-select-body', { class: isOpen ? 'mithril-select-body-open' : undefined }, m('ul.mithril-select-options', {
                role: 'listbox',
                'aria-hidden': isOpen ? 'true' : 'false',
                id: uid
            }, options.map(function (o, index) {
                return m('li.mithril-select-option', {
                    key: index,
                    tabIndex: '-1',
                    'aria-role': 'option',
                    'data-index': String(index),
                    onclick: onClickOption,
                    onkeydown: onKeydownOption
                }, o.view != null
                    ? typeof o.view === 'string' ? o.view : o.view()
                    : renderContent(o.content, o.attrs));
            }))), !!name && m('input', { name: name, type: 'hidden', value: curValue }));
        }
    };
};
exports.default = mithrilSelect;
/** Render content of the head or an option */
function renderContent(content, attrs) {
    // What type is content...
    if (content && (typeof content === 'function' || typeof content.view === 'function')) {
        // Assume component - render vnode
        return m(content, attrs);
    }
    return content;
}
/** Always positive modulus */
function pmod(n, d) {
    return ((n % d + d) % d);
}
/** Generate an ID for aria */
function generateUid() {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var id = '';
    for (var i = 0; i < 16; ++i) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
/** Find an option by value. Returns undefined if not found. */
function findOption(options, value) {
    if (!options)
        return undefined;
    for (var i = 0, n = options.length; i < n; ++i) {
        if (options[i].value === value)
            return options[i];
    }
    return undefined;
}
/** Find an option index by value. Returns -1 if not found. */
function findOptionIndex(options, value) {
    if (!options)
        return -1;
    for (var i = 0, n = options.length; i < n; ++i) {
        if (options[i].value === value)
            return i;
    }
    return -1;
}
