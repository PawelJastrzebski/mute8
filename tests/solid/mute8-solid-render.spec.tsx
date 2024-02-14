import {render, renderWait} from "./utils"
import { newStore } from "../../packages/mute8-solid"

describe("Solid rendering", () => {

    test('solid.useOne()', async () => {
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

    test('solid.select()', async () => {
        const store = newStore({
            value: { name: "-" }
        })

        function TestCounter() {
            const name = store.solid.select(v => v.name)
            return (<div id="name">{name()}</div>)
        }
        // render
        const root = await render(<TestCounter />)
        const getText = () => root.querySelector("#name")?.innerHTML
        expect(getText()).toEqual("-")
        // increment
        store.mut(v => v.name = "Hello")
        await renderWait()
        expect(getText()).toEqual("Hello")
    });

})