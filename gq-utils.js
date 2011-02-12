/*globals window, alert, CSSRule, XMLSerializer,         $P, PHP_JS, GQ */
// PHP_JS must be defined earlier

// CONTENTS
/*
// IF NOT DEFINED...
1) JSON (if not defined)

// VERY FREQUENT GLOBALS (use $)
2) Take over $ from jQuery for our own simple wrapper, and reset it to $J
3) _$ (internationalization/localization--use for all user-facing strings; may consider as wrapper for dojo.i18n.getLocalization; dojo.date, dojo.number, dojo.currency)
4) $E (faster alternative to jQuery $; compare dojo.query)
(will also use $J for jQuery, $D for Dojo, $P for php.js if files present preceding this file and
the corresponding var is not already set)

// USEFUL AND FREQUENT BUT NOT CONSTANTLY (NOR MABYE PERMANENTLY)-USED,
//   SO PUTTING IN GQ NAMESPACE
5) GQ.Namespace function (use for creating any namespaces; use dojo.declare/dojo.provide instead if using dojo)
6) GQ.DOM (If these methods are available in Dojo, use there instead, or if not, propose as additions to Dojo?)
7) GQ.Network (Probably won't use later; use Dojo.xhrGet, dojo.iframe, dojo.script instead)
8) GQ.JSON (Probably won't use later; let server serve proper JSON instead)

// FREQUENT DEBUGGING-ONLY GLOBALS
8) Debugging use only: ser, aser (serialize XML)
9) Debugging use only: whatIs (alert object's properties)
10) Debugging use only: d (debugging alert or console);
*/

