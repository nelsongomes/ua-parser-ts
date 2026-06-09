 
import { BrowserType, CPUArch, DeviceType, EngineName } from "../enums/ua-parser-enums";
export type BrowserTypes = (typeof BrowserType)[keyof typeof BrowserType];
export type CPUArchs = (typeof CPUArch)[keyof typeof CPUArch];
export type DeviceTypes = (typeof DeviceType)[keyof typeof DeviceType];
export type EngineNames = (typeof EngineName)[keyof typeof EngineName];
export interface UAParserInstance {
    getBrowser(): IBrowser;
    getCPU(): ICPU;
    getDevice(): IDevice;
    getEngine(): IEngine;
    getOS(): IOS;
    getResult(): IResult;
    getUA(): string;
    setUA(ua: string): this;
    useExtension(exts: UAParserExt): this;
}
export type RegexMap = ((RegExp | string | (string | RegExp | ((...args: string[]) => string))[]) | RegExp | string)[][];
export type UAParserProps = "browser" | "cpu" | "device" | "engine" | "os";
export type UAParserExt = Partial<Record<UAParserProps, RegexMap>> | Partial<Record<UAParserProps, RegexMap>>[];
export type UAParserHeaders = Record<string, string | string[] | undefined> | Headers;
export interface IData<T> {
    is(val: string): boolean;
    toString(): string;
    withClientHints(): PromiseLike<T> | T;
    withFeatureCheck(): PromiseLike<T> | T;
}
export interface IBrowser extends IData<IBrowser> {
    name?: string;
    version?: string;
    major?: string;
    type?: BrowserTypes;
}
export interface ICPU extends IData<ICPU> {
    architecture?: CPUArchs;
}
export interface IDevice extends IData<IDevice> {
    type?: DeviceTypes;
    vendor?: string;
    model?: string;
}
export interface IEngine extends IData<IEngine> {
    name?: EngineNames;
    version?: string;
}
export interface IOS extends IData<IOS> {
    name?: string;
    version?: string;
}
export interface IResult extends IData<IResult> {
    ua: string;
    browser: IBrowser;
    cpu: ICPU;
    device: IDevice;
    engine: IEngine;
    os: IOS;
}
export declare function UAParser(uastring?: string, extensions?: UAParserExt, headers?: UAParserHeaders): IResult;
export declare function UAParser(uastring?: string, headers?: UAParserHeaders): IResult;
export declare function UAParser(extensions?: UAParserExt, headers?: UAParserHeaders): IResult;
export declare function UAParser(headers?: UAParserHeaders): IResult;
export declare namespace UAParser {
    var VERSION: string;
    var BROWSER: Record<string, string>;
    var CPU: Record<string, string>;
    var DEVICE: Record<string, string>;
    var ENGINE: Record<string, string>;
    var OS: Record<string, string>;
}
