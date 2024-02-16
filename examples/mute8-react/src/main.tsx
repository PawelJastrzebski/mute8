import "https://paweljastrzebski.github.io/mute8/devtools/v1.mjs"
import './index.css'
import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom/client'
import { newStore } from 'mute8-react'
import { DevTools } from 'mute8-plugins'

import Couter from './examples/Counter.tsx'
import CarStore from './examples/CarStore.tsx'
import Async from './examples/Async.tsx'

type Example = {
  name: string,
  element: ReactElement
}

const examples: Record<string, Example> = {
  async: {
    name: "Async",
    element: <Async />
  },
  couter: {
    name: "Counter",
    element: <Couter />
  },
  carStore: {
    name: "CarStore",
    element: <CarStore />
  }
}

type ExampleId = keyof typeof examples;
const router = newStore({
  value: {
    currentExample: "async"
  },
  actions: {
    openExample(example: ExampleId) {
      this.currentExample = example
    }
  },
  plugin: DevTools.register("router")
})

function Logo() {
  const logo = <div></div>
  return (
    <div id='logo'>{logo}</div>
  )
}

function Nav() {
  const [currentExampleId,] = router.react.useOne("currentExample")
  const examplesIds = Object.entries(examples)
  const elements = examplesIds.map(([id, example]) => {
    const onClick = () => router.actions.openExample(id);
    const className = id === currentExampleId ? "active" : undefined;

    return (
      <button className={className} key={id} onClick={onClick}>{example.name}</button>
    )
  })

  return (
    <div id='nav'>
      {elements}
    </div>
  )
}

function Router() {
  const [exampleId,] = router.react.useOne("currentExample")
  const component = examples[exampleId].element
  return (<div id='router'>{component}</div>)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Logo />
    <Nav />
    <Router />
  </React.StrictMode>,
)
