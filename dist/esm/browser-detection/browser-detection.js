//////////////////////////////////////////////////////
/*  browser-detection submodule of UAParser.js v2.0.10
    https://github.com/faisalman/ua-parser-js
    Author: Faisal Salman <f@faisalman.com>
    AGPLv3 License */
/////////////////////////////////////////////////////
import { UAParser } from '../main/ua-parser';
import { EngineName } from '../enums/ua-parser-enums';
export { isStandalonePWA } from 'is-standalone-pwa';
export { isFromEU } from 'detect-europe-js';
const UAParserNew = UAParser;
export const isChromeFamily = (val) => {
    var _a;
    return !!((_a = (typeof val === 'string' ?
        new UAParserNew(val).getEngine() :
        val.engine)) === null || _a === void 0 ? void 0 : _a.is(EngineName.BLINK));
};
export const isElectron = () => {
    var _a;
    return !!(
    // in node.js environment
    (typeof process !== 'undefined' && ((_a = process.versions) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('electron'))) ||
        // in browser environment
        (typeof navigator !== 'undefined' && / electron\//i.test(navigator.userAgent)));
};
//# sourceMappingURL=browser-detection.js.map