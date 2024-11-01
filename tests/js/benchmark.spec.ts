import { newStore } from "../../packages/mute8"
import { timed, wait } from "./utils"

describe("mute8 benchmark", () => {

    const waitOtherTestsToFinish = async () =>  await wait(3_000)

    test('get {value}', async () => {
        await waitOtherTestsToFinish()
        const store = newStore({
            value: {
                name: "ok"
            }
        })

        // const store = {
        //     name: "ok"
        // }

        timed("get value", 900, () => {
            for (let index = 0; index < 1_000_000_000; index++) {
                const x = store.name;
            }
        })

        expect(store).toBeTruthy()
        expect(store.name).toEqual("ok")
    }, 10_000);

    test('set {value}', async () => {
        await waitOtherTestsToFinish()
        const store = newStore({
            value: {
                name: "ok"
            }
        })

        // const store = {
        //     name: "ok"
        // }

        timed("set value", 300, () => {
            for (let index = 0; index < 150_000; index++) {
                store.name = "_" + index;
            }
        })

        expect(store).toBeTruthy()
        expect(store.name).toBeTruthy()
    }, 10_000);

})