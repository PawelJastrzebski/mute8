import { Store as Mute8Store, StateDefiniton, ProxyExtension, createStore as _createStore } from "../mute8/mute8"
import { useState, useCallback, useEffect } from 'react';
import Provider from './components/provider'
import ReactMute8Context, { ReactMute8ContextValue } from "./components/context";

export type Store<T, A> = Mute8Store<T, A> & {
    use(): [T, (newValeu: Partial<T>) => void]
    useOne<K extends keyof T>(property: K): [T[K], (newValue: T[K]) => void]
    useStateContext(): T;
    useSelector<Selected extends unknown>(selector: (state: T) => Selected): Selected
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

        if (prop === 'useSelector') {
            const use_fn = <T, A>(
                selector: (state: Readonly<T>) => A
            ) => {

                if (!selector) {
                    throw new Error('Selector is required')
                }

                if (typeof selector !== 'function') {
                    throw new Error('Selector must be a function')
                }

                return selector(core.snap() as any)
            };

            return {
                value: use_fn
            }
        }

        return null;
    }
})

export const createStore = <T extends Object, A>(state: StateDefiniton<T, A>) => _createStore(state, [proxyExtension()]) as Store<T, A>;

export { SubFn, VoidFn, Sub } from "../mute8/mute8"
export { Provider, ReactMute8Context, ReactMute8ContextValue }