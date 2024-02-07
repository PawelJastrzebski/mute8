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
export type RegistryOptions = {
    logger: {
        logInit: boolean,
        logChange: boolean,
    },
    deepFreaze: boolean
}

const fetchDevToolsClient = async (scriptUrl: string) => {
    return new Promise((resolve, _) => {
        if (!document || !window) return;
        var script = document.createElement("script");
        script.onload = () => {
            const loaded = window["mut8-DevTools"]
            delete window["mut8-DevTools"]
            resolve(loaded)
        }
        script.type = "module"
        script.src = scriptUrl;
        document.head.appendChild(script)
    })
}

export interface DevToolsInterface {
    readonly fullClientUrl: string,
    readonly loaded: boolean
    enable: () => Promise<void>
    openDevTools: () => void;
    register: <T, A, AA>(label: string, options?: RegistryOptions) => PluginBuilder<T, A, AA>
}

// thin client
export let DevTools: DevToolsInterface = {
    fullClientUrl: "http://localhost:4040/devtools-v1.mjs",
    loaded: false,
    openDevTools() { },
    register() {
        return defaultPlugin
    },
    async enable() {
        DevTools = await fetchDevToolsClient(DevTools.fullClientUrl) as any;
    }
}