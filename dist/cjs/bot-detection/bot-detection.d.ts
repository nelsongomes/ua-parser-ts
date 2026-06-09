import type { IResult } from '../main/ua-parser';
export declare const isBot: (ua: IResult | string) => boolean;
export declare const isAIAssistant: (ua: IResult | string) => boolean;
export declare const isAICrawler: (ua: IResult | string) => boolean;
