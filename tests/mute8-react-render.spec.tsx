/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, renderWait } from "./utils"
import { newStore } from "../packages/mute8-react/mute8-react"

test('render simple counter', async () => {
    const store = newStore({
        value: {
            counter: 1
        }
    })

    function TestCounter() {
        const [count,] = store.react.useOne('counter')
        return (<div id="count-value">{count}</div>)
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

test('render and dispatch action by click', async () => {
    const store = newStore({
        value: {
            counter: 1
        },
        actions: {
            async inc(num: number) {
                this.counter = this.counter + num;
            }
        }
    })

    function TestCounter() {
        const [s,] = store.react.use()
        const inc = () => store.actions.inc(1);
        return (<div onClick={inc} id="count-value">{s.counter}</div>)
    }

    // render
    const root = await render(<TestCounter />)
    const getDiv = () => root.querySelector("#count-value") as HTMLDivElement
    expect(getDiv().innerHTML).toEqual("1")
    // click on div
    getDiv().click()
    await renderWait()
    expect(getDiv().innerHTML).toEqual("2")
});