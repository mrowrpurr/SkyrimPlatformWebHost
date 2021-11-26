import { on, once } from "skyrimPlatform"
import StartRuntime from "./Runtime"
import BrowserMessageHandler from './BrowerMessageHandler'
import ConsoleMessageHandler from './ConsoleMessageHandler'

export default function main() {
    once("tick", StartRuntime)
    // on("browserMessage", BrowserMessageHandler)
    // on("consoleMessage", ConsoleMessageHandler)
}
