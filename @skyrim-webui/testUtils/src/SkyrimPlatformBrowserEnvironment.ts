import { JSDOM, DOMWindow } from 'jsdom'

export class SkyrimPlatformBrowserEnvironment {
    public dom: JSDOM | undefined
    public document: Document | undefined
    public window: DOMWindow | undefined

    constructor() {
        this.dom = new JSDOM('', { runScripts: 'dangerously', resources: 'usable', url: 'file:///index.html' })
        this.window = this.dom.window
        this.document = this.dom.window.document
    }

    public querySelector(selector: string) {
        return this.document?.querySelector(selector)
    }

    public querySelectorAll(selector: string) {
        return this.document?.querySelectorAll(selector)
    }

    public getElementById(id: string) {
        return this.document?.getElementById(id)
    }

    public async runJavaScript(js: string): Promise<void> {
        if (this.document) {
            const script = this.document.createElement('script')
            script.textContent = js
            return new Promise(resolve => {
                script.onload = () => { resolve() }
                this.document!.body.appendChild(script)
            })
        } else {
            return new Promise(resolve => { resolve() })
        }
    }

    public runFunction(functionName: string, ...args: any[]) {
        return this.runJavaScript(`${functionName}(${args.map(arg => JSON.stringify(arg)).join(', ')})`)
    }
}