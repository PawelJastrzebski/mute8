export const wait = (time_ms: number) => new Promise((resolve, reject) => setTimeout(resolve, time_ms));

// React (jsdom)
import { createRoot } from 'react-dom/client';

export const renderWait = async () => await wait(10)
export const render = async (component: React.ReactElement) => {
    const root = document.createElement("div");
    const reactRoot = createRoot(root)
    reactRoot.render(component)
    await renderWait()
    return root;
}