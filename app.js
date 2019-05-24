(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],3:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":6}],4:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],5:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":5}],7:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],8:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],9:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":33}],10:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":20}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":24,"is-object":7}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":22,"../vnode/is-vnode.js":25,"../vnode/is-vtext.js":26,"../vnode/is-widget.js":27,"./apply-properties":12,"global/document":4}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":27,"../vnode/vpatch.js":30,"./apply-properties":12,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":13,"./dom-index":14,"./patch-op":15,"global/document":4,"x-is-array":34}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":27}],18:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":3}],19:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],20:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":23,"../vnode/is-vhook":24,"../vnode/is-vnode":25,"../vnode/is-vtext":26,"../vnode/is-widget":27,"../vnode/vnode.js":29,"../vnode/vtext.js":31,"./hooks/ev-hook.js":18,"./hooks/soft-set-hook.js":19,"./parse-tag.js":21,"x-is-array":34}],21:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":2}],22:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":23,"./is-vnode":25,"./is-vtext":26,"./is-widget":27}],23:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],24:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],25:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":28}],26:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":28}],27:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],28:[function(require,module,exports){
module.exports = "2"

},{}],29:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":23,"./is-vhook":24,"./is-vnode":25,"./is-widget":27,"./version":28}],30:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":28}],31:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":28}],32:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":24,"is-object":7}],33:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":22,"../vnode/is-thunk":23,"../vnode/is-vnode":25,"../vnode/is-vtext":26,"../vnode/is-widget":27,"../vnode/vpatch":30,"./diff-props":32,"x-is-array":34}],34:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],35:[function(require,module,exports){
// Generated by purs bundle 0.12.5
var PS = {};
(function(exports) {
  "use strict";

  exports.showIntImpl = function (n) {
    return n.toString();
  };
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Show"] = $PS["Data.Show"] || {};
  var exports = $PS["Data.Show"];
  var $foreign = $PS["Data.Show"];
  var Show = function (show) {
      this.show = show;
  };                                                 
  var showInt = new Show($foreign.showIntImpl);
  var show = function (dict) {
      return dict.show;
  };
  exports["Show"] = Show;
  exports["show"] = show;
  exports["showInt"] = showInt;
})(PS);
(function(exports) {
  "use strict";

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Functor"] = $PS["Data.Functor"] || {};
  var exports = $PS["Data.Functor"];
  var $foreign = $PS["Data.Functor"];              
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };                                                                                             
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["functorArray"] = functorArray;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Semigroupoid"] = $PS["Control.Semigroupoid"] || {};
  var exports = $PS["Control.Semigroupoid"];
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });
  var compose = function (dict) {
      return dict.compose;
  };
  exports["compose"] = compose;
  exports["Semigroupoid"] = Semigroupoid;
  exports["semigroupoidFn"] = semigroupoidFn;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Category"] = $PS["Control.Category"] || {};
  var exports = $PS["Control.Category"];
  var Control_Semigroupoid = $PS["Control.Semigroupoid"];                
  var Category = function (Semigroupoid0, identity) {
      this.Semigroupoid0 = Semigroupoid0;
      this.identity = identity;
  };
  var identity = function (dict) {
      return dict.identity;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["Category"] = Category;
  exports["identity"] = identity;
  exports["categoryFn"] = categoryFn;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.Html.Present"] = $PS["Oak.Html.Present"] || {};
  var exports = $PS["Oak.Html.Present"];
  var Control_Category = $PS["Control.Category"];
  var Data_Show = $PS["Data.Show"];                
  var Present = function (present) {
      this.present = present;
  };
  var presentString = new Present(Control_Category.identity(Control_Category.categoryFn));
  var presentInt = new Present(Data_Show.show(Data_Show.showInt));        
  var present = function (dict) {
      return dict.present;
  };
  exports["present"] = present;
  exports["Present"] = Present;
  exports["presentString"] = presentString;
  exports["presentInt"] = presentInt;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.Html.Attribute"] = $PS["Oak.Html.Attribute"] || {};
  var exports = $PS["Oak.Html.Attribute"];
  var Data_Functor = $PS["Data.Functor"];
  var Oak_Html_Present = $PS["Oak.Html.Present"];                
  var BooleanAttribute = (function () {
      function BooleanAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      BooleanAttribute.create = function (value0) {
          return function (value1) {
              return new BooleanAttribute(value0, value1);
          };
      };
      return BooleanAttribute;
  })();
  var DataAttribute = (function () {
      function DataAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      DataAttribute.create = function (value0) {
          return function (value1) {
              return new DataAttribute(value0, value1);
          };
      };
      return DataAttribute;
  })();
  var EventHandler = (function () {
      function EventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      EventHandler.create = function (value0) {
          return function (value1) {
              return new EventHandler(value0, value1);
          };
      };
      return EventHandler;
  })();
  var KeyPressEventHandler = (function () {
      function KeyPressEventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      KeyPressEventHandler.create = function (value0) {
          return function (value1) {
              return new KeyPressEventHandler(value0, value1);
          };
      };
      return KeyPressEventHandler;
  })();
  var SimpleAttribute = (function () {
      function SimpleAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      SimpleAttribute.create = function (value0) {
          return function (value1) {
              return new SimpleAttribute(value0, value1);
          };
      };
      return SimpleAttribute;
  })();
  var StringEventHandler = (function () {
      function StringEventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      StringEventHandler.create = function (value0) {
          return function (value1) {
              return new StringEventHandler(value0, value1);
          };
      };
      return StringEventHandler;
  })();
  var Style = (function () {
      function Style(value0) {
          this.value0 = value0;
      };
      Style.create = function (value0) {
          return new Style(value0);
      };
      return Style;
  })();
  var style = function (attrs) {
      return new Style(attrs);
  };
  var name = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("name", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var attributeFunctor = new Data_Functor.Functor(function (f) {
      return function (attr) {
          if (attr instanceof StringEventHandler) {
              return new StringEventHandler(attr.value0, function ($108) {
                  return f(attr.value1($108));
              });
          };
          if (attr instanceof EventHandler) {
              return new EventHandler(attr.value0, f(attr.value1));
          };
          if (attr instanceof KeyPressEventHandler) {
              return new KeyPressEventHandler(attr.value0, function ($109) {
                  return f(attr.value1($109));
              });
          };
          if (attr instanceof BooleanAttribute) {
              return new BooleanAttribute(attr.value0, attr.value1);
          };
          if (attr instanceof DataAttribute) {
              return new DataAttribute(attr.value0, attr.value1);
          };
          if (attr instanceof SimpleAttribute) {
              return new SimpleAttribute(attr.value0, attr.value1);
          };
          if (attr instanceof Style) {
              return new Style(attr.value0);
          };
          throw new Error("Failed pattern match at Oak.Html.Attribute (line 41, column 5 - line 48, column 25): " + [ attr.constructor.name ]);
      };
  });
  exports["BooleanAttribute"] = BooleanAttribute;
  exports["DataAttribute"] = DataAttribute;
  exports["EventHandler"] = EventHandler;
  exports["KeyPressEventHandler"] = KeyPressEventHandler;
  exports["SimpleAttribute"] = SimpleAttribute;
  exports["StringEventHandler"] = StringEventHandler;
  exports["Style"] = Style;
  exports["style"] = style;
  exports["name"] = name;
  exports["attributeFunctor"] = attributeFunctor;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.Html"] = $PS["Oak.Html"] || {};
  var exports = $PS["Oak.Html"];
  var Data_Functor = $PS["Data.Functor"];
  var Oak_Html_Attribute = $PS["Oak.Html.Attribute"];
  var Oak_Html_Present = $PS["Oak.Html.Present"];                
  var Text = (function () {
      function Text(value0) {
          this.value0 = value0;
      };
      Text.create = function (value0) {
          return new Text(value0);
      };
      return Text;
  })();
  var Tag = (function () {
      function Tag(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Tag.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Tag(value0, value1, value2);
              };
          };
      };
      return Tag;
  })();
  var ul = function (attrs) {
      return function (children) {
          return new Tag("ul", attrs, children);
      };
  };
  var text = function (dictPresent) {
      return function (val) {
          return new Text(Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var li = function (attrs) {
      return function (children) {
          return new Tag("li", attrs, children);
      };
  };
  var htmlFunctor = new Data_Functor.Functor(function (f) {
      return function (html) {
          if (html instanceof Text) {
              return new Text(html.value0);
          };
          if (html instanceof Tag) {
              return new Tag(html.value0, Data_Functor.map(Data_Functor.functorArray)(Data_Functor.map(Oak_Html_Attribute.attributeFunctor)(f))(html.value1), Data_Functor.map(Data_Functor.functorArray)(Data_Functor.map(htmlFunctor)(f))(html.value2));
          };
          throw new Error("Failed pattern match at Oak.Html (line 22, column 5 - line 25, column 60): " + [ html.constructor.name ]);
      };
  });
  var div = function (attrs) {
      return function (children) {
          return new Tag("div", attrs, children);
      };
  };
  var button = function (attrs) {
      return function (children) {
          return new Tag("button", attrs, children);
      };
  };
  exports["Text"] = Text;
  exports["Tag"] = Tag;
  exports["text"] = text;
  exports["button"] = button;
  exports["div"] = div;
  exports["li"] = li;
  exports["ul"] = ul;
  exports["htmlFunctor"] = htmlFunctor;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.Html.Events"] = $PS["Oak.Html.Events"] || {};
  var exports = $PS["Oak.Html.Events"];
  var Oak_Html_Attribute = $PS["Oak.Html.Attribute"];
  var onClick = function (msg) {
      return new Oak_Html_Attribute.EventHandler("onclick", msg);
  };
  exports["onClick"] = onClick;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Child"] = $PS["Child"] || {};
  var exports = $PS["Child"];
  var Data_Show = $PS["Data.Show"];
  var Oak_Html = $PS["Oak.Html"];
  var Oak_Html_Events = $PS["Oak.Html.Events"];
  var Oak_Html_Present = $PS["Oak.Html.Present"];                
  var Inc = (function () {
      function Inc() {

      };
      Inc.value = new Inc();
      return Inc;
  })();
  var Dec = (function () {
      function Dec() {

      };
      Dec.value = new Dec();
      return Dec;
  })();
  var view = function (model) {
      return Oak_Html.div([  ])([ Oak_Html.div([  ])([ Oak_Html.button([ Oak_Html_Events.onClick(Inc.value) ])([ Oak_Html.text(Oak_Html_Present.presentString)("+") ]) ]), Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentInt)(model.number) ]), Oak_Html.div([  ])([ Oak_Html.button([ Oak_Html_Events.onClick(Dec.value) ])([ Oak_Html.text(Oak_Html_Present.presentString)("-") ]) ]) ]);
  };
  var update = function (msg) {
      return function (model) {
          if (msg instanceof Inc) {
              return {
                  number: model.number + 1 | 0
              };
          };
          if (msg instanceof Dec) {
              return {
                  number: model.number - 1 | 0
              };
          };
          throw new Error("Failed pattern match at Child (line 46, column 3 - line 48, column 47): " + [ msg.constructor.name ]);
      };
  };
  var showMsg = new Data_Show.Show(function (msg) {
      if (msg instanceof Inc) {
          return "Inc";
      };
      if (msg instanceof Dec) {
          return "Dec";
      };
      throw new Error("Failed pattern match at Child (line 28, column 5 - line 33, column 1): " + [ msg.constructor.name ]);
  });
  var init = function (v) {
      return {
          number: 0
      };
  };
  exports["Inc"] = Inc;
  exports["Dec"] = Dec;
  exports["view"] = view;
  exports["update"] = update;
  exports["init"] = init;
  exports["showMsg"] = showMsg;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Apply"] = $PS["Control.Apply"] || {};
  var exports = $PS["Control.Apply"];
  var Data_Functor = $PS["Data.Functor"];                
  var Apply = function (Functor0, apply) {
      this.Functor0 = Functor0;
      this.apply = apply;
  };                      
  var apply = function (dict) {
      return dict.apply;
  };
  var lift2 = function (dictApply) {
      return function (f) {
          return function (a) {
              return function (b) {
                  return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b);
              };
          };
      };
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
  exports["lift2"] = lift2;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Applicative"] = $PS["Control.Applicative"] || {};
  var exports = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];        
  var Applicative = function (Apply0, pure) {
      this.Apply0 = Apply0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);
          };
      };
  };
  exports["Applicative"] = Applicative;
  exports["pure"] = pure;
  exports["liftA1"] = liftA1;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Bind"] = $PS["Control.Bind"] || {};
  var exports = $PS["Control.Bind"];
  var Bind = function (Apply0, bind) {
      this.Apply0 = Apply0;
      this.bind = bind;
  };                     
  var bind = function (dict) {
      return dict.bind;
  };
  exports["Bind"] = Bind;
  exports["bind"] = bind;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Monad"] = $PS["Control.Monad"] || {};
  var exports = $PS["Control.Monad"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];                
  var Monad = function (Applicative0, Bind1) {
      this.Applicative0 = Applicative0;
      this.Bind1 = Bind1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad.Bind1())(f)(function (v) {
                  return Control_Bind.bind(dictMonad.Bind1())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS);
(function(exports) {
  "use strict";

  //------------------------------------------------------------------------------
  // Array size ------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.length = function (xs) {
    return xs.length;
  };
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Array"] = $PS["Data.Array"] || {};
  var exports = $PS["Data.Array"];
  var $foreign = $PS["Data.Array"];
  exports["length"] = $foreign.length;
})(PS);
(function(exports) {
  "use strict";

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
  "use strict";

  exports.concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };

  exports.concatArray = function (xs) {
    return function (ys) {
      if (xs.length === 0) return ys;
      if (ys.length === 0) return xs;
      return xs.concat(ys);
    };
  };
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Unit"] = $PS["Data.Unit"] || {};
  var exports = $PS["Data.Unit"];
  var $foreign = $PS["Data.Unit"];
  exports["unit"] = $foreign.unit;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Semigroup"] = $PS["Data.Semigroup"] || {};
  var exports = $PS["Data.Semigroup"];
  var $foreign = $PS["Data.Semigroup"];
  var Data_Unit = $PS["Data.Unit"];
  var Semigroup = function (append) {
      this.append = append;
  }; 
  var semigroupUnit = new Semigroup(function (v) {
      return function (v1) {
          return Data_Unit.unit;
      };
  });
  var semigroupString = new Semigroup($foreign.concatString);
  var semigroupArray = new Semigroup($foreign.concatArray);
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
  exports["semigroupString"] = semigroupString;
  exports["semigroupUnit"] = semigroupUnit;
  exports["semigroupArray"] = semigroupArray;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Monoid"] = $PS["Data.Monoid"] || {};
  var exports = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];
  var Data_Unit = $PS["Data.Unit"];
  var Monoid = function (Semigroup0, mempty) {
      this.Semigroup0 = Semigroup0;
      this.mempty = mempty;
  };
  var monoidUnit = new Monoid(function () {
      return Data_Semigroup.semigroupUnit;
  }, Data_Unit.unit);
  var monoidString = new Monoid(function () {
      return Data_Semigroup.semigroupString;
  }, "");
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["Monoid"] = Monoid;
  exports["mempty"] = mempty;
  exports["monoidUnit"] = monoidUnit;
  exports["monoidString"] = monoidString;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Foldable"] = $PS["Data.Foldable"] || {};
  var exports = $PS["Data.Foldable"];
  var $foreign = $PS["Data.Foldable"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];      
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var foldl = function (dict) {
      return dict.foldl;
  };
  var intercalate = function (dictFoldable) {
      return function (dictMonoid) {
          return function (sep) {
              return function (xs) {
                  var go = function (v) {
                      return function (x) {
                          if (v.init) {
                              return {
                                  init: false,
                                  acc: x
                              };
                          };
                          return {
                              init: false,
                              acc: Data_Semigroup.append(dictMonoid.Semigroup0())(v.acc)(Data_Semigroup.append(dictMonoid.Semigroup0())(sep)(x))
                          };
                      };
                  };
                  return (foldl(dictFoldable)(go)({
                      init: true,
                      acc: Data_Monoid.mempty(dictMonoid)
                  })(xs)).acc;
              };
          };
      };
  }; 
  var foldMapDefaultR = function (dictFoldable) {
      return function (dictMonoid) {
          return function (f) {
              return foldr(dictFoldable)(function (x) {
                  return function (acc) {
                      return Data_Semigroup.append(dictMonoid.Semigroup0())(f(x))(acc);
                  };
              })(Data_Monoid.mempty(dictMonoid));
          };
      };
  };
  var foldableArray = new Foldable(function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  exports["Foldable"] = Foldable;
  exports["foldr"] = foldr;
  exports["foldl"] = foldl;
  exports["foldMap"] = foldMap;
  exports["foldMapDefaultR"] = foldMapDefaultR;
  exports["intercalate"] = intercalate;
  exports["foldableArray"] = foldableArray;
})(PS);
(function(exports) {
  "use strict";

  exports.runFn3 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return fn(a, b, c);
        };
      };
    };
  };
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Function.Uncurried"] = $PS["Data.Function.Uncurried"] || {};
  var exports = $PS["Data.Function.Uncurried"];
  var $foreign = $PS["Data.Function.Uncurried"];
  var runFn1 = function (f) {
      return f;
  };
  exports["runFn1"] = runFn1;
  exports["runFn3"] = $foreign.runFn3;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Maybe"] = $PS["Data.Maybe"] || {};
  var exports = $PS["Data.Maybe"];                 
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var fromJust = function (dictPartial) {
      return function (v) {
          if (v instanceof Just) {
              return v.value0;
          };
          throw new Error("Failed pattern match at Data.Maybe (line 268, column 1 - line 268, column 46): " + [ v.constructor.name ]);
      };
  };
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["fromJust"] = fromJust;
})(PS);
(function(exports) {
  "use strict";

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function array1(a) {
      return [a];
    }

    function array2(a) {
      return function (b) {
        return [a, b];
      };
    }

    function array3(a) {
      return function (b) {
        return function (c) {
          return [a, b, c];
        };
      };
    }

    function concat2(xs) {
      return function (ys) {
        return xs.concat(ys);
      };
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            return function (array) {
              function go(bot, top) {
                switch (top - bot) {
                case 0: return pure([]);
                case 1: return map(array1)(f(array[bot]));
                case 2: return apply(map(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3: return apply(apply(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  // This slightly tricky pivot selection aims to produce two
                  // even-length partitions where possible.
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply(map(concat2)(go(bot, pivot)))(go(pivot, top));
                }
              }
              return go(0, array.length);
            };
          };
        };
      };
    };
  }();
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Traversable"] = $PS["Data.Traversable"] || {};
  var exports = $PS["Data.Traversable"];
  var $foreign = $PS["Data.Traversable"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Category = $PS["Control.Category"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];                                                      
  var Traversable = function (Foldable1, Functor0, sequence, traverse) {
      this.Foldable1 = Foldable1;
      this.Functor0 = Functor0;
      this.sequence = sequence;
      this.traverse = traverse;
  };
  var traverse = function (dict) {
      return dict.traverse;
  }; 
  var sequenceDefault = function (dictTraversable) {
      return function (dictApplicative) {
          return traverse(dictTraversable)(dictApplicative)(Control_Category.identity(Control_Category.categoryFn));
      };
  };
  var traversableArray = new Traversable(function () {
      return Data_Foldable.foldableArray;
  }, function () {
      return Data_Functor.functorArray;
  }, function (dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
  }, function (dictApplicative) {
      return $foreign.traverseArrayImpl(Control_Apply.apply(dictApplicative.Apply0()))(Data_Functor.map((dictApplicative.Apply0()).Functor0()))(Control_Applicative.pure(dictApplicative));
  });
  var sequence = function (dict) {
      return dict.sequence;
  };
  exports["Traversable"] = Traversable;
  exports["traverse"] = traverse;
  exports["sequence"] = sequence;
  exports["sequenceDefault"] = sequenceDefault;
  exports["traversableArray"] = traversableArray;
})(PS);
(function(exports) {
  "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Effect"] = PS["Effect"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect"] = $PS["Effect"] || {};
  var exports = $PS["Effect"];
  var $foreign = $PS["Effect"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];                
  var monadEffect = new Control_Monad.Monad(function () {
      return applicativeEffect;
  }, function () {
      return bindEffect;
  });
  var bindEffect = new Control_Bind.Bind(function () {
      return applyEffect;
  }, $foreign.bindE);
  var applyEffect = new Control_Apply.Apply(function () {
      return functorEffect;
  }, Control_Monad.ap(monadEffect));
  var applicativeEffect = new Control_Applicative.Applicative(function () {
      return applyEffect;
  }, $foreign.pureE);
  var functorEffect = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEffect));
  var semigroupEffect = function (dictSemigroup) {
      return new Data_Semigroup.Semigroup(Control_Apply.lift2(applyEffect)(Data_Semigroup.append(dictSemigroup)));
  };
  var monoidEffect = function (dictMonoid) {
      return new Data_Monoid.Monoid(function () {
          return semigroupEffect(dictMonoid.Semigroup0());
      }, $foreign.pureE(Data_Monoid.mempty(dictMonoid)));
  };
  exports["functorEffect"] = functorEffect;
  exports["applyEffect"] = applyEffect;
  exports["applicativeEffect"] = applicativeEffect;
  exports["bindEffect"] = bindEffect;
  exports["monadEffect"] = monadEffect;
  exports["semigroupEffect"] = semigroupEffect;
  exports["monoidEffect"] = monoidEffect;
})(PS);
(function(exports) {
  "use strict";

  exports.new = function (val) {
    return function () {
      return { value: val };
    };
  };

  exports.read = function (ref) {
    return function () {
      return ref.value;
    };
  };

  exports.write = function (val) {
    return function (ref) {
      return function () {
        ref.value = val;
        return {};
      };
    };
  };
})(PS["Effect.Ref"] = PS["Effect.Ref"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect.Ref"] = $PS["Effect.Ref"] || {};
  var exports = $PS["Effect.Ref"];
  var $foreign = $PS["Effect.Ref"];
  exports["new"] = $foreign["new"];
  exports["read"] = $foreign.read;
  exports["write"] = $foreign.write;
})(PS);
(function(exports) {
  
  var h =require("virtual-dom/h");
  var diff =require("virtual-dom/diff");
  var patch =require("virtual-dom/patch");
  var createElement =require("virtual-dom/create-element"); 

  // foreign import createRootNodeImpl :: ∀ e.
  //   Fn1 Tree (Eff ( createRootNode :: NODE | e ) Node)
  exports.createRootNodeImpl = function(tree) {
      return createElement(tree);
  };


  // foreign import textImpl :: ∀ e.
  //   Fn1 String (Eff e Tree)
  exports.textImpl = function(str) {
    return function() {
      return str;
    };
  };

  // foreign import renderImpl :: ∀ msg h e model.
  //   Fn3
  //     String
  //     NativeAttrs
  //     ( Eff ( st :: ST h | e ) (Array Tree) )
  //     ( Eff ( st :: ST h | e ) Tree )
  exports.renderImpl = function(tagName, attrs, childrenEff) {
    return function() {
      var children = childrenEff();
      return h(tagName, attrs, children);
    };
  };

  // foreign import patchImpl :: ∀ e h.
  //   Fn3 Tree Tree Node Eff ( st :: ST h | e ) Node
  exports.patchImpl = function(newTree, oldTree, rootNode) {
    return function() {
      var patches = diff(oldTree, newTree);
      var newRoot = patch(rootNode, patches);
      return newRoot;
    };
  };


  // foreign import concatHandlerFunImpl :: ∀ eff event.
  //   Fn3 String (event -> eff) NativeAttrs NativeAttrs
  exports.concatHandlerFunImpl = function(name, msgHandler, rest) {
    var result = Object.assign({}, rest);
    result[name] = function(event) {
      msgHandler(event)();
    };
    return result;
  };

  // foreign import concatEventTargetValueHandlerFunImpl :: ∀ eff event.
  //   Fn3 String (event -> eff) NativeAttrs NativeAttrs
  exports.concatEventTargetValueHandlerFunImpl = function(name, msgHandler, rest) {
    var result = Object.assign({}, rest);
    result[name] = function(event) {
      msgHandler(String(event.target.value))();
    };
    return result;
  };


  // foreign import concatSimpleAttrImpl :: ∀ eff event.
  //   Fn3 String String NativeAttrs NativeAttrs
  exports.concatSimpleAttrImpl = function(name, value, rest) {
    var result = Object.assign({}, rest);
    result[name] = value;
    return result;
  };


  // foreign import concatBooleanAttrImpl ::
  //   Fn3 String Boolean NativeAttrs NativeAttrs
  exports.concatBooleanAttrImpl = function(name, b, rest) {
    if(b) {
      var result = Object.assign({}, rest);
      result[name] = name;
      return result;
    } else {
      return rest;
    };
  };


  // foreign import concatDataAttrImpl ::
  //   Fn3 String String NativeAttrs NativeAttrs
  exports.concatDataAttrImpl = function(name, val, rest) {
    var result = Object.assign({}, rest);
    var attributes = Object.assign({}, rest.attributes);
    attributes[name] = val;
    result.attributes = attributes;
    return result;
  };


  // foreign import emptyAttrs :: NativeAttrs
  exports.emptyAttrs = function() {
    return {};
  };
})(PS["Oak.VirtualDom.Native"] = PS["Oak.VirtualDom.Native"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.VirtualDom.Native"] = $PS["Oak.VirtualDom.Native"] || {};
  var exports = $PS["Oak.VirtualDom.Native"];
  var $foreign = $PS["Oak.VirtualDom.Native"];
  var Data_Function_Uncurried = $PS["Data.Function.Uncurried"];                
  var text = Data_Function_Uncurried.runFn1($foreign.textImpl);
  var render = Data_Function_Uncurried.runFn3($foreign.renderImpl);
  var patch = Data_Function_Uncurried.runFn3($foreign.patchImpl);
  var createRootNode = Data_Function_Uncurried.runFn1($foreign.createRootNodeImpl);
  var concatSimpleAttr = Data_Function_Uncurried.runFn3($foreign.concatSimpleAttrImpl);
  var concatHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatHandlerFunImpl);
  var concatEventTargetValueHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatEventTargetValueHandlerFunImpl);
  var concatDataAttr = Data_Function_Uncurried.runFn3($foreign.concatDataAttrImpl);
  var concatBooleanAttr = Data_Function_Uncurried.runFn3($foreign.concatBooleanAttrImpl);
  exports["patch"] = patch;
  exports["createRootNode"] = createRootNode;
  exports["concatSimpleAttr"] = concatSimpleAttr;
  exports["concatBooleanAttr"] = concatBooleanAttr;
  exports["concatDataAttr"] = concatDataAttr;
  exports["concatHandlerFun"] = concatHandlerFun;
  exports["concatEventTargetValueHandlerFun"] = concatEventTargetValueHandlerFun;
  exports["text"] = text;
  exports["render"] = render;
  exports["emptyAttrs"] = $foreign.emptyAttrs;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.VirtualDom"] = $PS["Oak.VirtualDom"] || {};
  var exports = $PS["Oak.VirtualDom"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Effect = $PS["Effect"];
  var Oak_Html = $PS["Oak.Html"];
  var Oak_Html_Attribute = $PS["Oak.Html.Attribute"];
  var Oak_VirtualDom_Native = $PS["Oak.VirtualDom.Native"];                
  var stringifyStyle = function (v) {
      return v.value0 + (":" + v.value1);
  };
  var stringifyStyles = function (attrs) {
      return Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(";")(Data_Functor.map(Data_Functor.functorArray)(stringifyStyle)(attrs));
  };
  var patch = function (oldTree) {
      return function (newTree) {
          return function (maybeRoot) {
              var root = Data_Maybe.fromJust()(maybeRoot);
              return Oak_VirtualDom_Native.patch(oldTree)(newTree)(root);
          };
      };
  };
  var concatAttr = function (handler) {
      return function (v) {
          return function (attrs) {
              if (v instanceof Oak_Html_Attribute.EventHandler) {
                  return Oak_VirtualDom_Native.concatHandlerFun(v.value0)(function (v1) {
                      return handler(v.value1);
                  })(attrs);
              };
              if (v instanceof Oak_Html_Attribute.StringEventHandler) {
                  return Oak_VirtualDom_Native.concatEventTargetValueHandlerFun(v.value0)(function (e) {
                      return handler(v.value1(e));
                  })(attrs);
              };
              if (v instanceof Oak_Html_Attribute.SimpleAttribute) {
                  return Oak_VirtualDom_Native.concatSimpleAttr(v.value0)(v.value1)(attrs);
              };
              if (v instanceof Oak_Html_Attribute.Style) {
                  return Oak_VirtualDom_Native.concatSimpleAttr("style")(stringifyStyles(v.value0))(attrs);
              };
              if (v instanceof Oak_Html_Attribute.BooleanAttribute) {
                  return Oak_VirtualDom_Native.concatBooleanAttr(v.value0)(v.value1)(attrs);
              };
              if (v instanceof Oak_Html_Attribute.DataAttribute) {
                  return Oak_VirtualDom_Native.concatDataAttr(v.value0)(v.value1)(attrs);
              };
              if (v instanceof Oak_Html_Attribute.KeyPressEventHandler) {
                  return Oak_VirtualDom_Native.concatHandlerFun(v.value0)(function (e) {
                      return handler(v.value1(e));
                  })(attrs);
              };
              throw new Error("Failed pattern match at Oak.VirtualDom (line 32, column 1 - line 36, column 21): " + [ handler.constructor.name, v.constructor.name, attrs.constructor.name ]);
          };
      };
  };
  var combineAttrs = function (attrs) {
      return function (handler) {
          return Data_Foldable.foldr(Data_Foldable.foldableArray)(concatAttr(handler))(Oak_VirtualDom_Native.emptyAttrs)(attrs);
      };
  };
  var render = function (h) {
      return function (v) {
          if (v instanceof Oak_Html.Tag) {
              return Oak_VirtualDom_Native.render(v.value0)(combineAttrs(v.value1)(h))(Data_Traversable.sequence(Data_Traversable.traversableArray)(Effect.applicativeEffect)(Data_Functor.map(Data_Functor.functorArray)(render(h))(v.value2)));
          };
          if (v instanceof Oak_Html.Text) {
              return Oak_VirtualDom_Native.text(v.value0);
          };
          throw new Error("Failed pattern match at Oak.VirtualDom (line 24, column 1 - line 27, column 21): " + [ h.constructor.name, v.constructor.name ]);
      };
  };
  exports["render"] = render;
  exports["concatAttr"] = concatAttr;
  exports["stringifyStyle"] = stringifyStyle;
  exports["stringifyStyles"] = stringifyStyles;
  exports["combineAttrs"] = combineAttrs;
  exports["patch"] = patch;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak"] = $PS["Oak"] || {};
  var exports = $PS["Oak"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Effect = $PS["Effect"];
  var Effect_Ref = $PS["Effect.Ref"];
  var Oak_VirtualDom = $PS["Oak.VirtualDom"];
  var Oak_VirtualDom_Native = $PS["Oak.VirtualDom.Native"];                
  var RunningApp = (function () {
      function RunningApp(value0) {
          this.value0 = value0;
      };
      RunningApp.create = function (value0) {
          return new RunningApp(value0);
      };
      return RunningApp;
  })();
  var App = (function () {
      function App(value0) {
          this.value0 = value0;
      };
      App.create = function (value0) {
          return new App(value0);
      };
      return App;
  })();
  var handler = function (ref) {
      return function (runningApp) {
          return function (msg) {
              return function __do() {
                  var v = Effect_Ref.read(ref)();
                  var oldTree = Data_Maybe.fromJust()(v.tree);
                  var root = Data_Maybe.fromJust()(v.root);
                  var newModel = runningApp.value0.update(msg)(v.model);
                  var v1 = Oak_VirtualDom.render(handler(ref)(runningApp))(runningApp.value0.view(newModel))();
                  var v2 = Oak_VirtualDom.patch(v1)(oldTree)(v.root)();
                  var newRuntime = {
                      root: new Data_Maybe.Just(v2),
                      tree: new Data_Maybe.Just(v1),
                      model: newModel
                  };
                  Effect_Ref.write(newRuntime)(ref)();
                  runningApp.value0.next(msg)(newModel)(handler(ref)(runningApp))();
                  return Data_Monoid.mempty(Effect.monoidEffect(Data_Monoid.monoidUnit))();
              };
          };
      };
  };
  var runApp_ = function (v) {
      return function (flags) {
          var runningApp = {
              view: v.value0.view,
              next: v.value0.next,
              update: v.value0.update
          };
          var initialModel = v.value0.init(flags);
          return function __do() {
              var v1 = Effect_Ref["new"]({
                  tree: Data_Maybe.Nothing.value,
                  root: Data_Maybe.Nothing.value,
                  model: initialModel
              })();
              var v2 = Oak_VirtualDom.render(handler(v1)(new RunningApp(runningApp)))(runningApp.view(initialModel))();
              var rootNode = Oak_VirtualDom_Native.createRootNode(v2);
              var v3 = Effect_Ref.write({
                  tree: new Data_Maybe.Just(v2),
                  root: new Data_Maybe.Just(rootNode),
                  model: initialModel
              })(v1)();
              return rootNode;
          };
      };
  };
  var runApp = function (app) {
      return function (flags) {
          return runApp_(app)(flags);
      };
  };
  var createApp = function (opts) {
      return new App({
          init: opts.init,
          view: opts.view,
          next: opts.next,
          update: opts.update
      });
  };
  exports["createApp"] = createApp;
  exports["runApp"] = runApp;
})(PS);
(function(exports) {
  exports.getElementByIdImpl = function(id) {
    return function() {
      var container = document.getElementById(id);
      if (container == null) {
        throw(new Error("Unable to find element with ID: " + id));
      };

      return container;
    };
  };

  exports.appendChildNodeImpl = function(container) {
    return function(rootNode) {
      return function() {
        container.appendChild(rootNode);
      };
    };
  };
})(PS["Oak.Document"] = PS["Oak.Document"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.Document"] = $PS["Oak.Document"] || {};
  var exports = $PS["Oak.Document"];
  var $foreign = $PS["Oak.Document"];
  var Data_Function_Uncurried = $PS["Data.Function.Uncurried"];                
  var getElementById = Data_Function_Uncurried.runFn1($foreign.getElementByIdImpl);
  var appendChildNode = function (element) {
      return function (rootNode) {
          return $foreign.appendChildNodeImpl(element)(rootNode);
      };
  };
  exports["appendChildNode"] = appendChildNode;
  exports["getElementById"] = getElementById;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Oak.Css"] = $PS["Oak.Css"] || {};
  var exports = $PS["Oak.Css"];
  var StyleAttribute = (function () {
      function StyleAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      StyleAttribute.create = function (value0) {
          return function (value1) {
              return new StyleAttribute(value0, value1);
          };
      };
      return StyleAttribute;
  })();
  var right = function (val) {
      return new StyleAttribute("right", val);
  };
  var position = function (val) {
      return new StyleAttribute("position", val);
  };
  var padding = function (val) {
      return new StyleAttribute("padding", val);
  };
  var overflow = function (val) {
      return new StyleAttribute("overflow", val);
  };
  var maxHeight = function (val) {
      return new StyleAttribute("max-height", val);
  };
  var margin = function (val) {
      return new StyleAttribute("margin", val);
  };
  var listStyleType = function (val) {
      return new StyleAttribute("list-style-type", val);
  };
  var cursor = function (val) {
      return new StyleAttribute("cursor", val);
  };
  var bottom = function (val) {
      return new StyleAttribute("bottom", val);
  };
  exports["StyleAttribute"] = StyleAttribute;
  exports["bottom"] = bottom;
  exports["cursor"] = cursor;
  exports["listStyleType"] = listStyleType;
  exports["margin"] = margin;
  exports["maxHeight"] = maxHeight;
  exports["overflow"] = overflow;
  exports["padding"] = padding;
  exports["position"] = position;
  exports["right"] = right;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Styles"] = $PS["Styles"] || {};
  var exports = $PS["Styles"];
  var Oak_Css = $PS["Oak.Css"];
  var Oak_Html_Attribute = $PS["Oak.Html.Attribute"];                
  var ul = Oak_Html_Attribute.style([ Oak_Css.listStyleType("none"), Oak_Css.padding("0"), Oak_Css.margin("0") ]);
  var li = Oak_Html_Attribute.style([ Oak_Css.padding("0"), Oak_Css.cursor("pointer"), Oak_Css.margin("0") ]);
  var container = Oak_Html_Attribute.style([ Oak_Css.position("fixed"), Oak_Css.right("0"), Oak_Css.bottom("0"), Oak_Css.padding("5px"), Oak_Css.maxHeight("100vh"), Oak_Css.overflow("auto") ]);
  exports["container"] = container;
  exports["ul"] = ul;
  exports["li"] = li;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Main"] = $PS["Main"] || {};
  var exports = $PS["Main"];
  var Child = $PS["Child"];
  var Data_Array = $PS["Data.Array"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];
  var Data_Show = $PS["Data.Show"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Oak = $PS["Oak"];
  var Oak_Document = $PS["Oak.Document"];
  var Oak_Html = $PS["Oak.Html"];
  var Oak_Html_Present = $PS["Oak.Html.Present"];
  var Styles = $PS["Styles"];                
  var Wrap = (function () {
      function Wrap(value0) {
          this.value0 = value0;
      };
      Wrap.create = function (value0) {
          return new Wrap(value0);
      };
      return Wrap;
  })();
  var update = function (msg) {
      return function (model) {
          return {
              msgs: Data_Semigroup.append(Data_Semigroup.semigroupArray)(model.msgs)([ msg.value0 ]),
              cmodel: Child.update(msg.value0)(model.cmodel)
          };
      };
  };
  var showMsg = function (msg) {
      return Oak_Html.li([ Styles.li ])([ Oak_Html.text(Oak_Html_Present.presentString)(Data_Show.show(Child.showMsg)(msg)) ]);
  };
  var view = function (model) {
      return Oak_Html.div([  ])([ Data_Functor.map(Oak_Html.htmlFunctor)(Wrap.create)(Child.view(model.cmodel)), Oak_Html.div([ Styles.container ])([ Oak_Html.ul([ Styles.ul ])(Data_Functor.map(Data_Functor.functorArray)(showMsg)(model.msgs)), Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentString)(Data_Show.show(Data_Show.showInt)(Data_Array.length(model.msgs)) + " messages") ]) ]) ]);
  };
  var next = function (v) {
      return function (v1) {
          return function (v2) {
              return Data_Monoid.mempty(Effect.monoidEffect(Data_Monoid.monoidUnit));
          };
      };
  };
  var init = function (v) {
      return {
          msgs: [  ],
          cmodel: Child.init(Data_Unit.unit)
      };
  };
  var app = Oak.createApp({
      init: init,
      view: view,
      update: update,
      next: next
  });
  var main = function __do() {
      var v = Oak.runApp(app)(Data_Unit.unit)();
      var v1 = Oak_Document.getElementById("app")();
      return Oak_Document.appendChildNode(v1)(v)();
  };
  exports["main"] = main;
})(PS);
PS["Main"].main();
},{"virtual-dom/create-element":8,"virtual-dom/diff":9,"virtual-dom/h":10,"virtual-dom/patch":11}]},{},[35]);
