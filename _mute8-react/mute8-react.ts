import * as mute8 from "../_mute8/mute8"
import { State as mute8State, StateBuilder, ProxyExtension } from "../_mute8/mute8"
import { useState, useEffect } from 'react';


export type State<T> = mute8State<T> & {
    use(): [T, (newValeu: Partial<T>) => void]
    useOne<K extends keyof T>(property: K): [T[K], (newValue: T[K]) => void]
}

const proxyExtension: <T>() => ProxyExtension<T> = <T>() =>
({
    get(core, prop) {
        if (prop === 'use') {
            const use_fn = () => {
                const [value, setValue] = useState(core.snap());
                useEffect(() => {
                    const sub = core.subscribe((s) => setValue(s))
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
                    const sub = core.subscribe((s: any) => setValue(s[property]))
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

export const newState = <T extends Object>(state: StateBuilder<T>) => {
    const core = new mute8.StateCore(state.value);
    const proxy = mute8.proxyBuilder(state.value as any, core, proxyExtension())
    return proxy as State<T>
}