import { newStore } from 'mute8-react'
import './App.css'

const store = newStore({
  value: {
    count: 0,
    count2: 0,
    appName: "Vite + React + mute8"
  },
  actions: {
    incrementCounter2(value: number) {
      this.count2 = this.count2 + value;
    }
  }
})

setInterval(() => {
  store.count = store.count + 100;
  store.count = store.count + 100;
}, 100)

setInterval(() => {
  store.count = store.count + 1;
  store.count = Math.floor(store.count * 2)

  store.count2 = store.count2 + 1000;
}, 100)

setInterval(() => {
  store.count = 0
  store.count2 = 0
}, 20_000)

// state.sub((v) => console.log(v.count))

function App() {
  const [, setFull] = store.react.use();
  const [count,] = store.react.useOne('count')
  const [count2, setCount2] = store.react.useOne("count2")
  const [name, setName] = store.react.useOne("appName")

  return (
    <>
      <h1>{name}</h1>
      <div className="card">
        <h4>count is {count}</h4>
        <button onClick={() => setCount2(count2 + 1)}>
          count2 react hook {count2}
        </button>
        <button onClick={() => store.actions.incrementCounter2(1)}>
          count2 mute8 action {count2}
        </button>
        <br />
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div>App Name (direct update) <br />
            <input value={name} onChange={(e) => store.appName = e.target.value} type='text'></input>
          </div>
          <div>
            App Name (React hook) <br />
            <input value={name} onChange={(e) => setName(e.target.value)} type='text'></input>
          </div>
        </div>

        <br /><br />
        <button onClick={() => {
          setFull({
            count: 0,
            count2: 0
          })
        }}>
          Reset Couters
        </button>
      </div>
    </>
  )
}

export default App
