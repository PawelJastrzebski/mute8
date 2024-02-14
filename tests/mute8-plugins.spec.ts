import { newStore, Plugin } from "../packages/mute8"

test('Empty Plugin', async () => {
    const empty: Plugin<any> = {
        BInit: function (initState: any) {
            return initState
        },
        BUpdate: function (newState: any) {
            return newState
        },
        AChange: function (oldState: Readonly<any>, newState: any): void { }
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


// import { DevTools, CombinePlugins, LocalStoragePlugin } from "../packages/mute8-plugins/mute8-plugins"
// test('TODO jest error - SyntaxError: await is only valid in async functions and the top level bodies of modules', async () => {
//     const store = newStore({
//         value: {
//             status: "init"
//         },
//         plugin: CombinePlugins(
//             LocalStoragePlugin.new("async-users"),
//             DevTools.register("async-users")
//         )
//     })
//     expect(store.status).toEqual("init")
// })
