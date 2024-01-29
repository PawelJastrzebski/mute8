import { newState } from "../_mute8/mute8"
import { wait } from "./utils"

test('should init state', () => {
    const state = newState({
        value: {
            name: "ok"
        }
    })


    expect(state).toBeTruthy()
    expect(state.name).toEqual("ok")
});

test('should get state snapshot', () => {
    const state = newState({
        value: {
            name: "Tom"
        }
    })

    expect(state.snap()).toEqual({ name: "Tom" })
    expect(state.name).toEqual("Tom")
});

test('should subscribe', () => {
    const state = newState({
        value: {
            name: "Sub"
        }
    })

    const sub = state.sub((v) => console.log(v));
    expect(sub["destroy"]).toBeTruthy();
    sub.destroy();
});

test('should subscribe 2', async () => {
    const state = newState({
        value: {
            name: "Sub"
        }
    })

    let subFired = 0;
    const sub = state.sub((v) => {
        subFired++;
        expect(v.name).toEqual("Amy")
    });
    state.mut = {
        name: "Amy"
    }

    // event is fired lazy
    await wait(1);
    expect(subFired).toEqual(1)
    sub.destroy();
});

test('should subscribe 3', async () => {
    let state = newState({
        value: {
            cars: [] as string[]
        }
    });

    let subFired = 0;
    const sub = state.sub((v) => subFired++);

    // two updates only once sub() event fired
    state.cars = [...state.cars, "Tesla"]
    state.cars = [...state.cars, "BMW"]
    
    await wait(1);
    expect(subFired).toEqual(1)
    expect(state.cars).toEqual(["Tesla", "BMW"])
    sub.destroy();
});

test('should subscribe - unsubscribe ', async () => {
    const state = newState({
        value: {
            name: "Sub"
        }
    })

    let subFired = 0;
    const sub = state.sub((v) => subFired++);
    sub.destroy();

    state.mut = {
        name: "Amy"
    }
    await wait(1);
    expect(subFired).toEqual(0)

});


test('should mutate', () => {
    const state = newState({
        value: {
            name: "Tom"
        }
    })

    expect(state.name).toEqual("Tom")
    state.mut = {
        name: "Amy"
    }
    expect(state.name).toEqual("Amy")
});


test('should mutate prop', () => {
    const state = newState({
        value: {
            name: "Tom"
        }
    })

    expect(state.name).toEqual("Tom")
    state.name = "Amy"
    expect(state.name).toEqual("Amy")
});


test('should define action', async () => {
    const state = newState({
        value: {
            name: "Sub"
        },
        actions: {
            async setName(name: string) {
                this.name = name
            },
            async setNameAsync(name: string, wait_ms: number) {
                await wait(wait_ms)
                this.name = name
            },
        }
    })
    await state.actions.setName("Action");
    expect(state.name).toEqual("Action")

    await state.actions.setNameAsync("ActionAsync", 10);
    expect(state.name).toEqual("ActionAsync")

    state.actions.setNameAsync("ActionAsync Not Awaited", 5);
    await wait(10)
    expect(state.name).toEqual("ActionAsync Not Awaited")
});