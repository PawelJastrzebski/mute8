import { newState } from "../packages/mute8-react/mute8-react"

test('should init state', () => {
    const state = newState({
        value: {
            name: "ok",
        }
    })

    expect(state).toBeTruthy()
    expect(state.name).toEqual("ok")
    expect(state.use).toBeTruthy()
    expect(state.use.apply).toBeTruthy()
});

test('should mutate (mutFn)', () => {
    const state = newState({
        value: {
            name: "Tom"
        }
    })

    expect(state.name).toEqual("Tom")
    state.mut(v => v.name = "Amy")
    expect(state.name).toEqual("Amy")
});