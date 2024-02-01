import { newStore } from "../packages/mute8-react/mute8-react"

test('Init state', () => {
    const state = newStore({
        value: {
            name: "ok",
        }
    })

    expect(state).toBeTruthy()
    expect(state.name).toEqual("ok")
    expect(state.react).toBeTruthy()
    expect(state.react.use).toBeTruthy()
    expect(state.react.useOne).toBeTruthy()
    expect(state.react.useOne.apply).toBeTruthy()
});

test('Mutate by mut()', () => {
    const state = newStore({
        value: {
            name: "Tom"
        }
    })

    expect(state.name).toEqual("Tom")
    state.mut(v => v.name = "Amy")
    expect(state.name).toEqual("Amy")
});