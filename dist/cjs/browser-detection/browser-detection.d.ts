import type { IResult } from '../main/ua-parser';
export { isStandalonePWA } from 'is-standalone-pwa';
export { isFromEU } from 'detect-europe-js';
export declare const isChromeFamily: (val: IResult | string) => boolean;
export declare const isElectron: () => boolean;
