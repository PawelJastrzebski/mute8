import { RegistryOptions, DevToolsInterface } from "../packages/mute8-plugins/mute8-plugins";
import { StoreProxy, Plugin, PluginBuilder } from "../packages/mute8/mute8";

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
    readonly loaded = true;
    async enable() { }
    readonly Mute8DevToolsUIUrl: string = "http://localhost:4030"; // TODO set to prod
    private sotrageRegistry: Map<string, Registry> = new Map();
    private devtoolsWindow: WindowProxy | null

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
        if (this.devtoolsWindow && this.devtoolsWindow.closed == false) {
            this.devtoolsWindow.focus()
            return;
        }

        // todo openWindow function with better position support
        const w = 800;
        const h = 500;
        const left = ((window?.innerWidth ?? 600) / 2) + (window?.screenLeft ?? 0) - (w / 2)
        const top = (window?.innerHeight ?? 500) / 2
        const settings = `toolbar=0, scrollbars=1, resizable=1, width=${w}, height=${h}, top=${top}, left=${left}`;
        this.devtoolsWindow = window.open(this.Mute8DevToolsUIUrl, "_blank", settings)
        this.initDevToolsWindowHandlers()
        
    }
    initDevToolsWindowHandlers() {
        const tools = this;
        if (!tools.devtoolsWindow) return
        // todo
    }
}

// Dom Inject (required by mute8 DevTools plugin)
const inject = () => {
    window["f72f1acd8"] = new DevTools()
}
inject();
