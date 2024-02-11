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

const now = () => new Date().getTime()
const setDevToolsStatus = (status: "open" | "closed") => localStorage.setItem("dev-tools-opne", status)
const getDevToolsStatus = () => localStorage.getItem("dev-tools-opne")

// Ovverides mute8-plugins implementation of DevTools
class DevTools implements DevToolsInterface {
    enable = () => { };
    disable = () => removeCacheJs();
    readonly Mute8DevToolsUIUrl: string = "http://localhost:4030"; // TODO set to prod
    private sotrageRegistry: Map<string, Registry> = new Map();
    private dialogHost: WindowHost<DevTypes.Payload[]> | null
    private payloadBuffer: DevTypes.Payload[] = []
    private stateOverrides: Record<string, DevTypes.OverrideState> = {}
    constructor() {
        const tool = this;
        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.shiftKey && event.code === 'Digit8') {
                tool.openDevTools()
                event.preventDefault()
            }
        });
    }
    register(label: string, options: DevToolsOptions = registryOptionsDefault): PluginBuilder {
        const devtools = this;
        return <T extends object, A, AA>(proxy: StoreProxy<T, A, AA>): Plugin<T> => {
            const onInit = (v: T) => devtools.setStateInit(label, v)
            const onChange = (v1: T, v2: T) => { devtools.setStateChanged(label, v1, v2) }
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
                    const ovverride = devtools.stateOverrides[label];
                    if (ovverride) {
                        newState = ovverride.state as T
                    }

                    if (options.deepFreaze) {
                        newState = deepFreeze(newState)
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
            height: 550,
            width: 800,
        })
        this.dialogHost.onMessage = this.handleMessage.bind(this)
        this.dialogHost.onChildOpen = this.sentInitData.bind(this)
        this.dialogHost.onChildAttach = this.sentInitData.bind(this)
        this.dialogHost.onChildClose = () => setDevToolsStatus("closed")
    }
    private postPayload(payload: DevTypes.Payload[]) {
        this.dialogHost?.post(payload)
        this.payloadBuffer = this.payloadBuffer.concat(...payload)
    }
    private setStateInit(label: string, state: object) {
        if (this.stateOverrides[label]) return
        this.postPayload([{
            stateInit: {
                storageLabel: label,
                state: state,
                time: now()
            }
        }])
    }
    private setStateChanged(label: string, oldState: object, newState: object) {
        if (this.stateOverrides[label]) return
        this.postPayload([{
            stateChanged: {
                storageLabel: label,
                oldState: oldState,
                newState: newState,
                time: now()
            }
        }])
    }
    private sentInitData() {
        setDevToolsStatus("open")
        const list = Array.from(this.sotrageRegistry.entries());
        const all = list.map(([name, _]) => ({ label: name }))
        this.dialogHost!.post([
            { init: {} },
            { storageDefinitions: all },
            { stateOverrides: this.stateOverrides }
            , ...this.payloadBuffer
        ])
    }
    private handleMessage(list: DevTypes.Payload[]) {
        for (const p of list) {
            if (p.hostCommand === 'refresh-host') {
                window.location.reload()
            }
            if (p.stateOverrides) {
                this.stateOverrides = p.stateOverrides ?? {}
                for (const [label, registry] of this.sotrageRegistry.entries()) {
                    const override = this.stateOverrides[label];
                    if (override) {
                        registry.proxy.mut = override
                    }
                }
            }
        }
    }
}

// Dom Inject (required by mute8 DevTools plugin)
(() => {
    const tools = window[_WINDOW_KEY] = new DevTools();
    if ("open" == getDevToolsStatus()) {
        tools.openDevTools()
    }
})()

