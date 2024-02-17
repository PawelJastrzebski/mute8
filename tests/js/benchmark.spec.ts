import { newStore } from "../../packages/mute8"
import { timed } from "./utils"

describe("mute8 benchmark", () => {

    test('get {value}', () => {
        const store = newStore({
            value: {
                name: "ok"
            }
        })

        timed("get value", 600, () => {
            for (let index = 0; index < 1_000_000_000; index++) {
                const x = store.name;
            }
        })

        expect(store).toBeTruthy()
        expect(store.name).toEqual("ok")
    });

    test('set {value}', () => {
        const store = newStore({
            value: {
                name: "ok"
            }
        })

        timed("set value", 200, () => {
            for (let index = 0; index < 150_000; index++) {
                store.name = "_";
            }
        })

        expect(store).toBeTruthy()
        expect(store.name).toBeTruthy()
    });

})