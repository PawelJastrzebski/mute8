import { createStore } from 'mute8-react'
import './App.css'
import { useEffect } from 'react';

const store = createStore({
  value: {
    count: 1,
    count2: 0,
    appName: "Vite + React + mute8"
  },
  actions: {
    async incrementCounter1(value: number) {
      this.count = this.count + value;
    },
    async incrementCounter2(value: number) {
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

store.sub((v) => console.log(v.count))

function App() {
  const [, setFull] = store.use();
  const [count1, setCount1] = store.useOne('count')
  const [name, setName] = store.useOne("appName")

  const selectedCount1 = store.useSelector((state) => state.count);

  useEffect(() => {
    console.log('render')
  })

  const testDispatch = () => {
    store.dispatch((state) => {
      state.count = 100;
      state.count2 = 200;
      state.appName = "Vite + React + mute8 (updated)"
    });
  }

  return (
    <>
      <h1>{name}</h1>
      <div className="card">
        <h4>count is { count1 }</h4>
        <h4>count from useSelector is { selectedCount1 }</h4>
        <button onClick={() => setCount1(count1 + 1)}>
          count1 react hook { count1 }
        </button>
        <button onClick={() => store.actions.incrementCounter1(1)}>
          count1 mute8 action { count1 }
        </button>
        <button onClick={testDispatch}>
          test dispach mute8
        </button>
        <br />
        <br />
        <div style={{ display: "flex", justifyContent: "center"}}>
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
