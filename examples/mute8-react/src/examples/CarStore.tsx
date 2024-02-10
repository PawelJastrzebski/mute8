import { DevTools } from 'mute8-plugins';
import { newStore } from 'mute8-react'

function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

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
  plugin: DevTools.register("car-store")
})

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
      <div style={{ padding: "20px 0" }} className='card'>
        <h4>List</h4>
        <ul style={{ maxWidth: 400, margin: "0 auto" }}>
          {carsList}
        </ul>
        <AddNew />
      </div>
    </>

  )
}

export default CarStore
