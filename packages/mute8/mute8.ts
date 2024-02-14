// Utils
const O = Object;
const J = JSON;
const toJson = J.stringify
const deepClone = (obj: object) => J.parse(toJson(obj))
const freeze = O.freeze
const assign = O.assign;
const isObject = (a: any) => typeof a == "object"

export interface Plugin<T> {
    /** BeforeInit() */
    BInit(initState: T): T
    /** BeforeUpdate() */
    BUpdate(newState: T): T
    /** AfterChange() */
    AChange(oldState: Readonly<T>, newState: T): void
}
export const defaultPlugin: <T>() => Plugin<T> = () => ({
    BInit: (v) => v,
    BUpdate: (v) => v,
    AChange: (v1, v2) => { }
})

class Subject<T> {
    private id: number = 0; // subscription id
    private c: Record<number, SubFn<T>> = {} // subscription container
    private t: NodeJS.Timeout // sub triger
    private s: Readonly<T> // current state
    private p: Plugin<T>
    private ps: Sub | null // parent sub

    constructor(
        state: T,
        plugin?: Plugin<T>
    ) {
        this.p = plugin ?? defaultPlugin()
        this.s = freeze(this.p.BInit(state))
    }

    /** notifySubs() */
    private ns(): void {
        O.keys(this.c).forEach(id => this.c[id](this.s))
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

    next(update: Partial<T>): void {
        if (!isObject(this.s)) {
            if (this.s !== update) {
                this.s = update as T
                this.ns()
            }
            return
        }

        const newFinal = this.p.BUpdate(assign(deepClone(this.s), update))
        if (toJson(this.s) !== toJson(newFinal)) {
            clearTimeout(this.t);
            this.p.AChange(this.s, newFinal)
            this.s = freeze(newFinal)
            this.t = setTimeout(this.ns.bind(this), 0);
        }
    }

    select<O>(fn: SelectFn<T, O>): Observer<O> {
        const subject = new Subject(fn(this.sanp()))
        subject.ps = this.sub((v) => subject.next(fn(v)))
        return subject;
    }
}

interface Observer<T> {
    sub(fn: SubFn<T>): Sub
    select<O>(fn: SelectFn<T, O>): Observer<O>
    sanp(): Readonly<T>
    destroy(): void
}

class StoreCore<T, A, AA> {
    readonly s: Subject<T>
    readonly bp: StoreProxy<T, A, AA>; // big proxy

    constructor(state: T, actions: A, aactions: AA, plugin?: PluginBuilder) {
        this.s = new Subject(state)
        const asyncProxy = buildActionProxy(aactions, (_, fn) => {
            return async (...args: any[]) => await fn.bind(this.bp)(...args)
        })
        const actionsProxy = buildActionProxy(actions, (_, fn) => {
            return (...args: any[]) => {
                const state = deepClone(this.s.sanp())
                fn.bind(state)(...args)
                this.s.next(state)
            }
        })
        // init big proxy
        const core = this;
        this.bp = {
            snap: () => core.s.sanp(),
            sub: (v) => core.s.sub(v),
            select: (f) => core.s.select(f),
            actions: actionsProxy,
            async: asyncProxy,
            /** @ts-ignore */
            set mut(v: Partial<T>) { core.s.next(v) },
            /** @ts-ignore */
            get mut() { return core.mut.bind(core) }
        }

        // init plugin
        const p = (plugin ?? defaultPlugin)(this.bp);
        this.s = new Subject(state, p)
    }

    mut(fn: (v: T) => void): void {
        const state = deepClone(this.s.sanp())
        fn(state)
        this.s.next(state)
    }

    /** updateValue() */
    update(key: any, value: any): void {
        if (key === "mut") return this.s.next(value)
        this.s.next({ [key]: value } as Partial<T>)
    }
}

const buildActionProxy = <T>(actions: T, proxy: (fnName: string, fn: Function) => Function): T => {
    const aProxy: Record<string, Function> = {}
    O.entries(actions).forEach(([name, fn]) => aProxy[name] = proxy(name, fn))
    return freeze(aProxy) as T
}

// Proxy
interface SmalProxy<T, A> {
    snap(): T
    set mut(v: Partial<T>)
    get mut(): (fn: (v: T) => void) => void
    actions: Readonly<A>
}
export interface StoreProxy<T, A, AA> extends SmalProxy<T, A> {
    sub(fn: SubFn<T>): Sub
    select<O>(fn: (value: Readonly<T>) => O): Observer<O>
    async: Readonly<AA>
}
export interface ProxyExtension<T, A, AA> {
    name: string,
    init(core: StoreCore<T, A, AA>): object
}

/**  
* Use Only for internal ProxyExtension
*/
export const newStoreProxy = <T, A, AA>(state: StoreDefiniton<T, A, AA>, ext?: ProxyExtension<T, A, AA>) => {
    const core = new StoreCore(
        state.value,
        state.actions ?? {},
        state.async ?? {},
        state.plugin
    )
    const extension = !ext ? {} : { [ext.name]: ext.init(core as StoreCore<any, any, any>) } as {}
    const bigProxy = assign(extension, core.bp)
    return new Proxy({}, {
        get(_, prop) {
            const p = bigProxy[prop];
            if (!!p) return p
            return core.s.sanp()[prop]
        },
        set(_, prop, value) {
            core.update(prop, value)
            return true
        },
    }) as any
}

type ExcludeKeys = { async?: never, actions?: never, snap?: never, sub?: never, mut?: never }
// Public
export type PluginBuilder = <T>(proxy: StoreProxy<T, any, any>) => Plugin<T>
export type Store<T, A, AA> = StoreProxy<T, A, AA> & T
export type SubFn<T> = (value: Readonly<T>) => void
export type SelectFn<T, O> = (value: Readonly<T>) => O
export type Sub = { destroy(): void }

export type VoidFn = ((...args: any) => undefined)
export type AsyncFn = ((...args: any) => Promise<void>);
export interface StoreDefiniton<T extends Object, A, AA> {
    value: T & object & ExcludeKeys
    actions?: A & ThisType<T> & Record<string, VoidFn>
    async?: AA & ThisType<SmalProxy<T, A>> & Record<string, AsyncFn>
    plugin?: PluginBuilder
}
export const newStore = <T, A, AA>(state: StoreDefiniton<T, A, AA>) => {
    return newStoreProxy(state) as Store<T, A, AA>
}
