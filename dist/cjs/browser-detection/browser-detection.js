"use strict";
//////////////////////////////////////////////////////
/*  browser-detection submodule of UAParser.js v2.0.10
    https://github.com/faisalman/ua-parser-js
    Author: Faisal Salman <f@faisalman.com>
    AGPLv3 License */
/////////////////////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElectron = exports.isChromeFamily = exports.isFromEU = exports.isStandalonePWA = void 0;
const ua_parser_1 = require("../main/ua-parser");
const ua_parser_enums_1 = require("../enums/ua-parser-enums");
var is_standalone_pwa_1 = require("is-standalone-pwa");
Object.defineProperty(exports, "isStandalonePWA", { enumerable: true, get: function () { return is_standalone_pwa_1.isStandalonePWA; } });
var detect_europe_js_1 = require("detect-europe-js");
Object.defineProperty(exports, "isFromEU", { enumerable: true, get: function () { return detect_europe_js_1.isFromEU; } });
const UAParserNew = ua_parser_1.UAParser;
const isChromeFamily = (val) => {
    var _a;
    return !!((_a = (typeof val === 'string' ?
        new UAParserNew(val).getEngine() :
        val.engine)) === null || _a === void 0 ? void 0 : _a.is(ua_parser_enums_1.EngineName.BLINK));
};
exports.isChromeFamily = isChromeFamily;
const isElectron = () => {
    var _a;
    return !!(
    // in node.js environment
    (typeof process !== 'undefined' && ((_a = process.versions) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('electron'))) ||
        // in browser environment
        (typeof navigator !== 'undefined' && / electron\//i.test(navigator.userAgent)));
};
exports.isElectron = isElectron;
//# sourceMappingURL=browser-detection.js.map