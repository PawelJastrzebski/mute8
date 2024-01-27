import { newState } from '../../../_mute8-react/mute8-react'
import './App.css'


const state = newState({
  value: {
    count: 0,
    count2: 0,
    appName: "Vite + React + mute8"
  }
})

setInterval(() => {
  state.count = state.count + 100;
  state.count = state.count + 100;
}, 100)

setInterval(() => {
  state.count = state.count + 1;
  state.count = Math.floor(state.count * 2)

  state.count2 = state.count2 + 1000;
}, 100)

setInterval(() => {
  state.count = 0
  state.count2 = 0
}, 20_000)

// state.sub((v) => console.log(v.count))

function App() {
  const [, setFull] = state.use();
  const [count,] = state.useOne('count')
  const [count2, setCount2] = state.useOne("count2")
  const [name, setName] = state.useOne("appName")

  return (
    <>
      <h1>{name}</h1>
      <div className="card">
        <h4>count is {count}</h4>
        <button onClick={() => setCount2(count2 + 1)}>
          count2 is {count2}
        </button>
        <br />
        <br />
        <div style={{ display: "flex", justifyContent: "center"}}>
          <div>App Name (direct update) <br />
            <input value={name} onChange={(e) => state.appName = e.target.value} type='text'></input>
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
