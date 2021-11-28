import getWebEnvironment from './env'
import WebView from '@Modules/WebUI/WebView'

describe("testing", () => {
    it("something", () => {
        const env = getWebEnvironment()
        expect(env.window.document.querySelectorAll('iframe')).toHaveLength(0)
        const view = new WebView({
            id: 'Something',
            url: 'file://index.html',
            position: { x: 0, y: 0, height: 10, width: 10 },
            visible: false
        })
        expect(env.window.document.querySelectorAll('iframe')).toHaveLength(0)
        view.addToUI()
        expect(env.window.document.querySelectorAll('iframe')).toHaveLength(1)
    })
})