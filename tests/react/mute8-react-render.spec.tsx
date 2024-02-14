/**
 * @jest-environment jsdom
 */
import axios from "axios"
import React from "react";
import { render, renderWait, wait } from "./utils"
import { newStore } from "../../packages/mute8-react"

describe("React rendering", () => {

    test('Simple counter', async () => {
        const store = newStore({
            value: { counter: 1 }
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

    test('react.select()', async () => {
        const store = newStore({
            value: { name: "" }
        })

        function TestCounter() {
            const name = store.react.select(v => v.name)
            return (<div id="name">{name}</div>)
        }
        // render
        const root = await render(<TestCounter />)
        const getText = () => root.querySelector("#name")?.innerHTML
        expect(getText()).toEqual("")
        // increment
        store.mut(v => v.name = "Hello")
        await renderWait()
        expect(getText()).toEqual("Hello")
    });

    test('Dispatch action by click', async () => {
        const store = newStore({
            value: { counter: 1 },
            actions: {
                inc(num: number) {
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

    test('Async action', async () => {
        type FetchState = "init" | "pending" | "ready" | "error"
        const store = newStore({
            value: {
                state: "init" as FetchState,
                users: []
            },
            actions: {
                setUsers(data: any[]) {
                    this.users = data
                },
                setFetchState(state: FetchState) {
                    this.state = state
                }
            },
            async: {
                async fetchUsers() {
                    this.actions.setFetchState("pending")
                    const res = await axios.get("https://reqres.in/api/users")
                    this.actions.setUsers(res.data["data"])
                    this.actions.setFetchState("ready")
                }
            }
        })

        function TestCounter() {
            const [s,] = store.react.use()
            return (<div id="state">{s.state}</div>)
        }

        // render
        const root = await render(<TestCounter />)
        const getDiv = () => root.querySelector("#state") as HTMLDivElement
        expect(getDiv().innerHTML).toEqual("init")

        const promise = store.async.fetchUsers();
        await renderWait()
        expect(getDiv().innerHTML).toEqual("pending")
        await promise
        await renderWait()
        expect(getDiv().innerHTML).toEqual("ready")
        expect(store.snap().users.length > 0).toBeTruthy()
    });

})