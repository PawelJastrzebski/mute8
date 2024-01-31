/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, renderWait } from "./utils"
import { newState } from "../packages/mute8-react/mute8-react"

test('render simple counter', async () => {
    const store = newState({
        value: {
            counter: 1
        }
    })
    
    function TestComponent() {
        const [count,] = store.useOne('counter')
        return (<div id="count-value">{count}</div>)
    }

    // render
    const root = await render(<TestComponent />)
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