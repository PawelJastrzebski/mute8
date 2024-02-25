/**
 * @jest-environment jsdom
 */
import { newStore, Plugin } from "../../packages/mute8"

test('Empty Plugin', async () => {
    const empty: Plugin<any> = {
        BI: function (initState: any) {
            return initState
        },
        BU: function (newState: any) {
            return newState
        },
        AC: function (oldState: Readonly<any>, newState: any, actionName: string, args: any[]): void {

        }
    }

    const store = newStore({
        value: {
            count: 1,
        },
        plugin: (core) => {
            expect((core.snap() as any).count).toEqual(1)
            return empty;
        }
    })
    expect(store.count).toEqual(1)
})

describe("Plugin update stack testing", () => {
    interface Stack {
        old: any,
        new: any,
        name: string,
        args: any[]
    }

    const stacKPlugin = (stack: Stack[]): () => Plugin<any> => {
        return () => ({
            BI: function (initState: any) {
                return initState
            },
            BU: function (newState: any) {
                return newState
            },
            AC: function (oldState: Readonly<any>, newState: any, actionName: string, args: any[]): void {
                stack.push({
                    old: oldState,
                    new: newState,
                    name: actionName,
                    args: args
                })
            }
        })
    }

    test('set.count', async () => {
        const updateStack = [] as Stack[]
        const StackPlugin = stacKPlugin(updateStack)
        const store = newStore({
            value: { count: 1 },
            plugin: StackPlugin
        })
        store.count = 3;

        expect(updateStack).toEqual([
            {
                old: { count: 1 },
                new: { count: 3 },
                name: "set.count",
                args: [3]
            }
        ])
    })

    test('set.count', async () => {
        const updateStack = [] as Stack[]
        const StackPlugin = stacKPlugin(updateStack)
        const store = newStore({
            value: { count: 1 },
            plugin: StackPlugin
        })
        store.count = 3;

        expect(updateStack).toEqual([
            {
                old: { count: 1 },
                new: { count: 3 },
                name: "set.count",
                args: [3]
            }
        ])
    })

    test('set.mut', async () => {
        const updateStack = [] as Stack[]
        const StackPlugin = stacKPlugin(updateStack)
        const store = newStore({
            value: { count: 1 },
            plugin: StackPlugin
        })
        store.mut = { count: 3 }

        expect(updateStack).toEqual([
            {
                old: { count: 1 },
                new: { count: 3 },
                name: "set.mut",
                args: [{ count: 3 }]
            }
        ])
    })

    test('anonymous', async () => {
        const updateStack = [] as Stack[]
        const StackPlugin = stacKPlugin(updateStack)
        const store = newStore({
            value: { count: 1 },
            plugin: StackPlugin
        })
        const fnAnonymous = v => v.count = 3;
        store.mut(fnAnonymous)

        expect(updateStack).toEqual([
            {
                old: { count: 1 },
                new: { count: 3 },
                name: undefined,
                args: fnAnonymous
            }
        ])
    })

    test('customName', async () => {
        const updateStack = [] as Stack[]
        const StackPlugin = stacKPlugin(updateStack)
        const store = newStore({
            value: { count: 1 },
            plugin: StackPlugin
        })
        const fnAnonymous = v => v.count = 3;
        store.mut(fnAnonymous, "customName")

        expect(updateStack).toEqual([
            {
                old: { count: 1 },
                new: { count: 3 },
                name: "customName",
                args: fnAnonymous
            }
        ])
    })

    test('setCount', async () => {
        const updateStack = [] as Stack[]
        const StackPlugin = stacKPlugin(updateStack)
        const store = newStore({
            value: { count: 1 },
            actions: {
                setCount(value: number) {
                    this.count = value;
                }
            },
            plugin: StackPlugin
        })
        store.actions.setCount(3)

        expect(updateStack).toEqual([
            {
                old: { count: 1 },
                new: { count: 3 },
                name: "setCount",
                args: [3]
            }
        ])
    })

})

import { DevTools, CombinePlugins, LocalStoragePlugin } from "../../packages/mute8-plugins/mute8-plugins.ts"
test('TODO jest error - SyntaxError: await is only valid in async functions and the top level bodies of modules', async () => {
    // import("http://localhost:4040/v1.mjs" as any)
    // await DevTools.import()

    // @see tsconfig -  "allowImportingTsExtensions": true,
    // https://jestjs.io/docs/configuration#extensionstotreatasesm-arraystring
    // https://jestjs.io/docs/ecmascript-modules

    const store = newStore({
        value: {
            status: "init"
        },
        plugin: CombinePlugins(
            LocalStoragePlugin.new("async-users"),
            DevTools.register("async-users")
        )
    })
    expect(store.status).toEqual("init")
})