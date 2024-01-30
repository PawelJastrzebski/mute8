
# mute8 - JS State Container
![mute8](doc/mut8.svg)

## Under construction 🚧
Project is in early stage of development

## Why?
Inspired by recoil and redux to provide simple state managment solution

## Examples
For full examples go to `examples` directory

### Import
```ts
import { newState } from 'mute8-react'
```

### Create new state
```ts
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
```

### Update state
```ts
await state.actions.addCar({
    id: 1,
    brand: "Tesla",
    model: "3",
    year: 2022
});

await state.actions.addCar({
    id: 2,
    brand: "Porsche",
    model: "911",
    year: 2022
});
```
### Use in component

```tsx 
function CarStore() {
  const [cars,] = state.useOne('cars')
  const carsList = cars.map(car => (
    <li key={car.id} onClick={() => state.actions.removeCar(car.id)}>
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

## Authors
- Paweł Jastrzębski 🇵🇱