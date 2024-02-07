import { RegistryOptions, DevToolsInterface } from "../packages/mute8-plugins/mute8-plugins";
import { StoreProxy, Plugin, PluginBuilder } from "../packages/mute8/mute8";
import { WindowHost } from "../node_modules/cors-window"

const deepFreeze = <T extends Object>(object: T) => {
    for (const name of Object.keys(object)) {
        const value = object[name];
        if (!!value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return Object.freeze(object) as Readonly<T>
}

const registryOptionsDefault: RegistryOptions = {
    logger: { logChange: true, logInit: true },
    deepFreaze: true
}
interface Registry<T extends Object = any> {
    label: string,
    proxy: StoreProxy<T, any, any>
    onInit: (oldState: T) => void
    onChange: (oldState: T, newState: T) => void
}

// Ovverides mute8-plugins implementation of DevTools
class DevTools implements DevToolsInterface {
    readonly fullClientUrl = ""
    readonly loaded = true;
    async enable() { }
    readonly Mute8DevToolsUIUrl: string = "http://localhost:4030"; // TODO set to prod
    private sotrageRegistry: Map<string, Registry> = new Map();
    private dialogHost: WindowHost | null

    constructor() {
        const tool = this;
        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.shiftKey && event.code === 'Digit8') {
                tool.openDevTools()
                event.preventDefault()
            }
        });
    }
    register(label: string, options: RegistryOptions = registryOptionsDefault): PluginBuilder<any, any, any> {
        return <T extends Object, A, AA>(proxy: StoreProxy<T, A, AA>): Plugin<T> => {
            const onInit = (v: T) => { }
            const onChange = (v1: T, v2: T) => { }
            this.sotrageRegistry.set(label, {
                label: label,
                proxy: proxy,
                onInit: onInit,
                onChange: onChange
            })
            return {
                BInit: (initState) => {
                    onInit(initState)

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
                    onChange(oldState, newState)
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
    openDevTools() {
        if (this.dialogHost && this.dialogHost.isOpen()) {
            this.dialogHost.child?.focus()
            return;
        }

        console.log("opening")

        this.dialogHost = new WindowHost(this.Mute8DevToolsUIUrl, "devtools", {
            height: 400,
            width: 600,
        })

        this.dialogHost.onMessage = (msg) => {
            console.log(msg)
        }
        setInterval(() => {
            this.dialogHost?.post({test: "OK"})
        }, 1500)
    }
}

// Dom Inject (required by mute8 DevTools plugin)
const inject = () => {
    window["mut8-DevTools"] = new DevTools()
}
inject();
