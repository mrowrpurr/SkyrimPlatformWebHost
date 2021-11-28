/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/SkyrimAPI.ts":
/*!**************************!*\
  !*** ./src/SkyrimAPI.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


/*
 * HTML Web Frontend
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkyrimAPI = void 0;
class SkyrimAPI {
    hello() {
        alert('HELLO THERE');
    }
}
exports.SkyrimAPI = SkyrimAPI;
const api = new SkyrimAPI();
exports["default"] = api;


/***/ }),

/***/ "./src/WebView.ts":
/*!************************!*\
  !*** ./src/WebView.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
 * HTML Web Frontend
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const WebViewHost_1 = __webpack_require__(/*! ./WebViewHost */ "./src/WebViewHost.ts");
class WebView {
    constructor(properties, webViewHost = undefined) {
        this.id = properties.id;
        this.url = properties.url;
        this.position = properties.position;
        this.visible = properties.visible;
        if (!webViewHost)
            webViewHost = WebViewHost_1.webViewHostInstance;
        this.webViewHost = webViewHost;
    }
    on(messageType, callback) {
        this.webViewHost.on(messageType, this.id, callback);
    }
    send(messageType, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webViewHost.send(messageType, this.id, message);
        });
    }
    reply(request, response) {
        this.webViewHost.reply(request, this.id, response);
    }
}
exports["default"] = WebView;


/***/ }),

