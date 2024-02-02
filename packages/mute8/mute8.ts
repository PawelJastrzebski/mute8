// Utils
const O = Object;
const J = JSON;
const toJson = J.stringify
const deepClone = (obj: object) => J.parse(toJson(obj))
const freeze = O.freeze
const assign = O.assign;
// const deepFreeze = <T extends Object>(object: T) => {
//     for (const name of O.keys(object)) {
//         const value = object[name];
//         if (!!value && typeof value === "object") {
//             deepFreeze(value);
//         }
//     }
//     return freeze(object) as Readonly<T>
// }

export interface Plugin<T extends Object = {}> {
    BInit(initState: T): T
    BUpdate(newState: T): T
    AChange(oldState: Readonly<T>, newState: T): void
}
const defaultPlugin: () => Plugin = () => ({
    BInit: (v) => v,
    BUpdate: (v) => v,
    AChange: (v1, v2) => { }
})

class StoreCore<T, A, AA> {
    private id: number = 0; // subscription id
    private c: Record<number, SubFn<T>> = {} // subscription container
    private i: Readonly<T> // current state
    private t: NodeJS.Timeout // sub triger
    private a: A // actions
    private ap: any // actions proxy
    private aa: AA // async action
    private aap: any // async action proxy
    readonly bp: StoreProxy<T, A, AA>; // big proxy
    private p: Plugin<T>

    constructor(inner: T, actions: A, aactions: AA, plugin?: (bp: StoreProxy<T, A, AA>) => Plugin<T>) {
        this.i = freeze(assign({}, inner))
        this.a = freeze(actions);
        this.ap = freeze(buildActionsProxy(this.aFn.bind(this)))
        this.aa = freeze(aactions);
        this.aap = freeze(buildActionsProxy(this.aaFn.bind(this)))
        // init big proxy
        const core = this;
        this.bp = {
            snap: core.s.bind(core),
            sub: core.sub.bind(core),
            async: core.aap,
            actions: this.ap,
            /** @ts-ignore */
            set mut(v: Partial<T>) { core.u(v) },
            /** @ts-ignore */
            get mut() { return core.mutFn.bind(core) }
        }
        // init plugin
        this.p = (plugin ?? defaultPlugin)(this.bp) as Plugin<T>
        this.i = freeze(this.p.BInit(assign({}, inner)))
    }

    /** getAsyncActionFunction() */
    aaFn(action_name: string | symbol): Function {
        const action_fn = this.aa[action_name]
        return action_fn.bind(this.bp)
    }

    /** getActionFunction() */
    aFn(action_name: string | symbol): Function {
        const action_fn = this.a[action_name]
        return (...args: any[]) => {
            const state = deepClone(this.s())
            action_fn.bind(state)(...args)
            this.u(state)
        }
    }

    mutFn(fn: (v: T) => void): void {
        const state = deepClone(this.s())
        fn(state)
        this.u(state)
    }

    /** update() */
    u(newState: Partial<T>): void {
        const newFinal = this.p.BUpdate(assign(deepClone(this.i), newState))
        if (toJson(this.i) !== toJson(newFinal)) {
            clearTimeout(this.t);
            this.p.AChange(this.i, newFinal)
            this.i = freeze(newFinal)
            this.t = setTimeout(this.ns.bind(this), 0);
        }
    }

    /** updateValue() */
    uv(key: any, value: any): void {
        this.u({ [key]: value } as any)
    }

    /** notifySubs() */
    private ns(): void {
        for (const id of O.keys(this.c)) {
            this.c[id](this.i)
        }
    }

    /** snap() */
    s(): Readonly<T> {
        return this.i
    }

    sub(fn: SubFn<T>): Sub {
        const id = this.id++
        this.c[id] = fn
        return {
            destroy: () => delete this.c[id]
        }
    }
}

// Actions Proxy
const buildActionsProxy = (fn: (action_name: string | symbol) => Function) => (
    new Proxy({}, {
        get(_, action_name) { return fn(action_name) },
    })
)

// Proxy
interface SmalProxy<T, A> {
    snap(): T
    set mut(v: Partial<T>)
    get mut(): (fn: (v: T) => void) => void
    actions: Readonly<A>
}
export interface StoreProxy<T, A, AA> extends SmalProxy<T, A> {
    sub(fn: SubFn<T>): Sub
    async: Readonly<AA>
}
export interface ProxyExtension<T, A, AA> {
    name: string,
    init(core: StoreCore<T, A, AA>): object
}

export const newStoreProxy = <T, A, AA>(state: StoreDefiniton<T, A, AA>, ext?: ProxyExtension<T, A, AA>) => {
    const core = new StoreCore(state.value, state.actions ?? {}, state.async ?? {}, state.plugin)
    const extension = !ext ? {} : { [ext.name]: ext.init(core as any) } as {}
    const bigProxy = assign(extension, core.bp)

    return new Proxy({}, {
        get(_, prop) {
            const p = bigProxy[prop];
            if (!!p) return p
            return core.s()[prop]
        },
        set(_, prop, value) {
            if (prop === 'mut') {
                core.u(value)
            } else {
                core.uv(prop, value)
            }
            return true
        },
    }) as any
}

type ExcludeKeys = { async?: never, actions?: never, snap?: never, sub?: never, mut?: never }
// Public
export type Store<T, A, AA> = StoreProxy<T, A, AA> & T
export type SubFn<T> = (value: Readonly<T>) => void
export type Sub = { destroy(): void }

export type VoidFn = ((...args: any) => undefined)
export type AsyncFn = ((...args: any) => Promise<void>);
export interface StoreDefiniton<T extends Object, A, AA> {
    value: T & object & ExcludeKeys
    actions?: A & ThisType<T> & Record<string, VoidFn>
    async?: AA & ThisType<SmalProxy<T, A>> & Record<string, AsyncFn>
    plugin?: (proxy: StoreProxy<T, A, AA>) => Plugin
}
export const newStore = <T, A, AA>(state: StoreDefiniton<T, A, AA>) => {
    return newStoreProxy(state) as Store<T, A, AA>
}
