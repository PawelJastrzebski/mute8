import "https://paweljastrzebski.github.io/mute8/devtools/v1.mjs"
import { CombinePlugins, DevTools, LocalStoragePlugin } from 'mute8-plugins'
import { newStore } from 'mute8-solid'
import { createMemo } from 'solid-js'

interface User {
  id: number,
  email: string,
  avatar: string,
  first_name: string
  last_name: string
}

type FetchState = "init" | "pending" | "ready" | "error"
const store = newStore({
  value: {
    state: "init" as FetchState,
    users: [] as User[]
  },
  actions: {
    reset() {
      this.state = "init"
      this.users = []
    },
    setUsers(data: User[]) {
      this.users = data
    },
    setFetchState(state: FetchState) {
      this.state = state
    }
  },
  async: {
    async fetchUsers() {
      if (this.snap().state === 'pending') {
        return
      }

      this.mut(v => {
        v.state = "pending"
        v.users = []
      })

      try {
        const res = await fetch("https://reqres.in/api/users?delay=2");
        const json = await res.json()
        this.actions.setUsers(json["data"] as User[])
        this.actions.setFetchState("ready")
      } catch (e) {
        this.actions.setFetchState("error")
      }
    }
  },
  plugin: CombinePlugins(LocalStoragePlugin.new("async-users"), DevTools.register("async-users"))
})

const stateInfo = (state: FetchState) => {
  if (state == 'pending') {
    return "Loading..."
  } else if (state == 'error') {
    return "Something went wrong"
  } else if (state == 'ready') {
    return null
  }
  return "Click 'Load users'"
}

function Async() {
  const [state,] = store.solid.useOne('state')
  const rows = createMemo(() => {
    state()
    return store.snap().users.map(u => {
      return (
        <tr>
          <th scope="row">{u.id}</th>
          <td>{u.first_name}</td>
          <td>{u.last_name}</td>
          <td>{u.email}</td>
          <td><img style="border-radious: 50px; margin: 5px" width={50} height={50} src={u.avatar} /></td>
        </tr>
      )
    })
  })
  const info = createMemo(() => stateInfo(state()));

  return (
    <>
      <div style="margin: 0 auto; max-width: 1200px; display: flex; justify-content: space-between; align-items: center">
        <h3>Loading state: {state()}</h3>
        <span>
          <button onClick={() => store.actions.reset()}>
            Reset
          </button>
          <button onClick={() => store.async.fetchUsers()}>
            Load users
          </button>
        </span>
      </div>
      <div>
        <table class='card' cell-spacing="0" cell-padding="0">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Avatar</th>
            </tr>
          </thead>
          <tbody>
            {rows()}
            <tr>
              <td colSpan={5}>
                {!!info() ? <div style="padding: 165px"><h2>{info()}</h2></div> : <></>}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
                <h4 style={{ margin: "10px 0" }} >Test API <a href='https://reqres.in/'>https://reqres.in</a></h4>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

export default Async
