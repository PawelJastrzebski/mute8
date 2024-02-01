import { newStore } from "../packages/mute8/mute8"
import { wait } from "./utils"

test('should init state', () => {
    const store = newStore({
        value: {
            name: "ok"
        }
    })

    expect(store).toBeTruthy()
    expect(store.name).toEqual("ok")
});

test('should get state snapshot', () => {
    const store = newStore({
        value: {
            name: "Tom"
        }
    })

    expect(store.snap()).toEqual({ name: "Tom" })
    expect(store.name).toEqual("Tom")
});

test('should subscribe', () => {
    const store = newStore({
        value: {
            name: "Sub"
        }
    })

    const sub = store.sub((v) => console.log(v));
    expect(sub["destroy"]).toBeTruthy();
    sub.destroy();
});

test('should subscribe 2', async () => {
    const store = newStore({
        value: {
            name: "Sub"
        }
    })

    let subFired = 0;
    const sub = store.sub((v) => {
        subFired++;
        expect(v.name).toEqual("Amy")
    });
    store.mut = {
        name: "Amy"
    }

    // event is fired lazy
    await wait(1);
    expect(subFired).toEqual(1)
    sub.destroy();
});

test('should subscribe 3', async () => {
    let state = newStore({
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
    const store = newStore({
        value: {
            name: "Sub"
        }
    })

    let subFired = 0;
    const sub = store.sub((v) => subFired++);
    sub.destroy();

    store.mut = {
        name: "Amy"
    }
    await wait(1);
    expect(subFired).toEqual(0)

});

test('should mutate (set)', () => {
    const store = newStore({
        value: {
            name: "Tom"
        }
    })

    expect(store.name).toEqual("Tom")
    store.mut = {
        name: "Amy"
    }
    expect(store.name).toEqual("Amy")
});

test('should mutate (mutFn)', () => {
    const state = newStore({
        value: {
            name: "Tom"
        }
    })

    expect(state.name).toEqual("Tom")
    state.mut(v => v.name = "Amy")
    expect(state.name).toEqual("Amy")
});

test('should mutate prop', () => {
    const state = newStore({
        value: {
            name: "Tom"
        }
    })

    expect(state.name).toEqual("Tom")
    state.name = "Amy"
    expect(state.name).toEqual("Amy")
});


test('should define action', async () => {
    const state = newStore({
        value: {
            name: "Sub"
        },
        actions: {
            setName(name: string) {
                this.name = name;
            }
        }
    })
    state.actions.setName("Action");
    expect(state.name).toEqual("Action")
});

test('example of functional action', async () => {
    const state = newStore({
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

    const store = newStore({
        value: {
            cars: [] as Car[]
        },
        actions: {
            addCar(car: Car) {
                this.cars.push(car)
            },
            removeCar(id: number) {
                this.cars = this.cars.filter(c => c.id != id)
            },
        },
    })

    store.actions.addCar({
        id: 1,
        brand: "Test",
        model: "3",
        year: 2022
    });
    store.actions.addCar({
        id: 2,
        brand: "Test",
        model: "X",
        year: 2018
    });

    expect(store.cars).toEqual([
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

    store.actions.removeCar(1);
    expect(store.cars).toEqual([
        {
            id: 2,
            brand: "Test",
            model: "X",
            year: 2018
        }
    ])

});

test('async actions', async () => {
    const store = newStore({
        value: {
            fetchCount: 0,
            state: "done" as "done" | "pending"
        },
        actions: {
            inc() {
                this.fetchCount++
            }
        },
        async: {
            async other() {
                await wait(10)
                this.actions.inc();

            },
            async fetch() {
                const snap = this.snap()
                await wait(10)
                this.mut(v => v.fetchCount++);
            },
        }
    })
    store.async.fetch().then()
    store.async.fetch().then()
    store.async.other().then()
    await wait(10)
    expect(store.fetchCount).toEqual(3)

    await store.async.fetch()
    expect(store.fetchCount).toEqual(4)
    await store.async.fetch()
    expect(store.fetchCount).toEqual(5)
    await store.async.other()
    expect(store.fetchCount).toEqual(6)
})