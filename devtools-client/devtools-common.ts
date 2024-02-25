import { PluginBuilder } from "../packages/mute8/dist/mute8";

// env
export const SCRIPT_URL = "https://paweljastrzebski.github.io/mute8/devtools/v1.mjs"
export const UI_URL = "https://paweljastrzebski.github.io/mute8-devtools/"

// export const SCRIPT_URL = "http://localhost:4040/v1.mjs"
// export const UI_URL = "http://localhost:4030"

// consts
export const DEVTOOLS_KEY = "MUTE-8-DEVTOOLS"
export type DevToolsStatus = "enabled" | "open" | "closed";
export const setDevToolsStatus = (status: DevToolsStatus) => localStorage.setItem(DEVTOOLS_KEY, status)
export const getDevToolsStatus = () => localStorage.getItem(DEVTOOLS_KEY) as DevToolsStatus

export type DevToolsOptions = {
    logger: {
        logInit: boolean,
        logChange: boolean,
    },
    deepFreaze: boolean
}

export interface DevToolsInterface {
    import: () => Promise<void>
    openDevTools: (globalOptions?: DevToolsOptions) => void;
    register: (label: string, options?: DevToolsOptions) => PluginBuilder
}

export namespace DevToolsPrivateTypes {

    export interface DevToolsInit {
        definitions: StorageDefintion[],
        overrides: StateOverrides
    }

    export interface StorageDefintion {
        label: string
    }

    export interface InitState {
        id: number,
        storageLabel: string,
        state: object
        time: number
    }
    
    export type ChangeStateCallArgs = any[] | {_fn: string };
    export interface ChangeState {
        id: number,
        storageLabel: string,
        oldState: object,
        state: object,
        actionName: string | undefined
        args: ChangeStateCallArgs
        time: number
    }

    export interface OverrideState {
        id: number,
        state: object
    }

    type StateOverrides = Record<string, OverrideState>;

    export interface Payload {
        // Host to Dialog
        init?: DevToolsInit,
        stateInit?: InitState
        stateChanged?: ChangeState
        devtoolsOptions?: DevToolsOptions
        // Dialog to Host
        hostCommand?: "refresh-host"
        stateOverrides?: StateOverrides
    }

}