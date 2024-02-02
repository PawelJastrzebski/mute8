import { Plugin, PluginBuilder, StoreProxy } from "../mute8/mute8"

// CombinePlugins Util
export const CombinePlugins = <T extends Object, A, AA>(...plugins: PluginBuilder<T, A, AA>[]) => {
    return <T extends Object, A, AA>(proxy: StoreProxy<T, A, AA>): Plugin<T> => {
        const initializedPlugins = plugins.map(p => p(proxy as any)) as Plugin<T>[]

        return {
            BInit: (initState) => {
                let final = initState as T;
                for (let plugin of initializedPlugins) {
                    final = plugin.BInit(final)
                }
                return final
            },
            BUpdate: (newState) => {
                let final = newState as T;
                for (let plugin of initializedPlugins) {
                    final = plugin.BUpdate(final)
                }
                return final
            },
            AChange: (oldState, newState) => {
                for (let plugin of initializedPlugins) {
                    plugin.AChange(oldState as T, newState as T)
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

// DevPlugin
const deepFreeze = <T extends Object>(object: T) => {
    for (const name of Object.keys(object)) {
        const value = object[name];
        if (!!value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return Object.freeze(object) as Readonly<T>
}

export type DevPluginOptions = {
    logger: {
        logInit: boolean,
        logChange: boolean,
    },
    deepFreaze: boolean
}
const DevPluginOptionsDefault: DevPluginOptions = {
    logger: { logChange: true, logInit: true },
    deepFreaze: true
}
export const DevPlugin = {
    new(label: string, options: DevPluginOptions = DevPluginOptionsDefault) {
        return <T extends Object, A, AA>(proxy: StoreProxy<T, A, AA>): Plugin<T> => {
            return {
                BInit: (initState) => {
                    if (options.logger.logInit) {
                        console.table({
                            [`${label}-init`]: initState,
                        })
                    }

                    if (options.deepFreaze) {
                        return deepFreeze(initState)
                    }
                    return initState
                },
                BUpdate: (newState) => {
                    if (options.deepFreaze) {
                        return deepFreeze(newState)
                    }
                    return newState
                },
                AChange: (oldState, newState) => {
                    if (options.logger.logChange) {
                        console.table({
                            [`${label}-old`]: oldState,
                            [`${label}-new`]: newState
                        })
                    }
                }
            }
        }
    }
}