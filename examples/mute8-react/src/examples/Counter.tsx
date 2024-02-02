import { newStore } from 'mute8-react'

const store = newStore({
  value: {
    count: 0,
    count2: 0,
    appName: "Vite + React + Mute8"
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

// state.sub((v) => console.log(v.count))

function Couter() {
  const [, setFull] = store.react.use();
  const [count,] = store.react.useOne('count')
  const [count2, setCount2] = store.react.useOne("count2")
  const [name, setName] = store.react.useOne("appName")

  return (
    <>
      <h1>{name.length > 0 ? name : "Empty Name"}</h1>
      <div style={{padding: "20px 0"}} className="card">
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

export default Couter
