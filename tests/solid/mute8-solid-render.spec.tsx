import axios from "axios"
import { render, renderWait } from "./utils"
import { newStore } from "../../packages/mute8-solid"
import { createEffect } from "solid-js";

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

    test('solid.useOne() - shoud fire proper object changes', async () => {
        // update counts
        let value_1_count = 0;
        let value_2_count = 0;

        function TestUseOne() {
            const [value_1] = store.solid.useOne('value_1')
            const [value_2] = store.solid.useOne('value_2')

            createEffect(() => {
                value_1()
                value_1_count++;
            })

            createEffect(() => {
                value_2()
                value_2_count++;
            })

            return (<>
                <div id="value_1">{value_1().v}</div>
                <div id="value_2">{value_2().v}</div>
            </>)
        }

        const store = newStore({
            value: {
                value_1: { v: 1 },
                value_2: { v: 2 }
            }
        })
        const root = await render(<TestUseOne />)

        // update value_1 - once
        store.value_1 = { v: 2 };
        await renderWait()
        expect(value_1_count).toEqual(2)
        expect(value_2_count).toEqual(1)

        // update value_2 - 2 times
        store.value_2 = { v: 3 };
        await renderWait()
        store.value_2 = { v: 4 };
        await renderWait()
        expect(value_1_count).toEqual(2)
        expect(value_2_count).toEqual(3)

        // test DOM values
        expect(root.querySelector("#value_1")?.innerHTML).toEqual("2")
        expect(root.querySelector("#value_2")?.innerHTML).toEqual("4")
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
            const [s,] = store.solid.use()
            return (<div id="state">{s().state}</div>)
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