/***/ "./src/WebViewHost.ts":
/*!****************************!*\
  !*** ./src/WebViewHost.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
 * HTML Web Frontend
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.webViewHostInstance = exports.WebViewHost = void 0;
const WebView_1 = __webpack_require__(/*! ./WebView */ "./src/WebView.ts");
class WebViewHost {
    constructor() {
        this.webViews = new Map();
        this.iframesByName = new Map();
        this.requestResultPromises = new Map();
        this.messageCallbacks = new Map();
        this.messageResponsePromises = new Map();
    }
    getWebView(id) {
        return this.webViews.get(id);
    }
    addFromProps(webViewProps) {
        this.add(new WebView_1.default(webViewProps));
    }
    add(webView) {
        if (this.webViews.has(webView.id))
            this.remove(webView.id);
        else
            this.webViews.set(webView.id, webView);
        const iframe = document.createElement('iframe');
        this.iframesByName.set(webView.id, iframe);
        iframe.style.left = (window.innerWidth * (webView.position.x / 100)).toFixed() + 'px';
        iframe.style.top = (window.innerHeight * (webView.position.y / 100)).toFixed() + 'px';
        iframe.style.height = (window.innerHeight * (webView.position.height / 100)).toFixed() + 'px';
        iframe.style.width = (window.innerWidth * (webView.position.width / 100)).toFixed() + 'px';
        iframe.frameBorder = '0';
        iframe.scrolling = 'false';
        iframe.src = webView.url;
        document.documentElement.appendChild(iframe);
        if (iframe.contentWindow) {
            iframe.contentWindow.onerror = function (msg, url, linenumber) {
                alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
                return true;
            };
            iframe.contentWindow.addEventListener('load', () => {
                this.send('load', webView.id, {
                    viewId: webView.id
                });
            });
        }
    }
    remove(id) {
        this.webViews.delete(id);
        const iframe = this.iframesByName.get(id);
        document.documentElement.removeChild(iframe);
        this.iframesByName.delete(id);
    }
    on(messageType, viewId, callback) {
        if (!this.messageCallbacks.has(messageType))
            this.messageCallbacks.set(messageType, Array());
        const callbacks = this.messageCallbacks.get(messageType);
        if (callbacks)
            callbacks.push({ viewId, callback });
    }
    send(messageType, viewId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.source)
                message.source = viewId;
            if (!message.target)
                message.target = viewId;
            if (messageType == 'request') {
                if (!message.replyId)
                    message.replyId = this.getUniqueReplyId();
                return new Promise(resolve => {
                    window.skyrimPlatform.sendMessage('WebUI', { messageType, message, target: viewId });
                    this.messageResponsePromises.set(message.replyId, resolve);
                });
            }
            else {
                return new Promise(resolve => {
                    window.skyrimPlatform.sendMessage('WebUI', { messageType, message, target: viewId });
                    resolve(undefined);
                });
            }
        });
    }
    // TODO: abstract window.skyrimPlatform with an object we can provide to the webviewhost
    reply(request, viewId, response) {
        window.skyrimPlatform.sendMessage('WebUI', {
            target: viewId,
            messageType: 'response',
            message: { replyId: request.replyId, response: response }
        });
    }
    onReply(properties) {
        if (this.messageResponsePromises.has(properties.replyId)) {
            const response = properties;
            this.messageResponsePromises.get(properties.replyId)(response);
            this.messageResponsePromises.delete(properties.replyId);
        }
    }
    // TODO: refactor the viewId / target inconsistencies
    invokeMessage(properties) {
        const callbacks = this.messageCallbacks.get(properties.messageType);
        if (callbacks)
            callbacks.forEach(callback => {
                if ((!callback.viewId) || callback.viewId == properties.viewId)
                    callback.callback(properties.message);
            });
    }
    getUniqueReplyId() {
        return `${Math.random()}_${Math.random()}`;
    }
}
exports.WebViewHost = WebViewHost;
exports.webViewHostInstance = new WebViewHost();
exports["default"] = exports.webViewHostInstance;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const SkyrimAPI_1 = __webpack_require__(/*! ./SkyrimAPI */ "./src/SkyrimAPI.ts");
const WebViewHost_1 = __webpack_require__(/*! ./WebViewHost */ "./src/WebViewHost.ts");
const WebView_1 = __webpack_require__(/*! ./WebView */ "./src/WebView.ts");
window.__webViewHost = WebViewHost_1.default;
window.getWebView = (id) => WebViewHost_1.default.getWebView(id);
window.skyrim = SkyrimAPI_1.default;
window.WebView = WebView_1.default;
window.addEventListener('load', () => {
    window.skyrimPlatform.sendMessage('WebUI', { messageType: 'webviewhostloaded' });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFXLENBQUMsT0FBTyxFQUFFLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLENBQUM7QUFDN0YsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2t5cmltLXdlYnVpLWNvbXBvbmVudGhvc3QvLi9zcmMvU2t5cmltQVBJLnRzIiwid2VicGFjazovL3NreXJpbS13ZWJ1aS1jb21wb25lbnRob3N0Ly4vc3JjL1dlYlZpZXcudHMiLCJ3ZWJwYWNrOi8vc2t5cmltLXdlYnVpLWNvbXBvbmVudGhvc3QvLi9zcmMvV2ViVmlld0hvc3QudHMiLCJ3ZWJwYWNrOi8vc2t5cmltLXdlYnVpLWNvbXBvbmVudGhvc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2t5cmltLXdlYnVpLWNvbXBvbmVudGhvc3QvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogSFRNTCBXZWIgRnJvbnRlbmRcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgU2t5cmltQVBJIHtcclxuICAgIHB1YmxpYyBoZWxsbygpIHtcclxuICAgICAgICBhbGVydCgnSEVMTE8gVEhFUkUnKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBhcGkgPSBuZXcgU2t5cmltQVBJKClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFwaSIsIi8qXHJcbiAqIEhUTUwgV2ViIEZyb250ZW5kXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgV2ViVmlld01lc3NhZ2UsIFdlYlZpZXdFdmVudCwgV2ViVmlld1JlcXVlc3QsIFdlYlZpZXdSZXNwb25zZSB9IGZyb20gJy4vV2ViVmlld0V2ZW50cydcclxuaW1wb3J0IHsgV2ViVmlld0hvc3QsIHdlYlZpZXdIb3N0SW5zdGFuY2UgfSBmcm9tICcuL1dlYlZpZXdIb3N0J1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXZWJWaWV3U2NyZWVuUG9zaXRpb24ge1xyXG4gICAgeDogbnVtYmVyLFxyXG4gICAgeTogbnVtYmVyLFxyXG4gICAgd2lkdGg6IG51bWJlcixcclxuICAgIGhlaWdodDogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV2ViVmlld1Byb3BzIHtcclxuICAgIGlkOiBzdHJpbmcsXHJcbiAgICB1cmw6IHN0cmluZyxcclxuICAgIHBvc2l0aW9uOiBXZWJWaWV3U2NyZWVuUG9zaXRpb24sXHJcbiAgICB2aXNpYmxlOiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlZpZXcge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgdXJsOiBzdHJpbmdcclxuICAgIHBvc2l0aW9uOiBXZWJWaWV3U2NyZWVuUG9zaXRpb25cclxuICAgIHZpc2libGU6IGJvb2xlYW5cclxuICAgIHdlYlZpZXdIb3N0OiBXZWJWaWV3SG9zdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IFdlYlZpZXdQcm9wcywgd2ViVmlld0hvc3Q6IFdlYlZpZXdIb3N0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IHByb3BlcnRpZXMuaWRcclxuICAgICAgICB0aGlzLnVybCA9IHByb3BlcnRpZXMudXJsXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHByb3BlcnRpZXMucG9zaXRpb25cclxuICAgICAgICB0aGlzLnZpc2libGUgPSBwcm9wZXJ0aWVzLnZpc2libGVcclxuICAgICAgICBpZiAoIXdlYlZpZXdIb3N0KVxyXG4gICAgICAgICAgICB3ZWJWaWV3SG9zdCA9IHdlYlZpZXdIb3N0SW5zdGFuY2VcclxuICAgICAgICB0aGlzLndlYlZpZXdIb3N0ID0gd2ViVmlld0hvc3QhXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uKG1lc3NhZ2VUeXBlOiAnZXZlbnQnLCBjYWxsYmFjazogKG1lc3NhZ2U6IFdlYlZpZXdFdmVudCkgPT4gdm9pZCk6IHZvaWRcclxuICAgIHB1YmxpYyBvbihtZXNzYWdlVHlwZTogJ3JlcXVlc3QnLCBjYWxsYmFjazogKG1lc3NhZ2U6IFdlYlZpZXdSZXF1ZXN0KSA9PiB2b2lkKTogdm9pZFxyXG4gICAgcHVibGljIG9uKG1lc3NhZ2VUeXBlOiAnbWVzc2FnZScsIGNhbGxiYWNrOiAobWVzc2FnZTogV2ViVmlld01lc3NhZ2UpID0+IHZvaWQpOiB2b2lkXHJcbiAgICBwdWJsaWMgb24obWVzc2FnZVR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnkpID0+IHZvaWQpOiB2b2lkXHJcbiAgICBwdWJsaWMgb24obWVzc2FnZVR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLndlYlZpZXdIb3N0Lm9uKG1lc3NhZ2VUeXBlLCB0aGlzLmlkLCBjYWxsYmFjaylcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2VuZChtZXNzYWdlVHlwZTogJ2V2ZW50JywgbWVzc2FnZTogV2ViVmlld0V2ZW50KTogUHJvbWlzZTxhbnk+XHJcbiAgICBwdWJsaWMgYXN5bmMgc2VuZChtZXNzYWdlVHlwZTogJ3JlcXVlc3QnLCBtZXNzYWdlOiBXZWJWaWV3UmVxdWVzdCk6IFByb21pc2U8V2ViVmlld1Jlc3BvbnNlPlxyXG4gICAgcHVibGljIGFzeW5jIHNlbmQobWVzc2FnZVR5cGU6ICdtZXNzYWdlJywgbWVzc2FnZTogV2ViVmlld01lc3NhZ2UpOiBQcm9taXNlPGFueT5cclxuICAgIHB1YmxpYyBhc3luYyBzZW5kKG1lc3NhZ2VUeXBlOiAnbG9hZCcsIG1lc3NhZ2U6IFdlYlZpZXdNZXNzYWdlKTogUHJvbWlzZTxhbnk+XHJcbiAgICBwdWJsaWMgYXN5bmMgc2VuZChtZXNzYWdlVHlwZTogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiBQcm9taXNlPGFueT5cclxuICAgIHB1YmxpYyBhc3luYyBzZW5kKG1lc3NhZ2VUeXBlOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2ViVmlld0hvc3Quc2VuZChtZXNzYWdlVHlwZSwgdGhpcy5pZCwgbWVzc2FnZSlcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVwbHkocmVxdWVzdDogV2ViVmlld1JlcXVlc3QsIHJlc3BvbnNlOiBXZWJWaWV3UmVzcG9uc2UpIHtcclxuICAgICAgICB0aGlzLndlYlZpZXdIb3N0LnJlcGx5KHJlcXVlc3QsIHRoaXMuaWQsIHJlc3BvbnNlKVxyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiAqIEhUTUwgV2ViIEZyb250ZW5kXHJcbiAqL1xyXG5cclxuaW1wb3J0IFdlYlZpZXcsIHsgV2ViVmlld1Byb3BzIH0gZnJvbSAnLi9XZWJWaWV3J1xyXG5pbXBvcnQgeyBXZWJWaWV3TWVzc2FnZSwgV2ViVmlld0V2ZW50LCBXZWJWaWV3UmVxdWVzdCwgV2ViVmlld1Jlc3BvbnNlIH0gZnJvbSAnLi9XZWJWaWV3RXZlbnRzJ1xyXG5cclxuaW50ZXJmYWNlIFdlYlZpZXdFdmVudENhbGxiYWNrIHtcclxuICAgIHZpZXdJZDogc3RyaW5nLFxyXG4gICAgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnkpID0+IGFueVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSW52b2tlTWVzc2FnZVByb3BzIHtcclxuICAgIG1lc3NhZ2VUeXBlOiBzdHJpbmcsIHZpZXdJZDogc3RyaW5nLCBtZXNzYWdlOiBhbnlcclxufVxyXG5cclxuaW50ZXJmYWNlIE9uUmVwbHlQcm9wcyBleHRlbmRzIFdlYlZpZXdSZXNwb25zZSB7XHJcbiAgICByZXBseUlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdlYlZpZXdIb3N0IHtcclxuICAgIHdlYlZpZXdzID0gbmV3IE1hcDxzdHJpbmcsIFdlYlZpZXc+KClcclxuICAgIGlmcmFtZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgSFRNTElGcmFtZUVsZW1lbnQ+KClcclxuICAgIHJlcXVlc3RSZXN1bHRQcm9taXNlcyA9IG5ldyBNYXA8c3RyaW5nLCAoZGF0YTogYW55KSA9PiB2b2lkPigpXHJcbiAgICBtZXNzYWdlQ2FsbGJhY2tzID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PFdlYlZpZXdFdmVudENhbGxiYWNrPj4oKVxyXG4gICAgbWVzc2FnZVJlc3BvbnNlUHJvbWlzZXMgPSBuZXcgTWFwPHN0cmluZywgKHJlc3BvbnNlOiBXZWJWaWV3UmVzcG9uc2UpID0+IHZvaWQ+KClcclxuXHJcbiAgICBwdWJsaWMgZ2V0V2ViVmlldyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2ViVmlld3MuZ2V0KGlkKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRGcm9tUHJvcHMod2ViVmlld1Byb3BzOiBXZWJWaWV3UHJvcHMpIHtcclxuICAgICAgICB0aGlzLmFkZChuZXcgV2ViVmlldyh3ZWJWaWV3UHJvcHMpKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGQod2ViVmlldzogV2ViVmlldykge1xyXG4gICAgICAgIGlmICh0aGlzLndlYlZpZXdzLmhhcyh3ZWJWaWV3LmlkKSlcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUod2ViVmlldy5pZClcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMud2ViVmlld3Muc2V0KHdlYlZpZXcuaWQsIHdlYlZpZXcpXHJcbiAgICAgICAgY29uc3QgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJylcclxuICAgICAgICB0aGlzLmlmcmFtZXNCeU5hbWUuc2V0KHdlYlZpZXcuaWQsIGlmcmFtZSlcclxuICAgICAgICBpZnJhbWUuc3R5bGUubGVmdCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAqICh3ZWJWaWV3LnBvc2l0aW9uLnggLyAxMDApKS50b0ZpeGVkKCkgKyAncHgnXHJcbiAgICAgICAgaWZyYW1lLnN0eWxlLnRvcCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgKiAod2ViVmlldy5wb3NpdGlvbi55IC8gMTAwKSkudG9GaXhlZCgpICsgJ3B4J1xyXG4gICAgICAgIGlmcmFtZS5zdHlsZS5oZWlnaHQgPSAod2luZG93LmlubmVySGVpZ2h0ICogKHdlYlZpZXcucG9zaXRpb24uaGVpZ2h0IC8gMTAwKSkudG9GaXhlZCgpICsgJ3B4J1xyXG4gICAgICAgIGlmcmFtZS5zdHlsZS53aWR0aCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAqICh3ZWJWaWV3LnBvc2l0aW9uLndpZHRoIC8gMTAwKSkudG9GaXhlZCgpICsgJ3B4J1xyXG4gICAgICAgIGlmcmFtZS5mcmFtZUJvcmRlciA9ICcwJ1xyXG4gICAgICAgIGlmcmFtZS5zY3JvbGxpbmcgPSAnZmFsc2UnXHJcbiAgICAgICAgaWZyYW1lLnNyYyA9IHdlYlZpZXcudXJsXHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGlmcmFtZSlcclxuICAgICAgICBpZiAoaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcclxuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1zZywgdXJsLCBsaW5lbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnRXJyb3IgbWVzc2FnZTogJyArIG1zZyArICdcXG5VUkw6ICcgKyB1cmwgKyAnXFxuTGluZSBOdW1iZXI6ICcgKyBsaW5lbnVtYmVyKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kKCdsb2FkJywgd2ViVmlldy5pZCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdJZDogd2ViVmlldy5pZFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy53ZWJWaWV3cy5kZWxldGUoaWQpXHJcbiAgICAgICAgY29uc3QgaWZyYW1lID0gdGhpcy5pZnJhbWVzQnlOYW1lLmdldChpZClcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoaWZyYW1lISlcclxuICAgICAgICB0aGlzLmlmcmFtZXNCeU5hbWUuZGVsZXRlKGlkKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbihtZXNzYWdlVHlwZTogJ2V2ZW50Jywgdmlld0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAobWVzc2FnZTogV2ViVmlld0V2ZW50KSA9PiB2b2lkKTogdm9pZFxyXG4gICAgcHVibGljIG9uKG1lc3NhZ2VUeXBlOiAncmVxdWVzdCcsIHZpZXdJZDogc3RyaW5nLCBjYWxsYmFjazogKG1lc3NhZ2U6IFdlYlZpZXdSZXF1ZXN0KSA9PiB2b2lkKTogdm9pZFxyXG4gICAgcHVibGljIG9uKG1lc3NhZ2VUeXBlOiAnbWVzc2FnZScsIHZpZXdJZDogc3RyaW5nLCBjYWxsYmFjazogKG1lc3NhZ2U6IFdlYlZpZXdNZXNzYWdlKSA9PiB2b2lkKTogdm9pZFxyXG4gICAgcHVibGljIG9uKG1lc3NhZ2VUeXBlOiBzdHJpbmcsIHZpZXdJZDogc3RyaW5nLCBjYWxsYmFjazogKG1lc3NhZ2U6IGFueSkgPT4gdm9pZCk6IHZvaWRcclxuICAgIHB1YmxpYyBvbihtZXNzYWdlVHlwZTogc3RyaW5nLCB2aWV3SWQ6IHN0cmluZywgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMubWVzc2FnZUNhbGxiYWNrcy5oYXMobWVzc2FnZVR5cGUpKVxyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VDYWxsYmFja3Muc2V0KG1lc3NhZ2VUeXBlLCBBcnJheTxXZWJWaWV3RXZlbnRDYWxsYmFjaz4oKSlcclxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLm1lc3NhZ2VDYWxsYmFja3MuZ2V0KG1lc3NhZ2VUeXBlKVxyXG4gICAgICAgIGlmIChjYWxsYmFja3MpXHJcbiAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKHsgdmlld0lkLCBjYWxsYmFjayB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZW5kKG1lc3NhZ2VUeXBlOiAnbWVzc2FnZScsIHZpZXdJZDogc3RyaW5nLCBtZXNzYWdlOiBXZWJWaWV3TWVzc2FnZSk6IFByb21pc2U8dW5kZWZpbmVkPlxyXG4gICAgcHVibGljIGFzeW5jIHNlbmQobWVzc2FnZVR5cGU6ICdldmVudCcsIHZpZXdJZDogc3RyaW5nLCBtZXNzYWdlOiBXZWJWaWV3RXZlbnQpOiBQcm9taXNlPHVuZGVmaW5lZD5cclxuICAgIHB1YmxpYyBhc3luYyBzZW5kKG1lc3NhZ2VUeXBlOiAncmVxdWVzdCcsIHZpZXdJZDogc3RyaW5nLCBtZXNzYWdlOiBXZWJWaWV3UmVxdWVzdCk6IFByb21pc2U8V2ViVmlld1Jlc3BvbnNlPlxyXG4gICAgcHVibGljIGFzeW5jIHNlbmQobWVzc2FnZVR5cGU6ICdsb2FkJywgdmlld0lkOiBzdHJpbmcsIG1lc3NhZ2U6IFdlYlZpZXdNZXNzYWdlKTogUHJvbWlzZTx1bmRlZmluZWQ+XHJcbiAgICBwdWJsaWMgYXN5bmMgc2VuZChtZXNzYWdlVHlwZTogc3RyaW5nLCB2aWV3SWQ6IHN0cmluZywgbWVzc2FnZTogYW55KTogUHJvbWlzZTx1bmRlZmluZWQ+XHJcbiAgICBwdWJsaWMgYXN5bmMgc2VuZChtZXNzYWdlVHlwZTogc3RyaW5nLCB2aWV3SWQ6IHN0cmluZywgbWVzc2FnZTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBpZiAoIW1lc3NhZ2Uuc291cmNlKSBtZXNzYWdlLnNvdXJjZSA9IHZpZXdJZFxyXG4gICAgICAgIGlmICghbWVzc2FnZS50YXJnZXQpIG1lc3NhZ2UudGFyZ2V0ID0gdmlld0lkXHJcbiAgICAgICAgaWYgKG1lc3NhZ2VUeXBlID09ICdyZXF1ZXN0Jykge1xyXG4gICAgICAgICAgICBpZiAoIW1lc3NhZ2UucmVwbHlJZCkgbWVzc2FnZS5yZXBseUlkID0gdGhpcy5nZXRVbmlxdWVSZXBseUlkKClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFdlYlZpZXdSZXNwb25zZT4ocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAod2luZG93IGFzIGFueSkuc2t5cmltUGxhdGZvcm0uc2VuZE1lc3NhZ2UoJ1dlYlVJJywgeyBtZXNzYWdlVHlwZSwgbWVzc2FnZSwgdGFyZ2V0OiB2aWV3SWQgfSlcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZVJlc3BvbnNlUHJvbWlzZXMuc2V0KG1lc3NhZ2UucmVwbHlJZCwgcmVzb2x2ZSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dW5kZWZpbmVkPihyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5za3lyaW1QbGF0Zm9ybS5zZW5kTWVzc2FnZSgnV2ViVUknLCB7IG1lc3NhZ2VUeXBlLCBtZXNzYWdlLCB0YXJnZXQ6IHZpZXdJZCB9KVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IGFic3RyYWN0IHdpbmRvdy5za3lyaW1QbGF0Zm9ybSB3aXRoIGFuIG9iamVjdCB3ZSBjYW4gcHJvdmlkZSB0byB0aGUgd2Vidmlld2hvc3RcclxuXHJcbiAgICBwdWJsaWMgcmVwbHkocmVxdWVzdDogV2ViVmlld1JlcXVlc3QsIHZpZXdJZDogc3RyaW5nLCByZXNwb25zZTogV2ViVmlld1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLnNreXJpbVBsYXRmb3JtLnNlbmRNZXNzYWdlKCdXZWJVSScsIHtcclxuICAgICAgICAgICAgdGFyZ2V0OiB2aWV3SWQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VUeXBlOiAncmVzcG9uc2UnLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiB7IHJlcGx5SWQ6IHJlcXVlc3QucmVwbHlJZCwgcmVzcG9uc2U6IHJlc3BvbnNlIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJlcGx5KHByb3BlcnRpZXM6IE9uUmVwbHlQcm9wcykge1xyXG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VSZXNwb25zZVByb21pc2VzLmhhcyhwcm9wZXJ0aWVzLnJlcGx5SWQpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gcHJvcGVydGllcyBhcyBXZWJWaWV3UmVzcG9uc2VcclxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlUmVzcG9uc2VQcm9taXNlcy5nZXQocHJvcGVydGllcy5yZXBseUlkKSEocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZVJlc3BvbnNlUHJvbWlzZXMuZGVsZXRlKHByb3BlcnRpZXMucmVwbHlJZClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdGhlIHZpZXdJZCAvIHRhcmdldCBpbmNvbnNpc3RlbmNpZXNcclxuICAgIHB1YmxpYyBpbnZva2VNZXNzYWdlKHByb3BlcnRpZXM6IEludm9rZU1lc3NhZ2VQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMubWVzc2FnZUNhbGxiYWNrcy5nZXQocHJvcGVydGllcy5tZXNzYWdlVHlwZSlcclxuICAgICAgICBpZiAoY2FsbGJhY2tzKVxyXG4gICAgICAgICAgICBjYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKCFjYWxsYmFjay52aWV3SWQpIHx8IGNhbGxiYWNrLnZpZXdJZCA9PSBwcm9wZXJ0aWVzLnZpZXdJZClcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsYmFjayhwcm9wZXJ0aWVzLm1lc3NhZ2UpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFVuaXF1ZVJlcGx5SWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke01hdGgucmFuZG9tKCl9XyR7TWF0aC5yYW5kb20oKX1gXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB3ZWJWaWV3SG9zdEluc3RhbmNlID0gbmV3IFdlYlZpZXdIb3N0KClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdlYlZpZXdIb3N0SW5zdGFuY2VcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCBTa3lyaW1BUEkgZnJvbSAnLi9Ta3lyaW1BUEknXHJcbmltcG9ydCBXZWJWaWV3SG9zdCBmcm9tICcuL1dlYlZpZXdIb3N0J1xyXG5pbXBvcnQgV2ViVmlldyBmcm9tICcuL1dlYlZpZXcnXHJcblxyXG4od2luZG93IGFzIGFueSkuX193ZWJWaWV3SG9zdCA9IFdlYlZpZXdIb3N0O1xyXG4od2luZG93IGFzIGFueSkuZ2V0V2ViVmlldyA9IChpZDogc3RyaW5nKSA9PiBXZWJWaWV3SG9zdC5nZXRXZWJWaWV3KGlkKTtcclxuKHdpbmRvdyBhcyBhbnkpLnNreXJpbSA9IFNreXJpbUFQSTtcclxuKHdpbmRvdyBhcyBhbnkpLldlYlZpZXcgPSBXZWJWaWV3XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgICh3aW5kb3cgYXMgYW55KS5za3lyaW1QbGF0Zm9ybS5zZW5kTWVzc2FnZSgnV2ViVUknLCB7IG1lc3NhZ2VUeXBlOiAnd2Vidmlld2hvc3Rsb2FkZWQnIH0pXHJcbn0pXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==