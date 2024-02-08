import { DevToolsOptions, DevToolsInterface, _WINDOW_KEY, DevToolsPrivateTypes as DevTypes, removeCacheJs } from "../packages/mute8-plugins";
import { StoreProxy, Plugin, PluginBuilder, } from "../packages/mute8";
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

const registryOptionsDefault: DevToolsOptions = {
    logger: { logChange: false, logInit: true },
    deepFreaze: true
}
interface Registry<T extends Object = any> {
    label: string,
    proxy: StoreProxy<T, any, any>
    onInit: (oldState: T) => void
    onChange: (oldState: T, newState: T) => void
}

const setDevToolsStatus = (status: "open" | "closed") => localStorage.setItem("dev-tools-opne", status);
const getDevToolsStatus = () => localStorage.getItem("dev-tools-opne");

// Ovverides mute8-plugins implementation of DevTools
class DevTools implements DevToolsInterface {
    enable = () => { };
    disable = () => removeCacheJs();
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
    register(label: string, options: DevToolsOptions = registryOptionsDefault): PluginBuilder<any, any, any> {
        return <T extends Object, A, AA>(proxy: StoreProxy<T, A, AA>): Plugin<T> => {
            const onInit = (v: T) => this.setStateInit(label, v)
            const onChange = (v1: T, v2: T) => { this.setStateChanged(label, v1, v2) }
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
    // DevTools Dialog
    openDevTools() {
        if (this.dialogHost && this.dialogHost.isOpen()) {
            this.dialogHost.child?.focus()
            return;
        }
        this.dialogHost = new WindowHost(this.Mute8DevToolsUIUrl, "devtools", {
            height: 500,
            width: 700,
        })
        this.dialogHost.onMessage = this.handleMessage.bind(this)
        this.dialogHost.onChildOpen = this.sentInitData.bind(this)
        this.dialogHost.onChildAttach = this.sentInitData.bind(this)
        this.dialogHost.onChildClose = () => setDevToolsStatus("closed")
    }
    private setStateInit(label: string, state: object) {
        const payload: DevTypes.Payload = {
            "storage-state-init": {
                storageLabel: label,
                state: state
            }
        }
        this.dialogHost?.post(payload)

    }
    private setStateChanged(label: string, oldState: object, newState: object) {
        const payload: DevTypes.Payload = {
            "storage-state-changed": {
                storageLabel: label,
                oldState: oldState,
                newState: newState
            }
        }
        this.dialogHost?.post(payload)
    }
    private sentInitData() {
        setDevToolsStatus("open")
        const all = Array.from(this.sotrageRegistry.entries()).map(([name, registry]) => {
            return {
                label: name
            }
        })
        const payload: DevTypes.Payload = {
            "storage-definitions": all
        }
        this.dialogHost?.post(payload)
    }
    private handleMessage(payload: DevTypes.Payload) {
        if(payload["host-command"]) {
            const command = payload["host-command"];
            if( command === 'refresh-host') {
                window.location.reload()
            }
        }
    }
}

// Dom Inject (required by mute8 DevTools plugin)
(() => {
    const tools = new DevTools();
    window[_WINDOW_KEY] = tools
    if ("open" == getDevToolsStatus()) {
        tools.openDevTools()
    }
})()

