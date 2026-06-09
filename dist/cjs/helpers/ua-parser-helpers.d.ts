export { isFrozenUA } from 'ua-is-frozen';
/**
 * Translates a raw Outlook User-Agent name/version into a
 * Developer-friendly Edition (e.g., "Outlook 2019 (Modern Word)").
 */
export declare const getOutlookEdition: (name: string, version: string) => string;
