"use strict";
/////////////////////////////////////////////////////
/*  device-detection submodule of UAParser.js v2.0.10
    https://github.com/faisalman/ua-parser-js
    Author: Faisal Salman <f@faisalman.com>
    AGPLv3 License */
////////////////////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppleSilicon = exports.getDeviceVendor = void 0;
const ua_parser_1 = require("../main/ua-parser");
const ua_parser_enums_1 = require("../enums/ua-parser-enums");
const UAParserNew = ua_parser_1.UAParser;
const getDeviceVendor = (model) => new UAParserNew(`Mozilla/5.0 (Linux; Android 10; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36`).getDevice().vendor;
exports.getDeviceVendor = getDeviceVendor;
const isAppleSilicon = (val) => {
    const parsed = typeof val === 'string' ? new UAParserNew(val) : null;
    const { os, cpu } = parsed ? { os: parsed.getOS(), cpu: parsed.getCPU() } : val;
    if (os.is(ua_parser_enums_1.OSName.MACOS)) {
        if (cpu.is(ua_parser_enums_1.CPUArch.ARM)) {
            return true;
        }
        else if (typeof window !== 'undefined') {
            try {
                const canvas = document.createElement('canvas');
                const webgl = canvas.getContext('webgl2') ||
                    canvas.getContext('webgl') ||
                    canvas.getContext('experimental-webgl');
                return !!webgl
                    .getParameter(webgl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL)
                    .match(/apple m\d/i);
            }
            catch (_a) {
                return false;
            }
        }
    }
    return false;
};
exports.isAppleSilicon = isAppleSilicon;
//# sourceMappingURL=device-detection.js.map