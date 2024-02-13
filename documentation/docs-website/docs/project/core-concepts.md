---
sidebar_position: 2
---

# Core Concepts

## Store

> Single unit of state. Think of it as a service that combines immutable data (state), synchronous actions for manipulating that data, and asynchronous actions for handling requests.

- The `value` field contains the initial state properties.
- The `actions` field allows you to define methods to modify the state synchronously.
- The `async` field enables the definition of asynchronous methods to handle async operations.
- The `plugin` field is optional and allows you to add plugins to customize or extend the store's behavior.

```ts
import { newStore } from "mute8";

const store = newStore({
    value: {
        name: "ok",
    },
});
```

## Action

> A function operating within the context of a mutable state snapshot, crafting the illusion of mutability and offering a straightforward approach to manipulate data without adding unnecessary boilerplate code.

Actions are defined to encapsulate functionality. They can be used to perform complex operations while maintaining a clean separation of concerns.

```ts
const store = newStore({
    value: {
        cars: [] as Car[],
    },
    actions: {
        addCar(car: Car) {
            this.cars.push(car);
        },
        removeCar(id: number) {
            this.cars = this.cars.filter(c => c.id != id);
        },
    },
});
```

## Asynchronous action

> An asynchronous action is a function designed for handling asynchronous operations, like fetching data from an API. It operates within the context of a small proxy, ensuring, secure manipulation and access to the present state.

```ts
const store = newStore({
    value: {
        fetchCount: 0
    },
    async: {
        async fetchData() {
            // Simulating an asynchronous operation
            await new Promise(resolve => setTimeout(resolve, 100));
            this.mut(v => v.fetchCount++);
        },
    },
});
```

## Subscription

> A subscription allows you to observe and react to changes in the state, providing a means to listen for any alterations in the data.

```ts
const sub = store.sub((newState) => {
    console.log('State changed: ', newState);
});
```

## Mutation

> Method enabling you to pass an anonymous action and modify the state.

Different ways to modify the state:

- Using the `mut()` method with a function.
- Using the setter `mut` property.
- Directly setting a property of the state.

```ts
// Anonymous action
store.mut(v => v.fetchCount = 42);
// Setter
store.mut = {
    fetchCount: 42,
}
// Directly
store.fetchCount = 42,
```