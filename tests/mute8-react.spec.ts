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
});