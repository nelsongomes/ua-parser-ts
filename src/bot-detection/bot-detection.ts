//////////////////////////////////////////////////
/*  bot-detection submodule of UAParser.js v2.0.10
    https://github.com/faisalman/ua-parser-js
    Author: Faisal Salman <f@faisalman.com>
    AGPLv3 License */
/////////////////////////////////////////////////

import { UAParser } from '../main/ua-parser';
import type { IResult, UAParserExt, UAParserInstance } from '../main/ua-parser';
import { Bots, Crawlers, Fetchers } from '../extensions/ua-parser-extensions';
import { BrowserType, Extension } from '../enums/ua-parser-enums';
const { Crawler, Fetcher } = Extension.BrowserName;

const UAParserNew = UAParser as unknown as new (ua: string, ext?: UAParserExt) => UAParserInstance;

class BotList {
    ext: UAParserExt;
    prop: string;
    list: string[];
    private readonly _cache = new Map<string, string | undefined>();

    constructor(ext: UAParserExt, prop: string, list: string[]) {
        this.ext = ext;
        this.prop = prop;
        this.list = list.map(x => x.toLowerCase());
    }
    includes(ua: IResult | string): boolean {
        let propValue: string | undefined;
        if (typeof ua === 'string') {
            if (this._cache.has(ua)) {
                propValue = this._cache.get(ua);
            } else {
                const browser = new UAParserNew(ua, this.ext).getBrowser();
                propValue = (browser as unknown as Record<string, string | undefined>)[this.prop]?.toLowerCase();
                this._cache.set(ua, propValue);
            }
        } else {
            propValue = (ua.browser as unknown as Record<string, string | undefined>)[this.prop]?.toLowerCase();
        }
        return this.list.includes(propValue as string);
    }
}

const BotTypes = new BotList(Bots, 'type', [
    BrowserType.CLI,
    BrowserType.CRAWLER,
    BrowserType.FETCHER,
    BrowserType.LIBRARY
]);

const AIAssistants = new BotList(Fetchers, 'name', [

    // Amazon
    Fetcher.AMAZON_NOVA_ACT,

    // Anthropic
    Fetcher.ANTHROPIC_CLAUDE_USER,

    // Cohere
    Fetcher.COHERE_AI,

    // DuckDuckGo
    Fetcher.DUCKDUCKGO_ASSISTBOT,

    // Google
    Fetcher.GOOGLE_GEMINI_DEEP_RESEARCH,

    // Mistral AI
    Fetcher.MISTRALAI_USER,

    // OpenAI
    Fetcher.OPENAI_CHATGPT_USER,

    // Perplexity
    Fetcher.PERPLEXITY_USER
]);

const AICrawlers = new BotList(Crawlers, 'name', [

    // AI2
    Crawler.AI2_BOT,

    // Amazon
    Crawler.AMAZON_BOT,

    // Anthropic
    Crawler.ANTHROPIC_AI,
    Crawler.ANTHROPIC_CLAUDE_BOT,
    Crawler.ANTHROPIC_CLAUDE_SEARCHBOT,
    Crawler.ANTHROPIC_CLAUDE_WEB,

    // Apple
    Crawler.APPLE_BOT,
    Crawler.APPLE_BOT_EXTENDED,

    // Atlassian
    Crawler.ATLASSIAN_BOT,

    // Brave
    Crawler.BRAVE_BOT,

    // ByteDance
    Crawler.BYTEDANCE_BYTESPIDER,
    Crawler.BYTEDANCE_TIKTOKSPIDER,

    // Cloudflare
    Crawler.CLOUDFLARE_AUTORAG,

    // Cohere
    Crawler.COHERE_TRAINING_DATA_CRAWLER,

    // Common Crawl
    Crawler.COMMON_CRAWL_CCBOT,

    // Coveo
    Crawler.COVEO_BOT,

    // DataForSeo
    Crawler.DATAFORSEO_BOT,

    // DeepSeek
    Crawler.DEEPSEEK_BOT,

    // Diffbot
    Crawler.DIFFBOT,

    // Google
    Crawler.GOOGLE_EXTENDED,
    Crawler.GOOGLE_NOTEBOOKLM,
    Crawler.GOOGLE_OTHER,
    Crawler.GOOGLE_OTHER_IMAGE,
    Crawler.GOOGLE_OTHER_VIDEO,
    Crawler.GOOGLE_CLOUDVERTEXBOT,

    // Hive AI
    Crawler.HIVE_IMAGESIFTBOT,

    // Huawei
    Crawler.HUAWEI_PETALBOT,
    Crawler.HUAWEI_PANGUBOT,

    // Hugging Face
    Crawler.HUGGINGFACE_BOT,

    // Kangaroo
    Crawler.KANGAROO_BOT,

    // Mendable.ai
    Crawler.FIRECRAWL_AGENT,

    // Meta
    Crawler.META_FACEBOOKBOT,
    Crawler.META_EXTERNALAGENT,
    Crawler.META_WEBINDEXER,

    // OpenAI
    Crawler.OPENAI_GPTBOT,
    Crawler.OPENAI_SEARCH_BOT,

    // Perplexity
    Crawler.PERPLEXITY_BOT,

    // Replicate
    Crawler.REPLICATE_BOT,

    // Runpod
    Crawler.RUNPOD_BOT,

    // SB Intuitions
    Crawler.SB_INTUITIONS_BOT,

    // Semrush
    Crawler.SEMRUSH_BOT_CONTENTSHAKE,
    Crawler.SEMRUSH_BOT_SWA,

    // Timpi
    Crawler.TIMPI_BOT,

    // Together AI
    Crawler.TOGETHER_BOT,

    // Velen.io
    Crawler.HUNTER_VELENPUBLICWEBCRAWLER,

    // Vercel
    Crawler.VERCEL_V0BOT,

    // Webz.io
    Crawler.WEBZIO_OMGILI,
    Crawler.WEBZIO_OMGILI_BOT,
    Crawler.WEBZIO_EXTENDED,

    // X
    Crawler.XAI_BOT,

    // You.com
    Crawler.YOU_BOT,

    // Zhipu AI
    Crawler.ZHIPU_CHATGLM_SPIDER
]);

export const isBot = (ua: IResult | string): boolean => BotTypes.includes(ua);
export const isAIAssistant = (ua: IResult | string): boolean => AIAssistants.includes(ua);
export const isAICrawler = (ua: IResult | string): boolean => AICrawlers.includes(ua);
