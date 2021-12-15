var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-namespace */
// Generated automatically. Do not edit.
System.register("Steam/steamapps/common/Skyrim Special Edition - Modding/Data/Platform/Modules/skyrimPlatform", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Users/mrowr/Dropbox/Skyrim/Mods/WebUI/@skyrim-webui/sdk/src/@skyrim-webui/sdk/WebView", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Users/mrowr/Dropbox/Skyrim/Mods/WebUI/@skyrim-webui/sdk/src/@skyrim-webui/sdk/WebViewsHostClient", ["Steam/steamapps/common/Skyrim Special Edition - Modding/Data/Platform/Modules/skyrimPlatform"], function (exports_3, context_3) {
    "use strict";
    var skyrimPlatform_1, WebViewsHostClient;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (skyrimPlatform_1_1) {
                skyrimPlatform_1 = skyrimPlatform_1_1;
            }
        ],
        execute: function () {
            WebViewsHostClient = class WebViewsHostClient {
                constructor(javascriptExecutor) {
                    this.replyCallbacks = new Map();
                    this.executeJS = javascriptExecutor;
                }
                onBrowserMessage(messageArguments) {
                    // ['WebUI', 'Reply', replyId, ['MyCoolWebView']]
                    if (messageArguments && messageArguments.length == 4 && messageArguments[0] == 'WebUI' && messageArguments[1] == 'Reply') {
                        const replyId = messageArguments[2];
                        const response = messageArguments[3];
                        if (this.replyCallbacks.has(replyId)) {
                            this.replyCallbacks.get(replyId)(response);
                            this.replyCallbacks.delete(replyId);
                        }
                    }
                }
                getWebViewIds() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return this.getResponse('getWebViewIds');
                    });
                }
                registerWebView(webView) {
                    this.sendRequest('registerWebView', webView);
                }
                addToUI(id) {
                    this.sendRequest('addToUI', id);
                }
                getResponse(functionName, ...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return new Promise(resolve => {
                            const replyId = this.getReplyId();
                            this.replyCallbacks.set(replyId, resolve);
                            this.sendRequest(functionName, replyId, ...args);
                        });
                    });
                }
                sendRequest(functionName, ...args) {
                    skyrimPlatform_1.Debug.messageBox(`SEND REQUEST ${functionName} ${JSON.stringify(args)}`);
                    this.executeJS(`__webViewsHost__.${functionName}(${args.map(arg => JSON.stringify(arg)).join(', ')})`);
                }
                getReplyId() {
                    return `${Math.random()}_${Math.random()}`;
                }
            };
            exports_3("default", WebViewsHostClient);
        }
    };
});
System.register("Users/mrowr/Dropbox/Skyrim/Mods/WebUI/@skyrim-webui/sdk/__tests__/WebViewsHostClient.test", ["puppeteer", "Users/mrowr/Dropbox/Skyrim/Mods/WebUI/@skyrim-webui/sdk/src/@skyrim-webui/sdk/WebViewsHostClient"], function (exports_4, context_4) {
    "use strict";
    var puppeteer, WebViewsHostClient_1;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (puppeteer_1) {
                puppeteer = puppeteer_1;
            },
            function (WebViewsHostClient_1_1) {
                WebViewsHostClient_1 = WebViewsHostClient_1_1;
            }
        ],
        execute: function () {
            describe('WebViewsHostClient SDK for Skyrim Platform', () => {
                const widget1URL = `file://${__dirname}/../../testFixtures/html/widget1.html`;
                const widget2URL = `file://${__dirname}/../../testFixtures/html/widget1.html`;
                let client;
                let browser;
                let page;
                beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { browser = yield puppeteer.launch(); }));
                afterAll(() => __awaiter(void 0, void 0, void 0, function* () { yield browser.close(); }));
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    page = yield browser.newPage();
                    client = new WebViewsHostClient_1.default((script) => { page.evaluate(script); });
                    yield page.exposeFunction('onSkyrimPlatformMessage', (args) => { client.onBrowserMessage(args); });
                    yield page.goto(`file://${__dirname}/../../../WebUI/__WebUI__/webViewsHost.html`);
                    yield page.addScriptTag({ url: `file://${__dirname}/../../testFixtures/delegateSkyrimPlatformMessagesToPuppeteer.js` });
                }));
                // const getReplyId = () => `${Math.random()}_${Math.random()}`
                /*
                 * Tests for the API interface provided by WebViewsHost for Skyrim Platform (using the SDK Client)
                 */
                /*
                 * Skyrim Platform ---> executeJavascript window.__webViewsHost__.[API FUNCTION]
                 * WebViewsHost    ---> window.skyrimPlatform.sendMessage
                 */
                it('can registerWebView', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(yield client.getWebViewIds()).toHaveLength(0);
                    client.registerWebView({ id: "widget1", url: widget1URL });
                    expect(yield client.getWebViewIds()).toEqual(["widget1"]);
                }));
                // it('can getWebViewIds', async () => {
                //     // Is Empty By Default
                //     let replyId = getReplyId()
                //     await page.evaluate((replyId) => { (window as any).__webViewsHost__.getWebViewIds(replyId) }, replyId)
                //     expect(browserMessages[0]).toEqual(
                //         ['WebUI', 'Reply', replyId, []]
                //     )
                //     // Register WebViews
                //     await page.evaluate(() => { (window as any).__webViewsHost__.registerWebView({ id: 'MyFirstWebView', url: 'file:///index.html' }) })
                //     await page.evaluate(() => { (window as any).__webViewsHost__.registerWebView({ id: 'MySecondWebView', url: 'file:///index.html' }) })
                //     // Returns Ids of Registered WebViews
                //     replyId = getReplyId()
                //     await page.evaluate((replyId) => { (window as any).__webViewsHost__.getWebViewIds(replyId) }, replyId)
                //     expect(browserMessages[1]).toEqual(
                //         ['WebUI', 'Reply', replyId, ['MyFirstWebView', 'MySecondWebView']]
                //     )
                // })
                // it('can registerWebView', async () => {
                //     await page.evaluate((widget1URL) => { (window as any).__webViewsHost__.registerWebView({ id: 'MyCoolWebView', url: widget1URL }) }, widget1URL)
                //     const replyId = getReplyId()
                //     await page.evaluate((replyId) => { (window as any).__webViewsHost__.getWebViewIds(replyId) }, replyId)
                //     expect(browserMessages).toHaveLength(1)
                //     expect(browserMessages[0]).toEqual(
                //         ['WebUI', 'Reply', replyId, ['MyCoolWebView']]
                //     )
                // })
                // it('can getWebView', async () => {
                //     const webViewInfo = {
                //         id: 'MyCoolWebView',
                //         url: widget1URL,
                //         x: 69,
                //         y: 420
                //     }
                //     await page.evaluate((webViewInfo) => { (window as any).__webViewsHost__.registerWebView(webViewInfo)}, webViewInfo)
                //     const replyId = getReplyId()
                //     await page.evaluate((replyId) => { (window as any).__webViewsHost__.getWebView(replyId, 'MyCoolWebView') }, replyId)
                //     expect(browserMessages).toHaveLength(1)
                //     expect(browserMessages[0]).toEqual(
                //         ['WebUI', 'Reply', replyId, webViewInfo]
                //     )
                // })
                // it('can unregisterWebView', async () => {
                //     // Register
                //     await page.evaluate((widget1URL) => { (window as any).__webViewsHost__.registerWebView({ id: 'MyCoolWebView', url: widget1URL }) }, widget1URL)
                //     // ID returned
                //     let replyId = getReplyId()
                //     await page.evaluate((replyId) => { (window as any).__webViewsHost__.getWebViewIds(replyId) }, replyId)
                //     expect(browserMessages).toHaveLength(1)
                //     expect(browserMessages[0]).toEqual(
                //         ['WebUI', 'Reply', replyId, ['MyCoolWebView']]
                //     )
                //     // Unregister
                //     await page.evaluate(() => { (window as any).__webViewsHost__.unregisterWebView('MyCoolWebView') })
                //     // ID no longer returned
                //     replyId = getReplyId()
                //     await page.evaluate((replyId) => { (window as any).__webViewsHost__.getWebViewIds(replyId) }, replyId)
                //     expect(browserMessages[1]).toEqual(
                //         ['WebUI', 'Reply', replyId, []]
                //     )
                // })
                // it('can add web view to the UI - addToUI', async () => {
                //     await page.evaluate((widget1URL) => { (window as any).__webViewsHost__.registerWebView({ id: 'MyCoolWebView', url: widget1URL }) }, widget1URL)
                //     expect(await page.evaluate(() => document.querySelectorAll('iframe').length)).toEqual(0)
                //     await page.evaluate(() => { (window as any).__webViewsHost__.addToUI('MyCoolWebView') })
                //     expect(await page.evaluate(() => document.querySelectorAll('iframe').length)).toEqual(1)
                //     expect(await page.evaluate(() => document.querySelector('iframe')?.getAttribute('src'))).toEqual(widget1URL)
                //     const iframe = await page.waitForSelector('iframe')
                //     const frame = await iframe!.contentFrame();
                //     const iframeHtml = await frame?.evaluate(() => document.querySelector('*')?.outerHTML)
                //     expect(iframeHtml).toContain('I am widget 1')
                // })
                // test.todo('cannot add multiple web views with the same identifier')
                // test.todo('web views added to UI are put into the properly style positions')
                // test.todo('can reposition web view currently added to UI')
                // test.todo('can remove web view from the UI - removeFromUI')
                // test.todo('can hide web view in the UI - hide')
                // test.todo('can unhide web view in the UI - show')
                // test.todo('can toggle web view in the UI - toggle')
            });
        }
    };
});
System.register("Users/mrowr/Dropbox/Skyrim/Mods/WebUI/@skyrim-webui/sdk/src/@skyrim-webui/sdk/index", ["Users/mrowr/Dropbox/Skyrim/Mods/WebUI/@skyrim-webui/sdk/src/@skyrim-webui/sdk/WebViewsHostClient", "Steam/steamapps/common/Skyrim Special Edition - Modding/Data/Platform/Modules/skyrimPlatform"], function (exports_5, context_5) {
    "use strict";
    var WebViewsHostClient_2, skyrimPlatform_2, webViewsHostClient;
    var __moduleName = context_5 && context_5.id;
    function getWebViewsHostClient() {
        return webViewsHostClient;
    }
    exports_5("getWebViewsHostClient", getWebViewsHostClient);
    function registerWebView(webView) {
        getWebViewsHostClient().registerWebView(webView);
    }
    exports_5("registerWebView", registerWebView);
    function getWebViewIds() {
        return __awaiter(this, void 0, void 0, function* () {
            return getWebViewsHostClient().getWebViewIds();
        });
    }
    exports_5("getWebViewIds", getWebViewIds);
    function addToUI(id) {
        getWebViewsHostClient().addToUI(id);
    }
    exports_5("addToUI", addToUI);
    return {
        setters: [
            function (WebViewsHostClient_2_1) {
                WebViewsHostClient_2 = WebViewsHostClient_2_1;
            },
            function (skyrimPlatform_2_1) {
                skyrimPlatform_2 = skyrimPlatform_2_1;
            }
        ],
        execute: function () {
            webViewsHostClient = new WebViewsHostClient_2.default((script) => { skyrimPlatform_2.browser.executeJavaScript(script); });
            skyrimPlatform_2.on('browserMessage', message => {
                webViewsHostClient.onBrowserMessage(message.arguments);
            });
        }
    };
});
