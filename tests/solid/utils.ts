export const wait = (time_ms: number) => new Promise((resolve, _) => setTimeout(resolve, time_ms))

export const renderWait = async () => await wait(20)
import { JSXElement } from 'solid-js';
import { render as solidRender } from 'solid-js/web'
export const render = async (component: JSXElement) => {
    const root = document.createElement("div");
    solidRender(() => component, root)
    await renderWait()
    return root;
}


