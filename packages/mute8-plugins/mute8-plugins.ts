import { Plugin, PluginBuilder, StoreProxy, defaultPlugin } from "../mute8/mute8"

// CombinePlugins Util
export const CombinePlugins = (...plugins: PluginBuilder[]) => {
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
interface ILocalStorage {
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
}
export const LocalStoragePlugin = {
    new(storageKey: string, storage: ILocalStorage = localStorage): PluginBuilder {
        const setItem = async (value: object) => storage.setItem(storageKey, JSON.stringify(value))
        const getItem = () => storage.getItem(storageKey)

        return <T = object>(_: StoreProxy<T, any, any>): Plugin => {
            return {
                BInit: (initState) => {
                    try {
                        const state = getItem();
                        if (!!state) {
                            initState = JSON.parse(state)
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
import { DevToolsInterface, SCRIPT_URL, DEVTOOLS_KEY, disableDevTools, setDevToolsStatus, DevToolsEnabled } from "../../devtools-client/devtools-common"
if (DevToolsEnabled()) {
    await import(SCRIPT_URL as any)
}

/** 
 * ThinClient 
 * Call enable() to initialize in your code, then [Ctrl + Shift + 8] to Open
 */
export const DevTools: DevToolsInterface = window[DEVTOOLS_KEY] ?? {
    enable() {
        if (!DevToolsEnabled()) {
            setDevToolsStatus("enabled")
            window.location.reload()
        }
    },
    disable() { disableDevTools() },
    register() { return defaultPlugin },
    openDevTools() { },
} as DevToolsInterface;