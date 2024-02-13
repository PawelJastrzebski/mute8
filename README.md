
# mute8 - JS State Container
![mute8](documentation/mut8.svg)

### Under construction 🚧
Project is in early stage of development

### Why?
Inspired by Recoil and Redux.

Striving to offer a lightweight state management solution for applications that don't need the full capabilities of Redux.

## Instalation
**JavaScript**
```sh
npm i mute8
```
**React**
```sh
npm i mute8-react
```

## Examples
For full examples go to `examples` directory

#### Import
```ts
import { newStore } from 'mute8-react'
```

#### Create new store
```ts
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
    }
})
```

#### Update state
```ts
store.actions.addCar({
    id: 1,
    brand: "Tesla",
    model: "3",
    year: 2022
});

store.actions.addCar({
    id: 2,
    brand: "Porsche",
    model: "911",
    year: 2022
});
```
#### Use in component

```tsx 
function CarStore() {
  const [cars,] = store.react.useOne('cars')
  const carsList = cars.map(car => (
    <li key={car.id} onClick={() => store.actions.removeCar(car.id)}>
      {car.brand} {car.model} | {car.year}
    </li>
  ))

  return (
    <>
      <h1>Car store</h1>
      <ul>
        {carsList}
      </ul>
    </>
  )
}
```
#### Dispatch action
```tsx
function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
```
```tsx
function AddNew() {
  return (
    <button onClick={() => {
      store.actions.addCar({
        id: randomNumber(100, 100_000),
        brand: "Tesla",
        model: "Cybertruck",
        year: randomNumber(2024, 2077)
      });
    }}>
      Add new
    </button>
  )
}
```

## Use with TypeScript 💙
To keep packages lightweight, we do not provide type validation at runtime.


# DevTools
Open the [documentation](https://paweljastrzebski.github.io/mute8) for more details

<img src="documentation/mute8-devtools.png" alt="mute8-devtools" width="600"/>

## Authors
- Paweł Jastrzębski 🇵🇱