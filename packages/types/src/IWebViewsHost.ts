import IBrowserExtension from './IBrowserExtension'
import IWebView, { WebViewPosition } from './IWebView'

export interface ScreenDimensions {
    width: number
    height: number
}

export default interface IWebViewsHost extends IBrowserExtension {
    registerWebView(webView: IWebView): Promise<boolean>
    unregisterWebView(id: string): Promise<boolean>
    getWebViews(): Promise<Array<IWebView>>
    getWebViewIds(): Promise<Array<string>>
    getWebView(id: string): Promise<IWebView | undefined>
    updateWebView(webView: IWebView): Promise<boolean>
    hasWebView(id: string): Promise<boolean>
    addWebViewToUI(id: string): Promise<boolean>
    removeWebViewFromUI(id: string): Promise<boolean>
    showWebView(id: string): Promise<boolean>
    hideWebView(id: string): Promise<boolean>
    setWebViewMenuMode(id: string, menuMode: boolean): Promise<boolean>
    getScreenDimensions(): Promise<ScreenDimensions>
    moveWebView(id: string, position: WebViewPosition): Promise<boolean>
    redirectWebViewUrl(id: string, url: string): Promise<boolean>
}