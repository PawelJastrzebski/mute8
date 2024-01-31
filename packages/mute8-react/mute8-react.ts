import * as mute8 from "../mute8/mute8"
import { Store as StoreMute8, StoreDefiniton, ProxyExtension } from "../mute8/mute8"
import { useState, useEffect } from 'react';

export type Store<T, A> = StoreMute8<T, A> & {
    use(): [T, (newValeu: Partial<T>) => void]
    useOne<K extends keyof T>(property: K): [T[K], (newValue: T[K]) => void]
}

const proxyExtension: <T, A>() => ProxyExtension<T, A> = <T>() =>
({
    get(core, prop) {
        if (prop === 'use') {
            const use_fn = () => {
                const [value, setValue] = useState(core.snap());
                useEffect(() => {
                    const sub = core.sub((s) => setValue(s))
                    return () => sub.destroy()
                }, [])

                return [value, (v: any) => core.update(v)]
            };

            return {
                value: use_fn
            }
        }

        if (prop === 'useOne') {
            const use_fn = (property: keyof T) => {
                const [value, setValue] = useState((core.snap() as any)[property]);
                useEffect(() => {
                    const sub = core.sub((s: any) => setValue(s[property]))
                    return () => sub.destroy()
                }, [])
                return [value, (v: any) => core.updateValue(property, v)]
            };

            return {
                value: use_fn
            }
        }

        return null;
    }
})

export const newStore = <T extends Object, A>(state: StoreDefiniton<T, A>) => {
    const core = new mute8.StateCore(state.value, state.actions);
    const proxy = mute8.newStoreProxy(state.value as any, core, proxyExtension())
    return proxy as Store<T, A>
}

export { SubFn, VoidFn, Sub } from "../mute8/mute8"