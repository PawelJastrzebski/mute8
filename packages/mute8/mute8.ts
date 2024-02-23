// Utils
const O = Object;
const J = JSON;
const toJson = J.stringify
const deepClone = (obj: object) => J.parse(toJson(obj))
const freeze = O.freeze
const assign = O.assign;
const entries = O.entries;
const defineProperty = O.defineProperty;
const MUT_FN_NAME = "mut"

export interface Plugin<T> {
    /** BeforeInit() */
    BI(initState: T): T
    /** BeforeUpdate() */
    BU(newState: T, actionName?: string): T
    /** AfterChange() */
    AC(oldState: Readonly<T>, newState: T, actionName?: string): void
}
const defaultPlugin: <T>() => Plugin<T> = () => ({
    BI: (v) => v,
    BU: (v) => v,
    AC: (v1, v2, a) => { }
})

class Subject<T> {
    private id: number = 0; // subscription id
    private c: Record<number, SubFn<T>> = {} // subscription container
    private s: Readonly<T> // current state
    private p: Plugin<T> // plugin
    private ps: Sub | null // parent sub (Observer only)

    constructor(
        state: T,
        plugin?: Plugin<T> // plugins not allowed for Observer
    ) {
        this.p = plugin ?? defaultPlugin()
        this.s = freeze(this.p.BI(state))
    }

    destroy() {
        this.ps?.destroy()
        this.ps = null
    }

    sanp(): Readonly<T> {
        return this.s
    }

    sub(fn: SubFn<T>): Sub {
        const id = this.id++
        this.c[id] = fn
        return {
            destroy: () => delete this.c[id]
        }
    }

    mut(update: Partial<T>, actionName?: string): void {
        // for Observer always full update
        let newFinal: T = update as T;
        if (!this.ps) {
            newFinal = this.p.BU(assign(deepClone(this.s), update), actionName)
        }

        if (toJson(this.s) !== toJson(newFinal)) {
            this.p.AC(this.s, newFinal, actionName)
            this.s = freeze(newFinal)
            // notify subscribers
            O.keys(this.c).forEach(id => this.c[id](this.s), actionName)
        }
    }

    set<K extends keyof T>(key: K & string | typeof MUT_FN_NAME, value: T[K] | Partial<T>): void {
        const actionName = "set." + key;
        const v = (key === MUT_FN_NAME ? value : { [key]: value }) as Partial<T>;
        this.mut(v, actionName)
    }

    select<O>(fn: SelectFn<T, O>): Observer<O> {
        const observer = new Subject(fn(this.sanp()))
        observer.ps = this.sub((v) => observer.mut(fn(v)))
        return observer;
    }
}

interface Observer<T> {
    sub(fn: SubFn<T>): Sub
    select<O>(fn: SelectFn<T, O>): Observer<O>
    sanp(): Readonly<T>
    destroy(): void
}

class StoreCore<T extends object, A, AA> {
    private readonly p: StoreProxy<T, A, AA>;
    readonly s: Subject<T>

    constructor(d: StoreDefiniton<T, A, AA>) {
        this.s = new Subject(d.value)
        const asyncProxy = buildActionProxy(d.async ?? {} as AA, (_, fn) => {
            return async (...args: any[]) => await fn.bind(this.p)(...args)
        })
        const actionsProxy = buildActionProxy(d.actions ?? {} as A, (name, fn) => {
            return (...args: any[]) => this.mut(v => fn.bind(v)(...args), name)
        })
        // init proxy
        const core = this;
        this.p = {
            snap: () => core.s.sanp(),
            sub: (v) => core.s.sub(v),
            select: (f) => core.s.select(f),
            actions: actionsProxy,
            async: asyncProxy,
            /** @ts-ignore */
            set mut(v: Partial<T>) { core.s.set(MUT_FN_NAME, v) },
            /** @ts-ignore */
            get mut() { return core.mut.bind(core) }
        }

        // init plugin
        const p = d.plugin?.(this.p) ?? defaultPlugin()
        this.s = new Subject(d.value, p)
    }

    mut(fn: (v: T) => void, actionName?: string): void {
        const state = deepClone(this.s.sanp())
        fn(state)
        this.s.mut(state, actionName)
    }

    static build<T extends object, A, AA>(
        state: StoreDefiniton<T, A, AA>,
        ext?: ProxyExtension<T, A, AA>
    ): Store<T, A, AA> {
        const core = new StoreCore(state)
        const extension = !ext ? {} : { [ext.name]: ext.init(core as StoreCore<any, any, any>) } as {}
        const bigProxy = assign(extension, core.p)

        // build store representation (proxy)
        const store = {}
        for (const [key, _] of entries(state.value)) {
            defineProperty(store, key, {
                get() { return core.s.sanp()[key] },
                set(v) { core.s.set(key as any, v) }
            })
        }
        defineProperty(store, MUT_FN_NAME, {
            get() { return core.mut.bind(core) },
            set(v) { core.s.set(MUT_FN_NAME, v) }
        })
        return freeze(assign(store, bigProxy)) as Store<T, A, AA>
    }

}

const buildActionProxy = <T>(actions: T, proxy: (fnName: string, fn: Function) => Function): T => {
    const aProxy: Record<string, Function> = {}
    entries(actions as object).forEach(([name, fn]) => aProxy[name] = proxy(name, fn))
    return freeze(aProxy) as T
}

// Proxy
interface SmalProxy<T, A> {
    snap(): T
    set mut(v: Partial<T>)
    get mut(): (fn: (v: T) => void, actionName?: string) => void
    actions: Readonly<A>
}
export interface StoreProxy<T, A, AA> extends SmalProxy<T, A> {
    sub(fn: SubFn<T>): Sub
    select<O>(fn: (value: Readonly<T>) => O): Observer<O>
    async: Readonly<AA>
}
export interface ProxyExtension<T extends object, A, AA> {
    name: string,
    init(core: StoreCore<T, A, AA>): object
}

// Use Only for internal ProxyExtension
export const buildProxy = StoreCore.build;
type ExcludeKeys = { async?: never, actions?: never, snap?: never, sub?: never, mut?: never }
// Public
export type PluginBuilder = (<T extends object>(proxy: StoreProxy<T, any, any>) => Plugin<T>) | null
export type Store<T, A, AA> = StoreProxy<T, A, AA> & T
export type SubFn<T> = (value: Readonly<T>) => void
export type SelectFn<T, O> = (value: Readonly<T>) => O
export type Sub = { destroy(): void }

export type VoidFn = ((...args: any) => undefined)
export type AsyncFn = ((...args: any) => Promise<void>);
export interface StoreDefiniton<T extends object, A, AA> {
    value: T & object & ExcludeKeys
    actions?: A & ThisType<T> & Record<string, VoidFn>
    async?: AA & ThisType<SmalProxy<T, A>> & Record<string, AsyncFn>
    plugin?: PluginBuilder
}
export const newStore = <T extends object, A, AA>(state: StoreDefiniton<T, A, AA>) => {
    return buildProxy(state) as Store<T, A, AA>
}
