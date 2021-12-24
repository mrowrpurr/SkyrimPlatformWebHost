import { IWebView } from '@skyrim-webui/types'
import { IWebViewsHost } from '@skyrim-webui/types'

export default class WebViewsHostSkyrimPlatformAPI {
    private _webViewsHost: IWebViewsHost

    constructor(webViewsHost: IWebViewsHost) {
        this._webViewsHost = webViewsHost
    }

    private reply(replyId: string, data: any) {
        (window as any).skyrimPlatform.sendMessage(['WebUI', 'Reply', replyId, data])
    }

    async getWebViewIds(replyId: string) {
        this.reply(replyId, await this._webViewsHost.getWebViewIds())
    }

    // TODO : consider having all functions reply() with the boolean responses
    registerWebView(webView: IWebView) {
        this._webViewsHost.registerWebView(webView)
    }

    unregisterWebView(id: string) {
        this._webViewsHost.unregisterWebView(id)
    }

    updateWebView(webView: IWebView) {
        this._webViewsHost.updateWebView(webView)
    }

    async getWebView(replyId: string, id: string) {
        this.reply(replyId, await this._webViewsHost.getWebView(id))
    }

    addWebViewToUI(id: string) {
        this._webViewsHost.addWebViewToUI(id)
    }

    removeWebViewFromUI(id: string) {
        this._webViewsHost.removeWebViewFromUI(id)
    }

    async getScreenDimensions(replyId: string) {
        this.reply(replyId, await this._webViewsHost.getScreenDimensions())
    }










    // update(id: string, { url, positionType, x, y, width, height } : { url?: string, positionType?: string, x?: number, y?: number, width?: number, height?: number }) {
    //     const webView = this.webViews.get(id)
    //     if (webView) {
    //         if (url) webView.url = url
    //         if (positionType) webView.positionType = positionType
    //         if (x) webView.x = x
    //         if (y) webView.y = y
    //         if (width) webView.width = width
    //         if (height) webView.height = height
    //     }
    // }

    // isInUI(replyId: string, id: string) {
    //     this.reply(replyId, this.iframes.has(id))
    // }

    // move(id: string, { positionType, x, y, width, height } : { positionType?: string, x?: number, y?: number, width?: number, height?: number }) {
    //     const iframe = this.iframes.get(id)
    //     if (iframe) {
    //         const webView = this.webViews.get(id)
    //         if (webView) {
    //             // TODO --> use update
    //             if (positionType) webView.positionType = positionType
    //             if (x) webView.x = x
    //             if (y) webView.y = y
    //             if (width) webView.width = width
    //             if (height) webView.height = height
    //             this.setIframePosition(iframe, webView)
    //         }
    //     }
    // }
}