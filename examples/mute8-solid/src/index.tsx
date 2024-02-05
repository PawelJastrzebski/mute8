/* @refresh reload */
import { render } from 'solid-js/web'
import { newStore } from 'mute8-solid'
import { createMemo } from "solid-js"

import './index.css'
import Counter from './examples/Counter'
import Async from './examples/Async'

type Example = {
    name: string,
    element: () => any
}

const examples: Record<string, Example> = {
    async: {
        name: "Async",
        element: Async
    },
    couter: {
        name: "Counter",
        element: Counter
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
    }
})

function Logo() {
    const logo = <div></div>
    return (
        <div id='logo'>{logo}</div>
    )
}

function Nav() {
    const [currentExampleId,] = router.solid.useOne("currentExample")
    let elements = createMemo(() => {
        const examplesIds = Object.entries(examples)
        return examplesIds.map(([id, example]) => {
            const onClick = () => router.actions.openExample(id);
            const className = id === currentExampleId() ? "active" : undefined;
            return (
                <button class={className} onClick={onClick}>{example.name}</button>
            )
        })
    })

    return (
        <div id='nav'>
            {elements()}
        </div>
    )
}

function Router() {
    const [exampleId,] = router.solid.useOne("currentExample")
    const Component = createMemo(() => {
        const Component = examples[exampleId()].element
        return <Component />
    })

    return (<div id='router'>{exampleId()}{Component()}</div>)
}

function App() {
    return (
        <>
            <Logo />
            <Nav />
            <Router />
        </>
    )
}

render(() => <App />, document.getElementById('root')!)
