import { newState } from "../packages/mute8/mute8"
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

test('should mutate (set)', () => {
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

test('example of functional action', async () => {
    const state = newState({
        value: {
            counter: 1
        }
    })
    const incrementCounter = () => state.mut(s => s.counter++)

    incrementCounter()
    expect(state.counter).toEqual(2)
});

test('example car store', async () => {
    interface Car {
        id: number,
        brand: string,
        model: string,
        year: number
    }

    const state = newState({
        value: {
            cars: [] as Car[]
        },
        actions: {
            async addCar(car: Car) {
                this.cars.push(car)
            },
            async removeCar(id: number) {
                this.cars = this.cars.filter(c => c.id != id)
            },
        }
    })

    await state.actions.addCar({
        id: 1,
        brand: "Test",
        model: "3",
        year: 2022
    });

    await state.actions.addCar({
        id: 2,
        brand: "Test",
        model: "X",
        year: 2018
    });

    expect(state.cars).toEqual([
        {
            id: 1,
            brand: "Test",
            model: "3",
            year: 2022
        },
        {
            id: 2,
            brand: "Test",
            model: "X",
            year: 2018
        }
    ])

    await state.actions.removeCar(1);
    expect(state.cars).toEqual([
        {
            id: 2,
            brand: "Test",
            model: "X",
            year: 2018
        }
    ])

});