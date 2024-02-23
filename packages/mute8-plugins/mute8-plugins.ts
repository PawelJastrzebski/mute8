import { Plugin, PluginBuilder, StoreProxy } from "../mute8/mute8"

// CombinePlugins Util
export const CombinePlugins = (...plugins: PluginBuilder[]): PluginBuilder => {
    return <T extends object>(proxy: StoreProxy<T, any, any>): Plugin<T> => {
        const initializedPlugins = plugins
            .map(p => p?.(proxy))
            .filter(p => !!p) as Plugin<T>[]

        return {
            BI: (initState) => {
                let final = initState;
                for (let plugin of initializedPlugins) {
                    final = plugin.BI(final)
                }
                return final
            },
            BU: (newState) => {
                let final = newState;
                for (let plugin of initializedPlugins) {
                    final = plugin.BU(final)
                }
                return final
            },
            AC: (oldState, newState) => {
                for (let plugin of initializedPlugins) {
                    plugin.AC(oldState, newState)
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

        return <T>(_: StoreProxy<T, any, any>): Plugin<any> => {
            return {
                BI: (initState) => {
                    try {
                        const state = getItem();
                        if (!!state) {
                            initState = JSON.parse(state)
                        }
                    } catch (_) { }
                    return initState
                },
                BU: (newState) => newState,
                AC: (_, newState) => { setItem(newState) }
            }
        }
    }
}

// DevTool
import { DevToolsInterface, SCRIPT_URL, DEVTOOLS_KEY } from "../../devtools-client/devtools-common"
export { DevToolsPrivateTypes } from "../../devtools-client/devtools-common"
/** 
* DevTools ThinClient
*
* Call `await DevTools.enable()` on top of your file to initialize it.
* Press [Ctrl + Shift + 8] in your application window to open the DevTools.
 */
export const DevTools: DevToolsInterface = window[DEVTOOLS_KEY] ?? {
    async import() {
        await import(SCRIPT_URL /* @vite-ignore */)
    },
    register() { return null as PluginBuilder },
    openDevTools() { },
} as DevToolsInterface;

/** 
 * If your build doesn't support top-level `await` to call `await DevTools.enable()`, import this script at the top of your file or in HTML head section.
 * 
 * Example:
 * import "<DEV_TOOLS_SCRIPT_URL>" * 
 * 
 * Example:
 * <script type="module" src="<DEV_TOOLS_SCRIPT_URL>" ></script>
 */
export const DEV_TOOLS_SCRIPT_URL = SCRIPT_URL