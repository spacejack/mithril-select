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
    var uid = generateUid();
    (function init() {
        var _a = vnode.attrs, initialValue = _a.initialValue, defaultValue = _a.defaultValue, value = _a.value, promptContent = _a.promptContent, promptView = _a.promptView;
        if (!promptContent && !promptView && options && options.length > 0) {
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
    function toggle(options) {
        if (!isOpen) {
            open(options);
        }
        else {
            close();
        }
    }
    function open(options) {
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
    function nextOption(dir, onchange) {
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
            var id = attrs.id, klass = attrs.class, name = attrs.name, value = attrs.value, labelId = attrs.labelId, promptContent = attrs.promptContent, promptAttrs = attrs.promptAttrs, onchange = attrs.onchange;
            options = attrs.options;
            if (value !== undefined) {
                curValue = value;
            }
            var curOpt = findOption(options, curValue);
            if (!curOpt) {
                curValue = undefined;
                if (options.length > 0 && !promptContent) {
                    curOpt = options[0];
                    curValue = options[0].value;
                }
            }
            return m('.mithril-select', { class: klass }, m('.mithril-select-head', {
                role: 'combobox',
                'aria-expanded': isOpen ? 'true' : 'false',
                'aria-haspopup': 'true',
                'aria-owns': uid,
                'aria-labelledby': labelId,
                id: id,
                tabIndex: '0',
                onclick: function (e) {
                    e.stopPropagation();
                    if (!isOpen)
                        e.preventDefault();
                    toggle(options);
                },
                onkeydown: function (e) {
                    if (e.keyCode === 32) {
                        e.preventDefault();
                        toggle(options);
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
                        nextOption(-1, onchange);
                    }
                    else if (e.keyCode === 39 || e.keyCode === 40) {
                        // Change to next selection
                        nextOption(1, onchange);
                    }
                }
            }, !!curOpt
                ? curOpt.view
                    ? curOpt.view()
                    : renderContent(curOpt.content != null ? curOpt.content : curOpt.value, curOpt.attrs)
                : attrs.promptView
                    ? attrs.promptView()
                    : renderContent(promptContent, promptAttrs)), m('.mithril-select-body', { class: isOpen ? 'mithril-select-body-open' : undefined }, m('ul.mithril-select-options', {
                role: 'listbox',
                'aria-hidden': isOpen ? 'true' : 'false',
                id: uid
            }, options.map(function (o, index) {
                return m('li.mithril-select-option', {
                    'aria-role': 'option',
                    tabIndex: '-1',
                    onclick: function (e) {
                        e.stopPropagation();
                        curValue = o.value;
                        isFocused = false;
                        close();
                        // Re-focus head on close
                        requestAnimationFrame(function () {
                            rootElement.childNodes[0].focus();
                        });
                        onchange && onchange(o.value);
                    },
                    onkeydown: function (e) {
                        if (e.keyCode === 13) {
                            // Enter selects
                            curValue = o.value;
                            isFocused = false;
                            close();
                            // Re-focus head on close
                            requestAnimationFrame(function () {
                                rootElement.childNodes[0].focus();
                            });
                            onchange && onchange(o.value);
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
                            var i = pmod(index - 1, options.length);
                            var elOpt_2 = rootElement.childNodes[1].childNodes[0].childNodes[i];
                            // Must delay a frame before focusing
                            requestAnimationFrame(function () {
                                elOpt_2.focus();
                            });
                        }
                        else if (e.keyCode === 39 || e.keyCode === 40) {
                            // Right or down keys - focus next
                            var i = pmod(index + 1, options.length);
                            var elOpt_3 = rootElement.childNodes[1].childNodes[0].childNodes[i];
                            requestAnimationFrame(function () {
                                elOpt_3.focus();
                            });
                        }
                    }
                }, o.view
                    ? o.view()
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
function pmod(n, m) {
    return ((n % m + m) % m);
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
