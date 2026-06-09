//////////////////////////////////////////////////////
/*  browser-detection submodule of UAParser.js v2.0.10
    https://github.com/faisalman/ua-parser-js
    Author: Faisal Salman <f@faisalman.com>
    AGPLv3 License */
/////////////////////////////////////////////////////

import { UAParser } from '../main/ua-parser';
import type { IResult, UAParserInstance } from '../main/ua-parser';
import { EngineName } from '../enums/ua-parser-enums';
export { isStandalonePWA } from 'is-standalone-pwa';
export { isFromEU } from 'detect-europe-js';

const UAParserNew = UAParser as unknown as new (ua: string) => UAParserInstance;

export const isChromeFamily = (val: IResult | string): boolean => !!(
    (typeof val === 'string' ?
        new UAParserNew(val).getEngine() :
        val.engine
    )?.is(EngineName.BLINK));

export const isElectron = (): boolean => !!(
    // in node.js environment
    (typeof process !== 'undefined' && process.versions?.hasOwnProperty('electron')) ||
    // in browser environment
    (typeof navigator !== 'undefined' && / electron\//i.test(navigator.userAgent))
);
