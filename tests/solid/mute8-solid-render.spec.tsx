/**
 * @jest-environment jsdom
 */
import {render, renderWait} from "./utils"
import { newStore } from "../../packages/mute8-solid"

describe("Solid rendering", () => {

    test('Simple counter', async () => {
        const store = newStore({
            value: { counter: 1 }
        })

        function TestCounter() {
            const [count,] = store.solid.useOne('counter')
            return (<div id="count-value">{count()}</div>)
        }

        // render
        const root = await render(<TestCounter />)
        const getText = () => root.querySelector("#count-value")?.innerHTML
        expect(getText()).toEqual("1")
        // increment
        store.mut(v => v.counter++)
        await renderWait()
        expect(getText()).toEqual("2")
        // add 10
        store.counter = store.counter + 10
        await renderWait()
        expect(getText()).toEqual("12")
    });

})