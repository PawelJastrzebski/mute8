import { newStore } from "../../packages/mute8"
import { wait } from "./utils"

describe("Unit mute8", () => {

    test('Init state', () => {
        const store = newStore({
            value: { name: "ok" }
        })

        expect(store).toBeTruthy()
        expect(store.name).toEqual("ok")
    });

    test('Get state snapshot', () => {
        const store = newStore({
            value: { name: "Tom" }
        })

        expect(store.snap()).toEqual({ name: "Tom" })
        expect(store.name).toEqual("Tom")
    });

    test('Subscribe', () => {
        const store = newStore({
            value: { name: "Sub" }
        })

        const sub = store.sub((v) => console.log(v));
        expect(sub["destroy"]).toBeTruthy();
        sub.destroy();
    });

    test('Subscribe lazy 1', async () => {
        const store = newStore({
            value: { name: "Sub" }
        })

        let subFired = 0;
        const sub = store.sub((v) => {
            subFired++;
            expect(v.name).toEqual("Amy")
        });
        store.mut = { name: "Amy" }

        expect(subFired).toEqual(1)
        sub.destroy();
    });

    test('Subscribe lazy 2', async () => {
        let state = newStore({
            value: { cars: [] as string[] }
        });

        let subFired = 0;
        const sub = state.sub((v) => subFired++);

        state.cars = [...state.cars, "Tesla"]
        state.cars = [...state.cars, "BMW"]

        expect(subFired).toEqual(2)
        expect(state.cars).toEqual(["Tesla", "BMW"])
        sub.destroy();
    });

    test('Subscribe multi', async () => {
        let store = newStore({
            value: { update: 0 }
        });

        let subFired = 0;
        const sub1 = store.sub((v) => subFired++);
        const sub2 = store.sub((v) => subFired++);

        store.update = 1
        expect(subFired).toEqual(2)
        sub1.destroy();

        store.update = 2
        expect(subFired).toEqual(3)
        sub2.destroy();

        store.update = 3
        expect(subFired).toEqual(3)
    });

    test('Subscribe/Unsubscribe ', async () => {
        const store = newStore({
            value: { name: "Sub" }
        })

        let subFired = 0;
        const sub = store.sub((v) => subFired++);
        sub.destroy();

        store.mut = { name: "Amy" }
        expect(subFired).toEqual(0)

    });

    test('Mutate by setter mut', () => {
        const store = newStore({
            value: { name: "Tom" }
        })

        expect(store.name).toEqual("Tom")
        store.mut = { name: "Amy" }
        expect(store.name).toEqual("Amy")
    });

    test('Mutate by mut()', () => {
        const state = newStore({
            value: { name: "Tom" }
        })

        expect(state.name).toEqual("Tom")
        state.mut(v => v.name = "Amy")
        expect(state.name).toEqual("Amy")
    });

    test('Mutate by prop', () => {
        const state = newStore({
            value: { name: "Tom" }
        })

        expect(state.name).toEqual("Tom")
        state.name = "Amy"
        expect(state.name).toEqual("Amy")
    });

    test('Define action', async () => {
        const state = newStore({
            value: { name: "Sub" },
            actions: {
                setName(name: string) {
                    this.name = name;
                }
            }
        })
        state.actions.setName("Action");
        expect(state.name).toEqual("Action")
    });

    test('Functional action', async () => {
        const state = newStore({
            value: { counter: 1 }
        })
        const incrementCounter = () => state.mut(s => s.counter++)

        incrementCounter()
        expect(state.counter).toEqual(2)
    });

    test('Selector', async () => {
        const state = newStore({
            value: { counter: 1 }
        })

        // select
        const c1 = state.select((v) => v.counter)
        expect(c1.sanp()).toEqual(1)
        const c2 = state.select((v) => ({ ok: v.counter }))
        expect(c2.sanp().ok).toEqual(1)
        // update parent
        state.counter = 2;
        //assert
        expect(c1.sanp()).toEqual(2)
        expect(c2.sanp().ok).toEqual(2)
    });

})

test('Example car store', async () => {
    interface Car {
        id: number,
        brand: string,
        model: string,
        year: number
    }

    const store = newStore({
        value: { cars: [] as Car[] },
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

test('Async actions', async () => {
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