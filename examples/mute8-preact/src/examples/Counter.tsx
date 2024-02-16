import { CombinePlugins, DevTools } from 'mute8-plugins';
import { newStore } from 'mute8-preact'

const store = newStore({
  value: {
    count: 0,
    count2: 0,
    appName: "Vite + Preact + Mute8"
  },
  actions: {
    incrementCounter2(value: number) {
      this.count2 = this.count2 + value;
    }
  },
  plugin: CombinePlugins(DevTools.register("counter"))
})

setInterval(() => {
  store.count = store.count + 100;
  store.count = store.count + 100;
}, 50)

setInterval(() => {
  store.count = store.count + 1;
  store.count = Math.floor(store.count * 2)

  store.count2 = store.count2 + 1000;
}, 50)

// state.sub((v) => console.log(v.count))

function Couter() {
  const [, setFull] = store.preact.use();
  const countSelect = store.preact.select(v => `store.react.select() ${v.count2.toFixed(2)}`);
  const [count, ] = store.preact.useOne("count")
  const [count2, setCount2] = store.preact.useOne("count2")
  const [name, setName] = store.preact.useOne("appName")

  return (
    <>
      <h1>{name.length > 0 ? name : "Empty Name"}</h1>
      <div style={{ padding: "20px 0" }} className="card">
        <h4>count is {count}</h4>
        <h4>{countSelect}</h4>
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
            <input value={name} onInput={(e) => store.appName = (e as any).target.value} type='text'></input>
          </div>
          <div>
            App Name (React hook) <br />
            <input value={name} onInput={(e) => setName((e as any).target.value)} type='text'></input>
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
