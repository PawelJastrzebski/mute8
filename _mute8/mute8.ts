const deepFreeze = <T extends Object>(object: T) => {
    const propNames = Reflect.ownKeys(object);
    for (const name of propNames) {
        const value = object[name];
        if (typeof value === "object" || typeof value === "function") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object) as Readonly<T>
}

// private 

export class StateCore<T> {
    private subs: Record<symbol, SubFn<T>> = {}
    private inner: Readonly<T>
    private triger: any

    constructor(inner: T) {
        this.inner = deepFreeze(Object.assign({}, inner))
    }

    snap(): Readonly<T> {
        return this.inner
    }

    update(newState: Partial<T>) {
        const newFinal = deepFreeze(Object.assign(Object.assign({}, this.inner), newState));

        if (JSON.stringify(this.inner) !== JSON.stringify(newFinal)) {
            this.inner = newFinal;
            clearTimeout(this.triger);
            this.triger = setTimeout(this.fireUpdate.bind(this), 0);
        }
    }

    fireUpdate() {
        for (const symbol of Object.getOwnPropertySymbols(this.subs)) {
            this.subs[symbol](this.inner)
        }
    }

    updateValue(key: any, value: any) {
        let newState = {};
        newState[key] = value;
        this.update(newState)
    }

    subscribe(fn: SubFn<T>): Sub {
        const id = Symbol()
        this.subs[id] = fn
        return {
            id: id,
            destroy: () => delete this.subs[id]
        }
    }
}

export interface Statefull<T> {
    snap(): T
    sub(fn: SubFn<T>): Sub
    set mut(v: Partial<T>)
}

// Proxy
const propertyDescriptor: PropertyDescriptor = {
    configurable: false,
    enumerable: true,
};

export interface ProxyExtension<T> {
    get(core: StateCore<T>, prop: string | symbol): {value: any} | null;
}

export const proxyBuilder = <T>(target: any, core: StateCore<T>, ext?: ProxyExtension<T>) => {
    return new Proxy(target, {
        // getOwnPropertyDescriptor: (target, p) => propertyDescriptor,
        get(target, prop, receiver) {
            if (prop === 'sub') return core.subscribe.bind(core)
            if (prop === 'snap') return core.snap.bind(core)

            let _v = ext?.get(core, prop);
            if(!!_v) return _v.value;

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
export type State<T> = T & Statefull<T>
export type SubFn<T> = (value: Readonly<T>) => void
export interface Sub {
    id: symbol
    destroy(): void
}

export interface StateBuilder<T extends Object> {
    value: T,
    actions?: {}
}
export const newState = <T extends Object>(state: StateBuilder<T>) => {
    const core = new StateCore(state.value);
    const proxy: Statefull<T> = proxyBuilder(state.value as any, core)
    return proxy as State<T>
}

export const mut = <T>(value: Partial<T>) => {
    return value as State<T>
}
export const skip = <T>() => {
    return {} as State<T>
}

