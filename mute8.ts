
export const Xstate: symbol = Symbol();

export const mut = <T>(value: Partial<T>) => {
    return value as State<T>
}
export const skip = <T>() => {
    return {} as State<T>
}


const deepFreeze = (object) => {
    const propNames = Reflect.ownKeys(object);
    for (const name of propNames) {
        const value = object[name];
        if (typeof value === "object" || typeof value === "function") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}

// private 
type SubFn<T> = (value: T) => void

interface Sub {
    id: symbol
    destroy(): void
}

class StateCore<T> {
    private subs: Record<symbol, SubFn<T>> = {}
    private inner: T
    private triger: any

    constructor(inner: T) {
        this.inner = deepFreeze(Object.assign({}, inner))
    }

    snap(): T {
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

// types
type State<T> = T & Statefull<T>
export interface Statefull<T> {
    [key: typeof Xstate]: StateCore<T>;
    snap(): T
    sub(fn: SubFn<T>): Sub
    set mut(v: Partial<T>)
}

// Builder
export interface StateBuilder<T> {
    value: T,
    actions?: {}
}

const propertyDescriptor: PropertyDescriptor = {
    configurable: false,
    enumerable: true,
};

export const newState = <T>(state: StateBuilder<T>) => {
    const core = new StateCore(state.value);

    let proxy: Statefull<T> = new Proxy(state.value as any, {
        getOwnPropertyDescriptor: (target, p) => propertyDescriptor,
        get(target, prop, receiver) {
            if (prop === 'sub') return core.subscribe.bind(core)
            if (prop === 'snap') return core.snap.bind(core)
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
    console.log("ok");
    return proxy as State<T>
}