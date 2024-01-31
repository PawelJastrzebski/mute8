/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, renderWait } from "./utils"
import { newState } from "../packages/mute8-react/mute8-react"

const store = newState({
    value: {
        counter: 1
    }
})

function TestComponent() {
    const [count,] = store.useOne('counter')
    return (<div id="count-value">{count}</div>)
}

test('render by js-dom', async () => {
    const root = await render(<TestComponent />)
    const getText = () => root.querySelector("#count-value")?.innerHTML

    expect(getText()).toEqual("1")
    store.mut(v => v.counter++)
    await renderWait()
    expect(getText()).toEqual("2")
  
});