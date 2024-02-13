import axios from "axios"
import { failed } from "./utils"

const testUrl = async (url: string) => {
    try {
        const res = await axios.get(url)
        expect(res.status).toBeCloseTo(200)
        expect(res.data).toBeTruthy()
    } catch (e) {
        failed(`Url: ${url}\nError: ${e}`)
    }

}

test('Test Public apis', async () => {
    // Homepage
    await testUrl("https://paweljastrzebski.github.io/mute8")
    // Devtools UI
    await testUrl("https://paweljastrzebski.github.io/mute8-devtools")
    // Devtools Client
    await testUrl("https://raw.githubusercontent.com/PawelJastrzebski/mute8/devtool/devtools-client/dist/devtools-v1.mjs")
})