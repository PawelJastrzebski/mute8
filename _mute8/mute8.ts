// Utils
const deepFreeze = <T extends Object>(object: T) => {
    for (const name of Reflect.ownKeys(object)) {
        const value = object[name];
        if (typeof value === "object") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object) as Readonly<T>
}
const toJson = JSON.stringify

// private 
export class StateCore<T> {
    private subs: Record<symbol, SubFn<T>> = {}
    private inner: Readonly<T>
    private triger: NodeJS.Timeout

    constructor(inner: T) {
        this.inner = deepFreeze(Object.assign({}, inner))
    }

    snap(): Readonly<T> {
        return this.inner
    }

    update(newState: Partial<T>) {
        const newFinal = deepFreeze(Object.assign(Object.assign({}, this.inner), newState));

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
        for (const symbol of Object.getOwnPropertySymbols(this.subs)) {
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

// Proxy
export interface StateProxy<T> {
    snap(): T
    sub(fn: SubFn<T>): Sub
    set mut(v: Partial<T>)
}

const propertyDescriptor: PropertyDescriptor = {
    configurable: false,
    enumerable: true,
};

export interface ProxyExtension<T> {
    get(core: StateCore<T>, prop: string | symbol): { value: any } | null;
}

export const proxyBuilder = <T>(target: any, core: StateCore<T>, ext?: ProxyExtension<T>) => {
    return new Proxy(target, {
        getOwnPropertyDescriptor: (target, p) => propertyDescriptor,
        get(target, prop, receiver) {
            if (prop === 'sub') return core.subscribe.bind(core)
            if (prop === 'snap') return core.snap.bind(core)

            let _v = ext?.get(core, prop);
            if (!!_v) return _v.value;

            return core.snap()[prop]
        },
        set(target, prop, value) {
            if (prop === 'mut') {
                core.update(value);
            } else {
                core.updateValue(prop, value)
            }
            return target
        },
    })
}

// -----------------------------------------------------------------------------
// Public
export type State<T> = StateProxy<T> & T
export type SubFn<T> = (value: Readonly<T>) => void
export interface Sub {
    destroy(): void
}

export interface StateBuilder<T> {
    value: T & object & { snap?: never, sub?: never, mut?: never },
    actions?: {
        [key: string]: Function
    }
}
export const newState = <T>(state: StateBuilder<T>) => {
    const core = new StateCore(state.value)
    const proxy: StateProxy<T> = proxyBuilder(state.value as any, core)
    return proxy as State<T>
}