// JSON
/* Add JSON parser and stringifier if not built-in */
if(!this.JSON){this.JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

if (window.location.href.match(/(?:\?|&)debug/)) {
    var script = document.createElement('script');
    //script.src = "https://getfirebug.com/firebug-lite.js";
    script.src = "/AMEngine/js/firebug-lite-dev.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

 var GQ = {};
/*
Adapted from....
Script: Namespace.js
	Namespace utility
Copyright:
	Copyright (c) 2009 Maxime Bouroumeau-Fuseau
License:
	MIT-style license.
Version:
	1.1
Link:
        http://code.google.com/p/namespacedotjs/
*/
GQ.Namespace = function Namespace (identifier) {
	var klasses = arguments[1] || false;
	var ns = window;
	if (identifier != '') {
		var parts = identifier.split('.'); // Namespace.separator
		for (var i = 0; i < parts.length; i++) {
			if (!ns[parts[i]]) {
				ns[parts[i]] = {};
			}
			ns = ns[parts[i]];
		}
	}
	if (klasses) {
		for (var klass in klasses) {
			if (klasses.hasOwnProperty(klass)) {
				ns[klass] = klasses[klass];
			}
		}
	}
	// _dispatchEvent('create', { 'identifier': identifier });
	return ns;
};

var $P;
if (window.PHP_JS && !window.$P) {
	$P = new PHP_JS();
}

var $D;
if (window.dojo && !window.$D) {
	$D = dojo;
}

var $J;
if (window.jQuery && !window.$J) {
	$J = jQuery.noConflict();
}

/**
 * Gets an element by ID
 * @param {String} id The ID of the element to get
 * @returns {DOMElement} The element
 */
// If not using jQuery (could also check and use document.querySelector when implemented
// For now, using $J in place of $ for real jQuery

var $ = function (id) {
    id = id.replace(/^#/g, '');
    return document.getElementById(id);
};

(function () {


/**
 * Provide a localized string for a given key
 * Files using this function may be scanned to obtain all of the strings needing localization
 * @param {String|String[]} keyVal The key used to find the localized value; will itself be used as the value
 *                                                          if not found on the object; the value may also be a format specifier;
 *                                                          can also be a a two-item array with the key as the first item and the
 *                                                          default (e.g., English) as the second item. If the default allows plurals, the
 *                                                          second item can be an array suitable for each successive plural form:
 *                                                          see http://phpjs.org/functions/setlocale:589 and
 *                                                          http://developer.mozilla.org/En/Localization_and_Plurals
 * @param {String[]} [args] An optional array of arguments to insert within the text
 * @param {String} [desc] A description of the function of the localized string; an aid to translators
 *                                      who might not know how the string is being used; this argument can also come after opts
 * @param {Object} [opts] Object with configuration properties:
 *                                                  1) type:
 *                                                      a) 'normal' (sprintf) [DEFAULT]
 *                                                      b) 'money' (money_format)
 *                                                      c) 'time' or 'date' (strftime)
 *                                                      d) 'number' (number_format) (decimals, dec point, thousands sep); unlike
 *                                                          number_format, the default dec point and thousands sep will be locale-specific
 *                                                  2) desc: Optional replacement for desc argument
 * @x-todo Add a property to the object to allow a specific locale to be used
 * @example _$('something to translate');
 * @example _$(['sthToTranslate', 'something to translate']);
 * @example _$('The %2$s contains %1$d monkeys', [13, 'zoo']);
 * @example _$(['monkeysInZoo', 'The %2$s contains %1$d monkeys'], [13, 'zoo']);
 * @example _$(['auto', ['car', 'cars']], [3]); // 'cars' by default
 * @example _$(['auto', ['car', 'cars']], 3, 'This will be the word we use for cars'); // 'cars' by default
 * @example _$(['payments', '%14#8.2n'], [132.14], {type:'money'});
 * @example _$(['appointmentDate', '%m-%d-%Y %H:%M:%S'], [132123311], {type:'time'});
 * @example _$(['count', 3], [123.131231], {type:'number'});
 */
function _$ (keyVal, args, desc, opts) {
    var key, value, values, tmpOpts;

    var locale = 'en'; /* Could get dynamically from navigator.language, $P.php_js.locale, etc. */
    var localeInfo = { /* Could get from a file, etc. */
        en: {}
    };

    if (typeof args === 'string') { /* 2nd arg is description */
        opts = desc;
        desc = args;
        args = null;
    }
    else if (typeof args === 'number') {
        args = [args]; /* We can't allow strings, as will be ambiguous, but numbers can be outside of an array */
    }
    else if (typeof args === 'object' && args !== null && typeof args.length !== 'number') { /* 2nd arg is options */
        tmpOpts = opts;
        opts = args;
        desc = tmpOpts || null; /* We allow description to be at the end */
        args = null;
    }
    else if (typeof desc === 'object') { /* 3rd argument is options */
        tmpOpts = opts;
        opts = desc;
        desc = tmpOpts || null; /* We allow description to be at the end */
    }
    if (opts && opts.desc) { /* Has priority over string description, but not if specified on first argument */
        desc = opts.desc;
    }

    if (typeof keyVal === 'object' && keyVal !== null && typeof keyVal.length !== 'number') {
        opts = keyVal.opts;
        desc = keyVal.desc;
        args = keyVal.args;
        key = keyVal.key;
        value = keyVal.value;
        values = keyVal.values;
    }
    else if (typeof keyVal === 'string') { /* Key is the value */
        key = keyVal;
        value = (localeInfo[locale] && localeInfo[locale][key]) || keyVal;
    }
    else if (typeof keyVal[1] === 'object') { /* Plurals; keyVal[0] is the key, with keyVal[1] as the array of plural forms */
        key = keyVal[0];
        values = (localeInfo[locale] && localeInfo[locale][key]) || keyVal;
    }
    else { /* keyVal[0] is the key and keyVal[1] is not a plural but the actual value */
        key = keyVal[0];
        value = (localeInfo[locale] && localeInfo[locale][key]) || keyVal[1];
    }
    if (!args) { /* Might still allow options in the future */
        return value; /* Won't be an array of plurals, since no args */
    }
    else if (values) {
        $P.setlocale();
        var index = $P.php_js.locales[locale].nplurals(args[0]);
        return values[index];
    }
    else if (opts) {
        switch (opts.type) {
            case 'normal':
                return $P.sprintf.apply(null, [].concat(value, args));
            case 'money':
               return $P.money_format(value, args[0]);
            case 'date': case 'time':
                return $P.strftime(value, args[0]);
            case 'number':
                $P.setlocale();
                return $P.number_format(value, opts.decimals,
                                                                opts.dec_point || $P.php_js.locales[locale].LC_NUMERIC.decimal_point,
                                                                opts.thousands_sep || $P.php_js.locales[locale].LC_NUMERIC.thousands_sep);
        }
    }
    else { /* args only */
        return $P.sprintf.apply(null, [].concat(value, args));
    }
}

// EXPORT
this._$ = _$;
}());


(function () {

/* XHTML namespace */
var NS_HTML = 'http://www.w3.org/1999/xhtml';
/* PureShare namespace (for our own attributes) */
var NS_PS = 'http://pureshare.com/ns/types';


/**
 * Creates an XHTML or HTML element (XHTML is preferred, but only in browsers that support);
 * Any element after element can be omitted, and any subsequent type or types added afterwards
 * Depends on GQ.DOM.appendElement
 * @param {String} el The element to create (by lower-case name)
 * @param {Object} [atts] Attributes to add with the key as the attribute name and value as the
 *                                               attribute value; important for IE where the input element's type cannot
 *                                               be added later after already added to the page
 * @param {DOMElement[]} [children] The optional children of this element (but raw DOM elements
 *                                                                      required to be specified within arrays since
 *                                                                      could not otherwise be distinguished from siblings being added)
 * @param {DOMElement} [parent] The optional parent to which to attach the element (always the last
 *                                                                  unless followed by null, in which case it is the second-to-last)
 * @param {null} [returning] Can use null to indicate an array of elements should be returned
 * @returns {DOMElement} The newly created (and possibly already appended) element or array of elements
 */
/*
RULES
    1) Last element always the parent (put null if don't want but want to return) unless only atts and children (no other elements)
    2) Individual elements (DOM elements or sequences of string[/object/array]) get added to parent first-in, first-added
    3) Arrays or arrays of arrays always indicate children
    4) Strings always indicate elements
    5) Non-DOM-element objects always indicate attribute-value pairs
    6) null always indicates a place-holder (only needed in place of parent for last argument if want array returned)
    7) First item must be an element
    8) Always returns first created element, unless null as last argument, in which case, it returns an array of all added elements
*/

function $E () {
    var elem, elems = [], firstEl, elStr, atts, child = [], argc = arguments.length, argv = arguments,
		dom = GQ.DOM,
        _getType = function (item) {
            if (typeof item === 'string') {
                return 'string';
            }
            else if (typeof item === 'object') {
                if (item === null) {
                    return 'null';
                }
                else if (item.nodeType === 1) { /* Must come before array check */
                    return 'element';
                }
                else if (typeof item.length === 'number') {
                    return 'array';
                }
                else {
                    return 'object';
                }
            }
            throw 'Unknown type passed to $E';
        };
    for (var i = 0; i < argc; i++) {
        var arg = argv[i];
        switch (_getType(arg)) {
            case 'null': /* null always indicates a place-holder (only needed for last argument if want array returned) */
                if (i === argc - 1) {
                    return elems.length <= 1 ? elem : elems;
                }
                break;
            case 'string': /* Strings always indicate elements (unless empty, then ignore) */
                if (arg === '') {
                    continue;
                }
                elStr = arg;
                if (document.createElementNS) {
                    elem = document.createElementNS(NS_HTML, elStr);
                }
                else {
                    elem = document.createElement(elStr);
                }
                if (i === 0) {
                    firstEl = elem;
                }
                elems[elems.length] = elem; /* Add to parent */
                break;
            case 'object': /* Non-DOM-element objects always indicate attribute-value pairs */
                atts = arg;
                for (var p in atts) {
                    if (atts.hasOwnProperty(p)) {
                        switch(p) {
                            case 'className': case 'c':
                                elem.className = atts[p];
                                break;
                            case 'innerHTML': case 'i' : case 'h' : case 'ih':
                                if (elem.nodeName.toLowerCase() === 'textarea') {
                                    elem.value = atts[p];
                                }
                                else {
                                    elem.innerHTML = atts[p];
                                }
                                break;
                            case 'selected' : case 'checked':
                                if (!p) {
                                    break;
                                } /* Fall-through */
                            case 'value':
                                elem[p] = atts[p];
                                break;
                            case 'event': /* Could alternatively allow specific event names like 'change' or 'onchange'; could also alternatively allow object inside instead of array*/
                                GQ.DOM.addEvent(elem, atts[p][0], atts[p][1], atts[p][2]); /* element, event name, handler, capturing */
                                break;
                            case 'nsAtt':
                                GQ.DOM.setCustomAttribute(elem, atts[p]);
                                break;
                            case 'float':
                                elem.cssFloat = atts[p];
                                elem.styeFloat = atts[p]; /* IE */
                                break;
                            case 'textContent': case 'text': case 't':
                                var textnode = document.createTextNode(atts[p]);
                                elem.appendChild(textnode);
                                break;
                            case 'htmlFor': case 'f': case 'hf':
                                if (elStr === 'label') {
                                    elem.htmlFor = atts[p];
                                    break;
                                }
                                /* Fall-through */
                            default:
                                elem.setAttribute(p, atts[p]);
                                break;
                        }
                    }
                }
                break;
            case 'element':
/*
1) Last element always the parent (put null if don't want parent and want to return array) unless only atts and children (no other elements)
2) Individual elements (DOM elements or sequences of string[/object/array]) get added to parent first-in, first-added
*/
                if (i === argc - 1 || (i === argc - 2 && argv[i+1] === null)) { /* parent */
                    for (var k = 0, elsl = elems.length; k < elsl; k++) {
                        dom.appendElement(arg, elems[k]);
                    }
                }
                else {
                    elems[elems.length] = arg;
                }
                break;
            case 'array': /* Arrays or arrays of arrays always indicate children */
                child = arg;
                if (typeof child === 'object' && typeof child.length === 'number' && typeof child[0] === 'string') { /* Just one child (as an array), so no need for inner array */
                    dom.appendElement(elem, $E.apply(null, child));
                }
                else {
                    for (var j = 0, cl = child.length; j < cl; j++) { /* Go through children array container to handle elements */
                        if (typeof child[j] === 'object' && typeof child[j].length === 'number' && child[j].nodeType !== 1) { /* arrays representing child elements */
                            dom.appendElement(elem, $E.apply(null, child[j]));
                        }
                        else { /* single DOM element children */
                            dom.appendElement(elem, child[j]);
                        }
                    }
                }
                break;
        }
    }
    return firstEl;
}


/**
 * Creates a layout object (for adding different children)
 * Any param after layout can be omitted, and any subsequent type or types added afterwards
 * @param {dijit.layout} layout The layout to create
 * @param {dijit.layout[]|DOMElement} [children] The optional children of this element (but raw layout objects
 *                                                                      required to be specified within arrays since
 *                                                                      could not otherwise be distinguished from siblings being added)
 * @param {DOMElement} [parent] The optional parent to which to attach the layout's element (always the last
 *                                                                  unless followed by null, in which case it is the second-to-last)
 * @param {null} [returning] Can use null to indicate an array of layout objects should be returned instead of the
 *                                                  first layout object only
 * @returns {dijit.layout} The newly created (and possibly already appended) layout objects or array of layout objects
 */
/*
RULES
    1) Last element always the parent (put null if don't want but want to return) unless only children (no other elements)
    2) Arrays or arrays of arrays always indicate children (of layout objects or DOM nodes)
    3) (Non-DOM) objects always indicate layout objects
    4) null always indicates a place-holder (only needed in place of parent for last argument if want array returned)
    5) First item must be a layout object
    6) Always returns first created layout object, unless null as last argument, in which case, it returns an array of all added layout objects
*/
function $L () {
    var layout, layouts = [], dom = GQ.DOM, firstLayoutObj, child = [], argc = arguments.length, argv = arguments,
        _getType = function (item) {
            if (typeof item === 'string') {
                return 'string';
            }
            else if (typeof item === 'object') {
                if (item === null) {
                    return 'null';
                }
                else if (item.nodeType === 1) { /* Must come before array check */
                    return 'element';
                }
				else if (item.nodeType === 9) {
					return 'document';
				}
                else if (typeof item.length === 'number') {
                    return 'array';
                }
                else {
                    return 'object';
                }
            }
            throw 'Unknown type passed to $E';
        };

    for (var i = 0; i < argc; i++) {
        var arg = argv[i];
        switch (_getType(arg)) {
            case 'null': /* null always indicates a place-holder (only needed for last argument if want array returned) */
                if (i === argc - 1) {
                    return layouts.length <= 1 ? layout : layouts;
                }
                break;
            case 'string':
                var layoutName = arg;
                break;
            case 'object':
                layout = $dl(layoutName, arg);
                if (i === 1) {
                    firstLayoutObj = layout;
                }
                layouts[layouts.length] = layout;
                break;
			case 'document':
				arg = arg.body;
            case 'element':
/*
1) Last element always the parent (put null if don't want parent and want to return array) unless only atts and children (no other elements)
*/
                if (i === argc - 1 || (i === argc - 2 && argv[i+1] === null)) { /* parent */
                    for (var k = 0, elsl = layouts.length; k < elsl; k++) {
                        dom.appendElement(arg, layouts[k].domNode);
                    }
                }
                else {
                    layouts[layouts.length] = arg;
                }
                break;
            case 'array': /* Arrays or arrays of arrays always indicate children */
                child = arg;
                if (typeof child === 'object' && typeof child.length === 'number' && typeof child[0] === 'string') { /* Just one child (as an array), so no need for inner array */
                    var c = $L.apply(null, child);
                    layout.addChild(c);
                }
                else {
                    for (var j = 0, cl = child.length; j < cl; j++) { /* Go through children array container to handle elements */
                        if (typeof child[j] === 'object' && typeof child[j].length === 'number') { /* arrays representing child elements */
                            layout.addChild($L.apply(null, child[j]));
                        }
                        else { /* single layout children */
                            var objType = _getType(child[j]);
                            if (objType === 'element') { /* working? */
                                dom.appendElement(layout.domNode, child[j]);
                            }
                            else {
                                layout.addChild(child[j]);
                            }
                        }
                    }
                }
                break;
        }
    }
    return firstLayoutObj;
}

function $dl (layout, arg1, arg2, arg3, arg4) {
    // var o = {};
    // dijit.layout[layout].apply(o, Array.prototype.slice.call(arguments, 1));
    return new dijit.layout[layout](arg1, arg2, arg3, arg4);
    // return o;
}

GQ.Namespace('GQ.DOM');


/**
 * Attach event in a cross-browser fashion
 * @param {DOMElement} el DOM element to which to attach the event
 * @param {String} type The DOM event (without 'on') to attach to the element
 * @param {Function} handler The event handler to attach to the element
 * @param {Boolean} [capturing] Whether or not the event should be
 *                                                              capturing (W3C-browsers only); default is false; NOT IN USE
 */
GQ.DOM.addEvent = function(el, type, handler, capturing) {
    if (el.addEventListener) { /* W3C */
        el.addEventListener(type, handler, !!capturing);
    }
    else if (el.attachEvent) { /* IE */
        el.attachEvent('on'+type, handler);
    }
    else { /* OLDER BROWSERS (DOM0) */
        el['on'+type] = handler;
    }
};

/**
 * Prevent the default action of an element (e.g., so that a submit button
 *   doesn't submit the form with a page refresh, but can be used for Ajax);
 *   also prevents event from propagating further to other elementselem
 * @param {Event} e The DOM event to stop
 */
GQ.DOM.stopEvent = function(e) {
    if (e.stopPropagation) { /* W3C */
        e.stopPropagation();
        e.preventDefault();
     }
     else {
          window.event.cancelBubble = true;
          window.event.returnValue = false;
     }
};

/**
 * Needed this function for IE since options weren't otherwise getting added
 * @param {DOMElement} parent The parent to which to append the element
 * @param {DOMElement} el The element to append to the parent
 */
GQ.DOM.appendElement = function(parent, el) {
    if (parent.nodeName.toLowerCase() === 'select' && el.nodeName.toLowerCase() === 'option') {
        try {
            parent.add(el, null);
        }
        catch (err) {
            parent.add(el); /* IE */
        }
    }
    else {
        parent.appendChild(el);
    }
};

/**
 * Invoke FocusReader at start up and save for accessing getCurrentFocus or isFocused
 */
GQ.DOM.FocusReader = function FocusReader () {
    var self = this;
    this.currentFocus = null;
    GQ.DOM.addEvent(document, 'focus', function (e) {
        self.focusRead(e);
    }, true);
};
GQ.DOM.FocusReader.prototype.focusRead = function (e) {
    var target = e.target || e.srcElement;
    var nodeName = target.nodeName.toLowerCase();
    if (nodeName === 'textarea' || (nodeName === 'input' && target.type === 'text')) {
        this.latestTextFocus = target;
    }
    this.currentFocus = target;
};
GQ.DOM.FocusReader.prototype.getCurrentFocus = function () {
    return this.currentFocus;
};
GQ.DOM.FocusReader.prototype.getLatestTextFocus = function () {
    return this.latestTextFocus;
};
GQ.DOM.FocusReader.prototype.isLatestTextFocused = function (el) {
    return this.latestTextFocus === el;
};
GQ.DOM.FocusReader.prototype.isFocused = function (el) {
    return this.currentFocus === el;
};
GQ.DOM.Focus = new GQ.DOM.FocusReader(); // For now, we assume we always want it for the current document


/**
 * Search for a particular CSS (style) rule's property value (could be expanded to
 *   search for other rule information)
 * @param {String} selectorText The text of the selector for which to search
 * @param {String} propertyName The name of the property whose value will be obtained
 * @param {Number} sheet The zero-based index for indicating the stylesheet number to use
 * @returns {String|false} The property value or false if not found
 */
GQ.DOM.getCSSPropertyValue = function (selectorText, propertyName, sheet) {
    var i = 0, j = 0, dsl = 0, crl = 0, ss,
        _getPropertyFromStyleSheet =
            /**
             * @param {CSSStyleSheet} ss The stylesheet object on which to find the rules
             * @param {String} selectorText The text of the selector for which to search
             * @param {String} propertyName The name of the property whose value will be obtained
             * @returns {String|false} The property value or false if not found
             */
            function (ss, selectorText, propertyName) {
                var rules = ss.cssRules ? ss.cssRules : ss.rules; /* Mozilla or IE */
                for (j = 0, crl = rules.length; j < crl; j++) {
                    var rule = rules[j];
                    try {
                        if (rule.type === CSSRule.STYLE_RULE && rule.selectorText === selectorText) {
                            return rule.style.getPropertyValue(propertyName);
                        }
                    }
                    catch (err) { /* IE */
                        if (rule.selectorText === selectorText) {
                            /*
                             * e.g., turn background-color to backgroundColor
                             * Fix: other tests needed?
                            */
                            propertyName = propertyName.replace(/-([a-z])/g, function (str, n1) {
                                return n1.toUpperCase();
                            });
                            return rule.style[propertyName];
                        }
                    }
                }
                return false;
            };

    if (typeof sheet !== 'undefined') {
        ss = document.styleSheets[sheet];
        return _getPropertyFromStyleSheet(ss, selectorText, propertyName);
    }
	var value;
    for (i = 0, dsl = document.styleSheets.length; i < dsl; i++) {
        ss = document.styleSheets[i];
        value = _getPropertyFromStyleSheet(ss, selectorText, propertyName);
        if (value) {
            break;
        }
    }
    return value;
};


/**
 * Sets an attribute, with preference to namespacing the attribute
 *   in our own namespace if supported by the browser; avoids potential
 *   conflicts if an attribute is later defined in HTML with the same name
 * @param {DOMElement} el The element on which to set an attribute
 * @param {String} attr The attribute name used for setting
 * @param {String} value The value to set on the attribute
 * @returns {DOMElement} The element passed in and whose attribute was set
 */
GQ.DOM.setCustomAttribute = function (el, attr, value) {
    var att;
    if (el.setAttributeNS) {
        if (typeof attr === 'object' && typeof attr.length === 'number') {
            el.setAttributeNS(NS_PS, attr[0], attr[1]);
        }
        else if (typeof attr === 'object') {
            for (att in attr) {
                if (attr.hasOwnProperty(att)) {
                    el.setAttributeNS(NS_PS, att, attr[att]);
                }
            }
        }
        else {
            el.setAttributeNS(NS_PS, attr, value);
        }
    }
    else {
        if (typeof attr === 'object' && typeof attr.length === 'number') {
            el.setAttribute(attr[0], attr[1]);
        }
        else if (typeof attr === 'object') {
            for (att in attr) {
                if (attr.hasOwnProperty(att)) {
                    el.setAttribute(att, attr[att]);
                }
            }
        }
        else {
            el.setAttribute(attr, value);
        }
    }
    return el;
};

/**
 * Get an attribute value by its name, with preference for our own namespaced
 *   attribute, if supported by the browser
 * @param {DOMElement} el The element on which to get an attribute
 * @param {String} attr The attribute name used for getting
 * @returns {String} The value of the attribute
 */
GQ.DOM.getCustomAttribute = function (el, attr) {
    if (el.getAttributeNS) {
        return el.getAttributeNS(NS_PS, attr);
    }
    return el.getAttribute(attr);
};

// EXPORT
this.$E = $E;
this.$L = $L;
this.$dl = $dl;

}());


GQ.Namespace('GQ.Network');
/**
 * Encode a URI request (for a query string)
 * @param {Object} vars An object of key-value pairs to add to a URI request
 * @param {Boolean} [escQuotes] Whether or  not to escape quotes (default is no)
 * @returns {String} The encoded string (not including initial '?')
 */
GQ.Network.encodeURIRequest = function (vars, escQuotes) {
	var queryArgSep = '&'; // Separator for query strings; use &amp; ?
    var enc = '';
    for (var key in vars) {
        if (vars.hasOwnProperty(key)) {
			if (escQuotes) {
				vars[key] = vars[key].replace(/"/g, '\\"');
			}
            enc += queryArgSep + encodeURIComponent(key) + '='+ encodeURIComponent(vars[key]);
        }
    }
    return enc.slice(1);
};

/**
 * Make an iframe request to the PS engine (for obtaining JSON)
 * @param {String|Object} queryStr The query string (or object of key-values to encode)
 * @param {Function} cb The callback to call upon loading of the iframe
 * @param {DOMElement} [iframeHolder] The iframe holder into which to insert the request (defaults to a holder of ID 'iframeHolder')
 * @returns {DOMElement} The newly created iframe
*/
GQ.Network.makeIframeRequest = function (queryStr, cb, iframeHolder) {
	if (typeof queryStr === 'object' && queryStr !== null) {
		queryStr = GQ.Network.encodeURIRequest(queryStr);
	}
	return $E('iframe',
		{
			src: 'amengine.aspx?'+queryStr,
			event: ['load', cb]
		},
		iframeHolder || $('#iframeHolder')
	);
};


(function () {

GQ.Namespace('GQ.JSON');

// var testOutput = ''; // Debugging only

/**
 * Convert our own PS-specific data format (delimited by near-unique strings) to JSON
 * @param {String} data The data to convert
 * @returns {String} The output as a JSON string
 */
GQ.JSON.convertCustomFormattedDataToJSON = function (data) {
	// data = window.location.href.indexOf('file://') !== -1 ? testOutput : data; /* Debugging only */
	data = data.replace(/^\s+/g, '').replace(/\s+$/g, '');
	return '[['+data.replace(/([\s\S]*?)\{--(SEPARATOR|LINE_END)--\}/g, function (str, n1, n2) {
		return '"'+n1.replace(/"/g, '\\"')+'"'+
			(n2 === 'LINE_END' ? '],[' : ',');
	}).slice(0, -2)+']';
};
/**
 * Convert our own PS-specific data format (delimited by near-unique strings) to JSON
 * @param {String} data The data to convert
 * @returns {String} The output as a JSON string
 */
GQ.JSON.convertCustomFormattedDataToJSON2 = function (data) {
    // Mostly fixed the conversion now (deal with weird Firefox escaping of HTML elements in innerHTML)
    return data.replace(/"\\&quot;/g, '\\"').replace(/\\&quot;"/g, '\\"');
};


/**
 * This function is useful when you have a array such as JSON returned by the server whose structure you cannot control (or structured as an array for the sake of minimizing bandwidth),
 *  but which you wish to reformat into a hierarchical (and potentially string-keyed object).
 * @param {Array[]} arr A multidimensional array (an array holding arrays)
 * @param {Number|String} [groupingCol] Column which should be used for grouping; if a string, it must be the one present in colNames; if a number, it is 0-based; default is index 0
 * @param {String[]} [colNames] An array with the names of the columns if one wishes format inner arrays as objects keyed to column names
 * @returns {Object} The hierarchical object
 */
GQ.JSON.makeHierarchyFromMultiArray = function (arr, groupingCol, colNames) {
    var obj = {},
        colNamesLen = colNames && colNames.length;
    if (typeof groupingCol === 'string') {
        if(!colNames) {
            throw 'Missing or invalid column names';
        }
        for (var i = 0; i < colNamesLen; i++) {
            if (colNames[i] === groupingCol) {
                groupingCol = i;
                break;
            }
        }
    }
    var arrlen;
    groupingCol = groupingCol || 0;
    for (i = 0, arrlen = arr.length; i < arrlen; i++) {
        if (!arr[i]) {
            continue;
        } /* Deal with IE considering comma at array end as undefined */
        var id = arr[i][groupingCol];
        if (!obj[id]) {
            obj[id] = [];
        }
        if (colNames) {
            var mappedObj = {};
            for (var j = 0; j < colNamesLen; j++) {
                var label = colNames[j];
                mappedObj[label] = arr[i][j];
            }
            obj[id].push(mappedObj);
        }
        else {
            obj[id].push(arr[i]);
        }
    }
    return obj;
};


}());


/**
 * Debugging only; define as GQ.DOM method if needing to serialize in regular application
 * Serializes a DOM element to a string
 * @param {DOMElement} str String to serialize
 */
function ser (str) {
    return new XMLSerializer().serializeToString(str);
}
/**
 * Debugging only
 * Serializes a DOM element to a string and alerts
 * @param {DOMElement} str String to serialize
 */
function aser (str) {
    alert(new XMLSerializer().serializeToString(str));
}


/**
 * Debugging only (indicate a variable type, and if an object, its properties)
 * @param {ANY} object The variable to check for type and any properties
 */
function whatIs(object) {
    var text = '';
    text += 'type: ' + (object instanceof Array ? 'array' : object instanceof Date ? 'Date' : object instanceof RegExp ? 'RegExp' : typeof object) + '\n';
    if (object === null) {
        text += 'Is null';
    } else if (typeof object !== 'object') {
        text += 'Object has no properties; is of type ' + typeof object + ' with value: ' + object;
    } else if (object instanceof Date) {
        text += object.toString();
    } else if (object instanceof RegExp) {
        text += object.source;
    } else {
        for (var i in object) {
            if (1) { /* JSLINT */
                try {
                    text += i + (': ' + object[i] + '\n');
                }
                catch(e) {
                    text += i + (': ' + '[[ERROR]] (DOM?)' + '\n');
                }
            }
        }
    }
    alert(text);
}

/**
 * Analyze an object and provide an alert for its contents; to recurse over inner objects
 * @param {Object} object Object to analyze
 * @param {Boolean} noRecurs Whether to disable a recursive check for inner object content
 * @param {String} indent the indentation string to append for display of inner object contents
 * @x-todo DO NOT USE - depends on whatIs not alerting
 */
function whatIsRecurs (object, noRecurs, indent) {
    if (!indent) {
        indent = '';
    }
    indent += '     ';
    var text = '';
    text += 'type: ' + ((object instanceof Array) ? 'array' : typeof(object)) + '\n';
    if (object == null || typeof(object) != 'object') {
        text += indent+'Object has no properties';
    }
    else {
        for(var i in object) {
            text += indent+i + ': ' + (noRecurs ? object[i]: whatIsRecurs(object[i], noRecurs, indent)) + '\n';
        }
    }
    return text;
}


/*
 * Debugging only: Indicate a string to alert
 * @param {String} str sThe string to alert
*/
function d (str) {
	alert(str);
}

GQ.DOM.styleSizeToNumber = function(styleSize){
	if( styleSize === undefined ||
		styleSize === null ||
		styleSize === '' ){
		return 0;
	}
	return parseInt( styleSize, 10);
};

/*
 * Calculate the position of center layout
 * @param {Object} domNode A DOM node to be centered
 * @returns {JSON} x : the horizontal position
				   y : the vertical position
*/
GQ.DOM.calculateCenterPosition = function(domNode){
	var cs = $D.getComputedStyle(domNode),
		csWidth = GQ.DOM.styleSizeToNumber(cs.width),
		csHeight = GQ.DOM.styleSizeToNumber(cs.height),
		xLoc = (window.innerWidth - csWidth) / 2,
		yLoc = (window.innerHeight - csHeight) / 2;
	return ({x : xLoc, y : yLoc});
};

GQ.DOM.getComputedSize = function (style){
	var computedWidth = 0, computedHeight = 0,
		styleSizeComputor = GQ.DOM.styleSizeToNumber,
		horizontalPadding = 0, verticalPadding = 0,
		horizontalBorder = 0, verticalBorder = 0,
		horizontalMargin = 0, verticalMargin = 0,
		padding = styleSizeComputor ( style['pddding'] ),
		border = styleSizeComputor ( style['border'] ),
		margin = styleSizeComputor ( style['margin'] );

	computedWidth = styleSizeComputor( style['width'] );

	computedHeight = styleSizeComputor( style['width'] );

	horizontalPadding = styleSizeComputor ( style['padding-left'] ) +
						styleSizeComputor ( style['padding-right'] );

	if( horizontalPadding === 0 ){
		horizontalPadding = padding * 2;
	}

	verticalPadding = styleSizeComputor ( style['padding-top'] ) +
						styleSizeComputor ( style['padding-bottom'] );

	if( verticalPadding === 0 ){
		verticalPadding = padding * 2;
	}

	horizontalBorder = styleSizeComputor ( style['border-left'] ) +
						styleSizeComputor ( style['border-right'] );

	if( horizontalBorder === 0 ){
		horizontalBorder = border * 2;
	}

	verticalBorder = styleSizeComputor ( style['border-top'] ) +
						styleSizeComputor ( style['border-bottom'] );

	if( verticalBorder === 0 ){
		verticalBorder = border * 2;
	}

	horizontalMargin = styleSizeComputor ( style['margin-left'] ) +
						styleSizeComputor ( style['margin-right'] );

	if( horizontalMargin === 0 ){
		horizontalMargin = margin * 2;
	}

	verticalMargin = styleSizeComputor ( style['margin-top'] ) +
						styleSizeComputor ( style['margin-bottom'] );

	if( verticalMargin === 0 ){
		verticalMargin = margin * 2;
	}

	return {width : computedHeight, height : computedHeight};
};

/**
 * Empty all children of an element specified by ID or a DOM element
 * @param {DOMElement|String} element The DOM element whose children should be emptied
 */
GQ.DOM.removeAllChildren = function (element) {
    if (typeof element === 'string') {
        element = $(element);
    }
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

/**
 * Returns whether the mouse event in question was right-clicked
 * @param {Event} e The event object
 * @returns {Boolean} whether or not this was a right-click
 */
GQ.DOM.rightClicked = function (e) {
	if (!e) {
        e = window.event;
    }
    return e.which ? e.which == 3 : e.button ? e.button == 2 : false;
};


/**
 * @param {String|DOMElement} highlightElement The element to highlight with different background
 *                                                                                              colors upon transitions
 * @param {Object|String} [colors] Object with properties, 'transition', 'success', and 'failure',
 *                                                                                          or a class prefix as a string; default is
 * @param {Function} start The function to call at the beginning; will be passed the wrapped function which
 *                                                  should be called on successful finishing (takes a JSON object), e.g., upon async
 *                                                  success, and a wrapped function to call upon an error (no args), e.g., as an
 *                                                  async failure response function
 * @param {Function} [isSuccess] Passed JSON object on success (to be called inside start's finish function);
 *                                                                  default is to return true and indicate success
 * @param {Function} [error] Passed JSON object on an error from isSuccess check (to be called inside finish function
 *                                                                      if isSuccess returns falsey value); default is to do nothing
 * @param {Boolean|Function} [reload] Whether or not to reload; will be passed a JSON object if a function and should
 *                                                                      return a boolean; default is false
 */
GQ.DOM.animateColor = function (highlightElement, colors, start, isSuccess, error, reload) {
    isSuccess = isSuccess || function (json) {return true;};
    error = error || function () {};

    if (typeof highlightElement === 'string') {
        highlightElement = $(highlightElement);
    }

    // SET-UP
    var dom = GQ.DOM;

    // COLORS
    colors = typeof colors === 'string' ?
        {
            transition : dom.getCSSPropertyValue(colors + 'Transition', 'background-color'),
            success : dom.getCSSPropertyValue(colors + 'Success', 'background-color'),
            failure : dom.getCSSPropertyValue(colors + 'Failure', 'background-color')
        } :
        colors ||
        {};
    var initialBGColor = 'transparent', // $D.getComputedStyle(highlightElement).backgroundColor, // This can be annoying if it is in the middle of a transition, in which case it will return to the transition color
        transitionBGColor = colors.transition || 'yellow',
        successBGColor = colors.success || 'green',
        failureBGColor = colors.failure || 'red';

    /**
     * Animate a transition from an element's current color to a target color over a specified duration
     *   and then execute a call-back when finished
     * @param {DOMElement} target
     * @param {String} endColor
     * @param {Number} duration Duration of transition in milliseconds
     * @param {Function} cbEnd The function to be called at the end of the transition; will be passed as an
     *                                                      argument, the same duration it was given
     */

    function _animateColor (target, endColor, duration, cbEnd) {
        duration = duration || 5000;
        var onEnd = cbEnd ? function () {
                cbEnd(duration); // Make duration available to callback
            } :
            function () {};
        if ($D) {
            $D.animateProperty({
                node: target,
                duration: duration,
                properties: {
                    backgroundColor: {
                        end: endColor
                    }
                },
                onEnd: onEnd
            }).play();
        }
        else { // Fix: should use duration rather than transitionColor defaults
            $J(target).transitionColor(endColor === 'transparent' ? 'white' : endColor, onEnd); // Fix: find way to use transparent instead of white
        }
    }

    /**
     * @param {Object|String} json The JSON object with properties or text
     */
    function _finish (json) {
        if (isSuccess(json)) {
            _animateColor(highlightElement, successBGColor, 4000, function (dur) {
                if (reload === true || typeof reload === 'function' && reload(json)) {
                    window.location.reload(true);
                }
                _animateColor(highlightElement, initialBGColor, dur);
            });
        }
        else {
            // Don't know what to do now, just show the message
            error(json);
        }
    }
    /**
     *
     */
    function _error (e, qo) {
        _animateColor(highlightElement, failureBGColor, 4000, function (dur) {
            _animateColor(highlightElement, initialBGColor, dur);
        });
    }

    _animateColor(highlightElement, transitionBGColor, 200, function () {
        // START REAL ACTION
        start(_finish, _error);
    });
};

GQ.Date = {
    /**
     * Formats a date (timestamp or Date) as YYYY-MM-DD (using present date if none supplied) in UTC form
     * @param {Date|Number} [date] The date for which to obtain the formatted date string
     * @returns {String} A date string as YYYY-MM-DD
     */
    getUTCDate : function (date) {
        date = typeof date === 'number' ? new Date(date) : date || new Date();
        return date.getUTCFullYear() + '-' +
                        ((date.getUTCMonth() < 9) ? '0' + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1)) + '-' +
                        ((date.getUTCDate() < 10) ? '0' + date.getUTCDate() : date.getUTCDate());
    },
    /**
     * Formats a date-time (timestamp or Date object) as HH:MM:SS (using present date if none supplied) in UTC form
     * @param {Date|Number} [date] The date-time for which to obtain the formatted time string
     * @returns {String} A time string as HH:MM:SS
     */
    getUTCTime : function (date) {
        date = typeof date === 'number' ? new Date(date) : date || new Date();
        return ((date.getUTCHours() < 10) ? '0' + date.getUTCHours() : date.getUTCHours()) + ':' +
                        ((date.getUTCMinutes() < 10) ? '0' + date.getUTCMinutes() : date.getUTCMinutes()) +':' +
                        ((date.getUTCSeconds() < 10) ? '0' + date.getUTCSeconds() : date.getUTCSeconds());
    },
    /**
     * Formats a time as HH:MM:SS.mmmmmmm (with m as microseconds)
     * @param {Date|Number} [date] The date-time for which to obtain the formatted time string
     * @returns {String} A time string as HH:MM:SS.mmmmmmm (with m as microseconds)
     */
    getUTCTimeWithMicroseconds : function (date) {
        return this.getUTCTimeWithMilliseconds(date) + '0000'; // We can't generate microseconds
    },
    /**
     * Formats a time as HH:MM:SS.mmm (with m as milliseconds)
     * @param {Date|Number} [date] The date-time for which to obtain the formatted time string
     * @returns {String} A time string as HH:MM:SS.mmm (with m as milliseconds)
     */
    getUTCTimeWithMilliseconds : function (date) {
        date = typeof date === 'number' ? new Date(date) : date || new Date();
        return this.getUTCTime(date) + '.' +
            (
                (date.getUTCMilliseconds() < 10) ? '00' + date.getUTCMilliseconds() :
                (date.getUTCMilliseconds() < 100) ? '0' + date.getUTCMilliseconds() :
                date.getUTCMilliseconds()
            );
    },
    /**
     * Formats a date-time as YYYY-MM-DD HH:MM:SS.mmmmmmm (with m as microseconds)
     * @param {Date|Number} [date] The date-time for which to obtain the formatted date-time string
     * @returns {String} A date-time string as YYYY-MM-DD HH:MM:SS.mmmmmmm (with m as microseconds)
     */
    getUTCDateTimeWithMicroseconds : function (date) {
        date = typeof date === 'number' ? new Date(date) : date || new Date();
         return this.getUTCDate(date) + ' ' + this.getUTCTimeWithMicroseconds(date);
    },
    /**
     * Formats a date-time as YYYY-MM-DD HH:MM:SS.mmm (with m as milliseconds)
     * @param {Date|Number} [date] The date-time for which to obtain the formatted date-time string
     * @returns {String} A date-time string as YYYY-MM-DD HH:MM:SS.mmm (with m as milliseconds)
     */
    getUTCDateTimeWithMilliseconds : function (date) {
        date = typeof date === 'number' ? new Date(date) : date || new Date();
         return this.getUTCDate(date) + ' ' + this.getUTCTimeWithMilliseconds(date);
    },
    getUTCDateTime : function (date) {
        date = typeof date === 'number' ? new Date(date) : date || new Date();
        return this.getUTCDate(date) + ' ' + this.getUTCTime(date);
    }
};

GQ.Regex = {};
/**
 * Simplifies process of getting a particular parenthetical out of a global regular expression search
 * @param {String} str The string to search
 * @param {RegExp} regex The (global) regular expression for searching
 * @param {Number} [idx] The index of the regular expression parenthetical to obtain;
 *                                                  defaults to 1 (since 0 is obtainable by match)
 * @param {Array} [arr] Optional array for storing results; default is to return a new array
 * @param {Boolean} [getFalsy] Whether or not to add falsy items; default is no
 */
GQ.Regex.getGlobalGroup = function (str, regex, idx, arr, getFalsy) {
    var res;
    var flags = 'g'; // Ensure we're working with a global
    flags += regex.ignoreCase ? 'i' : '';
    flags += regex.multiline ? 'm' : '';
    flags += regex.sticky ? 'y' : ''; // Firefox only!

    regex = new RegExp(regex.source, flags);
    arr = arr || [];
    idx = idx || 1;
    while ((res = regex.exec(str)) != null) {
        if (res[idx] || getFalsy) {
            arr[arr.length] = res[idx];
        }
    }
    return arr;
};


GQ.JQuery = {};

/**
 * Enables/disables jQuery.ui.dialog button
 * @param button {Object} The button to be manipulated
 * @param enable {Boolean} Enable or disable
*/
GQ.JQuery.enableDialogButton = function (button, enable) {
    button.attr('disable', !enable);
    var disableClass = 'ui-state-disabled';
    if (enable) {
        button.removeClass(disableClass);
    }
    else {
        button.addClass(disableClass);
    }
};

/**
* Convert to jQuery serialized array form (array of objects containing
*  "name" and "value" as properties); just allows shorter syntax
* @param {Object} inputArrOrObj The object whose keys should
* be used as names and values as values; can also be an array of such
* objects, or the arguments to the function can each be such objects
* @returns {Object[]} An array of name-value objects
*/
GQ.JQuery.convertToJQuerySerializedArray = function (inputArrOrObj) {
    if (arguments.length > 1) {
        inputArrOrObj = Array.prototype.slice.call(arguments);
    }
    var inputArr = typeof inputArrOrObj.length === 'number' &&
        !inputArrOrObj.propertyIsEnumerable('length') ?
        inputArrOrObj : [inputArrOrObj];
    var outputArr = [];

    for (var i = 0, ial = inputArr.length; i < ial; i++) {
        var inputObj = inputArr[i];
        for (var p in inputObj) {
            var outputObj = {};
            outputObj.name = p;
            outputObj.value = inputObj[p];
            outputArr[outputArr.length] = outputObj;
        }
    }
    return outputArr;
};


/**
 * Select a particular option on a jQuery object
 * @param {Object} select The jQuery select object
 * @param {} option_val The value of the option to find for selection
 */
GQ.JQuery.selectOption = function (select, option_val) {
    if (typeof select === 'string') {
        select = $J(select);
    }
    select.find('option:selected').removeAttr('selected');
    select.find('option[value="' + option_val + '"]').attr('selected', 'selected');
};


GQ.Ajax = {};
GQ.Ajax.baseURL = 'http://5.83.39.9/amengine/amengine.aspx';

// ADDS BY ZHONG
/**
 * Gets or posts data , called by GQ.Ajax.getJSONFromAMEngineWidget and GQ.Ajax.postToAMEngineWidget.
 */
GQ.Ajax.doAMEngineAjaxRequest = function (type, widgetName, extraParams, success, error) {
    var successDelegate = function (data, textStatus) {
            var i, 
                processedData = [];

            try{
                var jsonData = JSON.parse(data.replace(/\],[\s]*\]$/, ']]').replace(/},[\s]*\]$/, '}]')); // Need to fix JSON parsing problem (but only version of IE8 on server, not mine!)

                if (GQ.Misc.isArray(jsonData)) {
                    GQ.Misc.each(
                        jsonData,
                        function (index, element){
                            if (element !== undefined) {
                                processedData.push(element);
                            }
                        }
                    );
                
                    data = processedData;
                }
            }
            catch(e){
            }
            
            if (GQ.Misc.isFunction(success)) {
                success(data,  textStatus);
            }
        },
        extraData = extraParams || {},
        params = {
            url: GQ.Ajax.baseURL,
            'type': type,
            'dataType': 'text',
            data: $J.extend({
                nobody: true,
                _gqQueryTime: new Date().getTime(), // Avoid cache
                'config.mn': widgetName
            }, extraData),
            'success': successDelegate,
            'error': error
        };

	$J.ajax(params);
};

/**
 * Gets json data from AMEngine widget
 */
GQ.Ajax.getJSONFromAMEngineWidget = function (widgetName, extraParams, success, error) {
    this.doAMEngineAjaxRequest('GET', widgetName, extraParams, success, error);
};

/**
 * Posts data to AMEngine widget to do some action
 */
GQ.Ajax.postToAMEngineWidget = function (widgetName, extraParams, success, error) {
    var timestamp = GQ.Misc.getTimeStamp();
    this.doAMEngineAjaxRequest('POST', widgetName,
        $J.extend(extraParams,
            {
                am_id: timestamp,
                metric_value: timestamp
            }
        ),
        success,
        error
    );
};

// ADDS BY IMGEN
GQ.Misc = {};

/**
 * Generates a positive random integer in the range of [start, end]
 * @param {Integer} start The start integer
 * @param {Integer} end The end integer
 * @return The generated random number
 */
GQ.Misc.generateRandomInteger = function(start, end) {
        var factor = end - start,
            rand = Math.random();
        rand = Math.round(rand * factor);
        return start + rand;
};

/**
 * Generate a time stamp that could be used as an unique ID
 */
GQ.Misc.getTimeStamp = function () {
    return parseInt((new Date() - new Date(2010, 6, 7) - 2303402290), 10);
};

/**
 * Formats number length
 */
GQ.Misc.formatNumberLength = function(num, length) { 
    var r = num.toString(); 
    while (r.length < length) { 
        r = "0" + r; 
    } 
    return r; 
};

GQ.Misc.removeElementFromArrayByValue = function (value, array) {
	var inArray = false,
	      n = 0,
	      valueOccurCount = 0;
	this.each(
	    array,
	    function (i, element) {
	        if(element !== value)
	        {   
	            array[n] = array[i];
	            n++;
	        }
	        else {
	            inArray = true;
	            valueOccurCount++;
	        }
	    }
	);
	
	
	if (inArray) {
	    array.length -= valueOccurCount;
	}
};

GQ.Misc.removeElementFromArrayByIndex = function (index, array) {
    var inArray = false,
          n = 0;
    this.each(
        array,
        function (i) {
            if(i !== index)
            {
                array[n] = array[i];
                n++;
            }
            else {
                inArray = true;
            }
        }
    );
    

    if (inArray) {
        array.length -= 1;
    }
};

/**
 * Some mischellous utilites
 */
GQ.Misc.isArray = function (value) {
    return value && 
        typeof value === 'object' &&
        value.constructor === Array;
};

GQ.Misc.isFunction = function (value) {
    return value && 
        typeof value === 'function';
};

GQ.Misc.each = function (array, callback) {
    if (!this.isArray(array) || 
        array.length === 0 || 
        !this.isFunction(callback) )
    {
        return;
    }
    
    var i;
    
    for (i = 0; i < array.length; i++) {
        callback(i, array[i]);
    }
};


/* Cross-Browser Split 1.0.1
(c) Steven Levithan <stevenlevithan.com>; MIT License
An ECMA-compliant, uniform cross-browser split method */

var cbSplit;

// avoid running twice, which would break `cbSplit._nativeSplit`'s reference to the native `split`
if (!cbSplit) {

    cbSplit = function (str, separator, limit) {
        // if `separator` is not a regex, use the native `split`
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
            return cbSplit._nativeSplit.call(str, separator, limit);
        }

        var output = [],
            lastLastIndex = 0,
            flags = (separator.ignoreCase ? "i" : "") +
                    (separator.multiline  ? "m" : "") +
                    (separator.sticky     ? "y" : ""),
            separator2, match, lastIndex, lastLength;

        separator = RegExp(separator.source, flags + "g"); // make `global` and avoid `lastIndex` issues by working with a copy

        str = str + ""; // type conversion
        if (!cbSplit._compliantExecNpcg) {
            separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
        }

        /* behavior for `limit`: if it's...
        - `undefined`: no limit.
        - `NaN` or zero: return an empty array.
        - a positive number: use `Math.floor(limit)`.
        - a negative number: no limit.
        - other: type-convert, then use the above rules. */
        if (limit === undefined || +limit < 0) {
            limit = Infinity;
        } else {
            limit = Math.floor(+limit);
            if (!limit) {
                return [];
            }
        }

        while ((match = separator.exec(str))) {
            lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser

            if (lastIndex > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));

                // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
                if (!cbSplit._compliantExecNpcg && match.length > 1) {
                    match[0].replace(separator2, function () {
                        for (var i = 1; i < arguments.length - 2; i++) {
                            if (arguments[i] === undefined) {
                                match[i] = undefined;
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
                separator.lastIndex++; // avoid an infinite loop
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

    cbSplit._compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group
    cbSplit._nativeSplit = String.prototype.split;
} // end `if (!cbSplit)`



