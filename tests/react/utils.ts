import { createRoot } from 'react-dom/client';
export const wait = (time_ms: number) => new Promise((resolve, reject) => setTimeout(resolve, time_ms))

export const renderWait = async () => await wait(20)
export const render = async (component: React.ReactElement) => {
    const root = document.createElement("div");
    const reactRoot = createRoot(root)
    reactRoot.render(component)
    await renderWait()
    return root;
}

