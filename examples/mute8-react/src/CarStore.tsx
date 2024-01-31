import { newStore } from 'mute8-react'
import './App.css'

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
    async addCar(car: Car) {
      this.cars.push(car)
    },
    async removeCar(id: number) {
      this.cars = this.cars.filter(c => c.id != id)
    },
  }
})

await store.actions.addCar({
  id: 1,
  brand: "Tesla",
  model: "3",
  year: 2022
});

await store.actions.addCar({
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
  const [cars,] = store.useOne('cars')
  const carsList = cars.map(car => (
    <li key={car.id} onClick={() => store.actions.removeCar(car.id)}>
      {car.brand} {car.model} | {car.year}
    </li>
  ))

  return (
    <>
      <h1>Car store</h1>
      <ul style={{maxWidth: 400, margin: "0 auto"}}>
        {carsList}
      </ul>
      <AddNew />
    </>
  )
}

export default CarStore
