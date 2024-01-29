// Utils
const O = Object;
const J = JSON;
const deepFreeze = <T extends Object>(object: T) => {
    for (const name of O.keys(object)) {
        const value = object[name];
        if (typeof value === "object") {
            deepFreeze(value);
        }
    }

    return O.freeze(object) as Readonly<T>
}
const toJson = J.stringify
const deepClone = (obj: object) => J.parse(toJson(obj))

// private 
export class StateCore<T, A> {
    private subs: Record<symbol, SubFn<T>> = {}
    private inner: Readonly<T>
    private triger: NodeJS.Timeout
    private actions: A
    readonly actionsProxy: any

    constructor(inner: T, actions: A) {
        this.inner = deepFreeze(O.assign({}, inner))
        this.actions = actions;
        this.actionsProxy = O.freeze(buildActionsProxy(this))
    }

    getAction(action_name: string | symbol) : any {
        return this.actions[action_name]
    }

    snap(): Readonly<T> {
        return this.inner
    }

    update(newState: Partial<T>) {
        const newFinal = deepFreeze(O.assign(O.assign({}, this.inner), newState));

        if (toJson(this.inner) !== toJson(newFinal)) {
            this.inner = newFinal;
            clearTimeout(this.triger);
            this.triger = setTimeout(this.notifySubs.bind(this), 0);
        }
    }

    updateValue(key: any, value: any) {
        this.update({ [key]: value } as any)
    }

    notifySubs() {
        for (const symbol of O.getOwnPropertySymbols(this.subs)) {
            this.subs[symbol](this.inner)
        }
    }

    subscribe(fn: SubFn<T>): Sub {
        const id = Symbol()
        this.subs[id] = fn
        return {
            destroy: () => delete this.subs[id]
        }
    }
}

// Actions Proxy 
const buildActionsProxy = <T,A>(core: StateCore<T,A>) => (new Proxy({}, {
    getOwnPropertyDescriptor: () => ({
        configurable: false,
        enumerable: false,
        writable: false
    }),
    get(_, action_name) {
        const native_action = core.getAction(action_name);
        return async (...args: any[]) => {
            const state = deepClone(core.snap())
            await native_action.bind(state)(...args)
            core.update(state)
        }
    },
}))

// Proxy
export interface StateProxy<T, A> {
    snap(): T
    sub(fn: SubFn<T>): Sub
    set mut(v: Partial<T>)
    actions: A
}

export interface ProxyExtension<T, A> {
    get(core: StateCore<T, A>, prop: string | symbol): { value: any } | null;
}

export const newStateProxy = <T, A>(target: any, core: StateCore<T, A>, ext?: ProxyExtension<T, A>) => {
    return new Proxy(target, {
        getOwnPropertyDescriptor: () => ({
            configurable: false,
            enumerable: true,
        }),
        get(_, prop) {
            if (prop === 'sub') return core.subscribe.bind(core)
            if (prop === 'snap') return core.snap.bind(core)
            if (prop === 'actions') return core.actionsProxy;

            let _v = ext?.get(core, prop);
            if (!!_v) return _v.value;

            return core.snap()[prop]
        },
        set(_, prop, value) {
            if (prop === 'mut') {
                core.update(value);
            } else {
                core.updateValue(prop, value)
            }
            return true
        },
    })
}

// Public
export type State<T, A> = StateProxy<T, A> & T
export type SubFn<T> = (value: Readonly<T>) => void
export interface Sub {
    destroy(): void
}

export type VoidFn = ((...args: any) => Promise<void>);
export interface StateDefiniton<T, A> {
    value: T & object & { actions?: never, snap?: never, sub?: never, mut?: never },
    actions?: A & ThisType<T & Readonly<A>> & {
        [key: string]: VoidFn
    }
}
export const newState = <T, A>(state: StateDefiniton<T, A>) => {
    const core = new StateCore(state.value, state.actions ?? {})
    const proxy: StateProxy<T, A> = newStateProxy(state.value, core)
    return proxy as State<T, A>
}
