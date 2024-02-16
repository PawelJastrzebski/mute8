
import { testUrl } from "./utils"
import * as fs from "fs/promises"


const HOMEPAGE_URL = "https://paweljastrzebski.github.io/mute8"
const DEVTOOLS_UI_URL = "https://paweljastrzebski.github.io/mute8-devtools"
const DEVTOOLS_SCRIPT_URL = "https://paweljastrzebski.github.io/mute8/devtools/v1.mjs"

test('Test Public apis', async () => {
    // Homepage
    await testUrl(HOMEPAGE_URL)
    // Devtools UI
    await testUrl(DEVTOOLS_UI_URL)
    // Devtools Client
    await testUrl(DEVTOOLS_SCRIPT_URL)
})

describe("Validate project files & configuration", () => {

    test('Test /docs/devtools', async () => {
        const file = await fs.readFile("docs/devtools/v1.mjs");
        const fileContent = file.toString()

        expect(fileContent).toContain(DEVTOOLS_UI_URL)
        expect(fileContent).toContain("MUTE-8-DEVTOOLS")
    })

    test('Test packages/mute8', async () => {
        const file = await fs.readFile("packages/mute8/dist/mute8.js");
        const fileContent = file.toString()

        // exports
        expect(fileContent).toContain("newStore")
        expect(fileContent).toContain("buildProxy")
    })

    test('Test packages/mute8-plugins', async () => {
        const file = await fs.readFile("packages/mute8-plugins/dist/mute8-plugins.js");
        const fileContent = file.toString()

        // devtools
        expect(fileContent).toContain(DEVTOOLS_SCRIPT_URL)
        expect(fileContent).toContain("MUTE-8-DEVTOOLS")
        // exports
        expect(fileContent).toContain("DevTools")
        expect(fileContent).toContain("CombinePlugins")
        expect(fileContent).toContain("LocalStoragePlugin")
    })

})

