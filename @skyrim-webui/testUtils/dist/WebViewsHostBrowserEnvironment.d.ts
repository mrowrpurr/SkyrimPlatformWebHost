import { SkyrimPlatformBrowserEnvironment } from './skyrimPlatformBrowserEnvironment';
export declare class WebViewsHostBrowserEnvironment extends SkyrimPlatformBrowserEnvironment {
    load(webViewsHostJsPath: string): Promise<void>;
    runWebViewsBrowserFunction(functionName: string, ...args: any[]): Promise<void>;
}
export declare function getWebViewsHostBrowserEnvironment(webViewsHostJsPath: string): Promise<WebViewsHostBrowserEnvironment>;