import { Plugin, PluginBuilder, StoreProxy, defaultPlugin } from "../mute8/mute8"

// CombinePlugins Util
export const CombinePlugins = <T extends Object, A, AA>(...plugins: PluginBuilder<T, A, AA>[]) => {
    return <T extends Object, A, AA>(proxy: StoreProxy<T, A, AA>): Plugin<T> => {
        const initializedPlugins = plugins.map(p => p(proxy as any)) as Plugin<T>[]

        return {
            BInit: (initState) => {
                let final = initState;
                for (let plugin of initializedPlugins) {
                    final = plugin.BInit(final)
                }
                return final
            },
            BUpdate: (newState) => {
                let final = newState;
                for (let plugin of initializedPlugins) {
                    final = plugin.BUpdate(final)
                }
                return final
            },
            AChange: (oldState, newState) => {
                for (let plugin of initializedPlugins) {
                    plugin.AChange(oldState, newState)
                }
            }
        }
    }
}

// Local Storeage
export const LocalStoragePlugin = {
    new(storageKey: string) {
        const setItem = async (value: any) => {
            localStorage.setItem(storageKey, JSON.stringify(value))
        }

        return <T extends Object, A, AA>(proxy: StoreProxy<T, A, AA>): Plugin<T> => {
            return {
                BInit: (initState) => {
                    try {
                        const state = localStorage.getItem(storageKey)
                        if (!!state) {
                            return JSON.parse(state)
                        }
                    } catch (_) { }
                    return initState
                },
                BUpdate: (newState) => newState,
                AChange: (_, newState) => { setItem(newState) }
            }
        }
    }
}

// DevTool
export type DevToolsOptions = {
    logger: {
        logInit: boolean,
        logChange: boolean,
    },
    deepFreaze: boolean
}

export const _WINDOW_KEY = "MUTE-8-DEVTOOLS"
const getCacheJs = () => localStorage.getItem(_WINDOW_KEY)
const setCacheJs = (code: string) => localStorage.setItem(_WINDOW_KEY, code)
export const removeCacheJs = () => localStorage.removeItem(_WINDOW_KEY)
const fetchJs = async (): Promise<void> => {
    const res = await fetch("http://localhost:4040/devtools-v1.mjs")
    const js = await res.text()
    setCacheJs(js)
}
const injectJs = async (jsCode: string): Promise<void> => {
    if (!!document.getElementById(_WINDOW_KEY)) {
        return
    }
    return new Promise((resolve, _) => {
        if (!document || !window) return;
        var script = document.createElement("script");
        script.id = _WINDOW_KEY
        script.type = "module"
        script.innerText = jsCode
        document.head.appendChild(script)
        setTimeout(resolve, 10)
    })
}

const js = getCacheJs();
if (js) {
    await injectJs(js)
    fetchJs()
}

/** ThinClient - call enable() to initialize */
export interface DevToolsInterface {
    enable: () => void
    disable: () => void
    openDevTools: (globalOptions?: DevToolsOptions) => void;
    register: <T, A, AA>(label: string, options?: DevToolsOptions) => PluginBuilder<T, A, AA>
}

export const DevTools: DevToolsInterface = window[_WINDOW_KEY] ?? {
    disable() {
        removeCacheJs()
    },
    enable() {
        const devtoolsJs = getCacheJs();
        if (!devtoolsJs) {
            fetchJs().then(() => window.location.reload())
        }
    },
    register() { return defaultPlugin },
    openDevTools() { },
} as DevToolsInterface;

export namespace DevToolsPrivateTypes {

    export interface StorageDefintion {
        label: string
    }

    export interface InitState {
        storageLabel: string,
        state: object
    }

    export interface ChangeState {
        storageLabel: string,
        oldState: object,
        newState: object,
    }

    export interface Payload {
        // Host to Dialog
        "init"?: {}
        "storage-definitions"?: Array<StorageDefintion>
        "storage-state-init"?: InitState
        "storage-state-changed"?: ChangeState
        "devtools-options"?: DevToolsOptions
        // Dialog to Host
        "host-command"? : "refresh-host"
    }

}