export declare const CLIs: Readonly<{
    browser: (RegExp[] | (string | string[])[])[];
}>;
export declare const Crawlers: Readonly<{
    browser: (RegExp[] | (string | (string | RegExp)[])[])[];
}>;
export declare const ExtraDevices: Readonly<{
    device: (RegExp[] | (string | string[])[])[];
}>;
export declare const Emails: Readonly<{
    browser: (RegExp[] | (string | (string | ((str: string) => string))[])[])[];
}>;
export declare const Fetchers: Readonly<{
    browser: (RegExp[] | (string | string[])[])[];
    os: (RegExp[] | (string | ((os: string) => "Android" | "iOS"))[][])[];
}>;
export declare const InApps: Readonly<{
    browser: (RegExp[] | (string | string[])[])[];
}>;
export declare const MediaPlayers: Readonly<{
    browser: (RegExp[] | (string | (string | RegExp)[])[])[];
}>;
export declare const Libraries: Readonly<{
    browser: (RegExp[] | (string | string[])[])[];
}>;
export declare const Vehicles: Readonly<{
    device: (string[] | RegExp[] | string[][])[];
}>;
export declare const Bots: Readonly<{
    browser: (RegExp[] | (string | (string | RegExp)[])[])[];
    os: (RegExp[] | (string | ((os: string) => "Android" | "iOS"))[][])[];
}>;
