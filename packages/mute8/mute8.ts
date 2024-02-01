// Utils
const O = Object;
const J = JSON;
const toJson = J.stringify
const deepClone = (obj: object) => J.parse(toJson(obj))
const freeze = O.freeze
const assign = O.assign;
const deepFreeze = <T extends Object>(object: T) => {
    for (const name of O.keys(object)) {
        const value = object[name];
        if (!!value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return freeze(object) as Readonly<T>
}

class StoreCore<T, A, AA> {
    private id: number = 0; // subscription id
    private c: Record<number, SubFn<T>> = {} // subscription container
    private i: Readonly<T> // current state
    private t: NodeJS.Timeout // sub triger
    private a: A // actions
    readonly ap: any // actions proxy
    private aa: AA // async action
    readonly aap: any // async action proxy
    readonly sp: SmalProxy<T, A>; // small proxy

    constructor(inner: T, actions: A, aactions: AA) {
        this.i = deepFreeze(assign({}, inner))
        this.a = freeze(actions);
        this.ap = freeze(buildActionsProxy((n) => this.aFn(n)))
        this.aa = freeze(aactions);
        this.aap = freeze(buildActionsProxy((n) => this.aaFn(n)))
        // init small proxy
        const core = this;
        this.sp = {
            actions: this.ap,
            snap() { return core.s() },
            get mut() { return core.mutFn.bind(core) },
            set mut(v: Partial<T>) { core.u(v) }
        } as any
    }

    /** getAsyncActionFunction() */
    aaFn(action_name: string | symbol): Function {
        const action_fn = this.aa[action_name]
        return action_fn.bind(this.sp)
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
        const newFinal = deepFreeze(assign(deepClone(this.i), newState));

        if (toJson(this.i) !== toJson(newFinal)) {
            this.i = newFinal;
            clearTimeout(this.t);
            this.t = setTimeout(this.ns.bind(this), 0);
        }
    }

    /** updateValue() */
    uv(key: any, value: any): void {
        this.u({ [key]: value } as any)
    }

    /** notifySubs() */
    ns(): void {
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
    const core = new StoreCore(state.value, state.actions ?? {}, state.async ?? {})
    const extension = !ext ? {} : { [ext.name]: ext.init(core as any) } as {}
    const bigProxy = assign({
        sub: core.sub.bind(core),
        async: core.aap,
    }, assign(extension, core.sp))

    return new Proxy({}, {
        get(t, prop) {
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
export interface StoreDefiniton<T, A, AA> {
    value: T & object & ExcludeKeys,
    actions?: A & ThisType<T> & Record<string, VoidFn>
    async?: AA & ThisType<SmalProxy<T, A>> & Record<string, AsyncFn>
}
export const newStore = <T, A, AA>(state: StoreDefiniton<T, A, AA>) => {
    return newStoreProxy(state) as Store<T, A, AA>
}
