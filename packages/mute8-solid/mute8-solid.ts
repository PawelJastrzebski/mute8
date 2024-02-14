import { Store as StoreMute8, StoreDefiniton, ProxyExtension, newStoreProxy, SelectFn } from "../mute8/mute8"
import { createSignal, Accessor, onCleanup, } from 'solid-js';

interface SolidExtension<T> {
    use(): [Accessor<T>, (newValeu: Partial<T>) => void]
    useOne<K extends keyof T>(property: K): [Accessor<T[K]>, (newValue: T[K]) => void]
    select<O>(fn: SelectFn<T, O>): Accessor<O>
}

export type Store<T, A, AA> = StoreMute8<T, A, AA> & {
    solid: SolidExtension<T>
}

export const newStore = <T extends Object, A, AA>(store: StoreDefiniton<T, A, AA>) => {
    const reactExtension: ProxyExtension<T, A, AA> = {
        name: "solid",
        init(core) {
            return {
                use() {
                    const [value, setValue] = createSignal(core.s.sanp());
                    const sub = core.s.sub(s => setValue(s as any))
                    onCleanup(() => sub.destroy())
                    return [value, (v: any) => core.s.next(v)]
                },
                useOne(property: keyof T) {
                    const [value, setValue] = createSignal((core.s.sanp() as any)[property]);
                    const sub = core.s.sub((s: any) => setValue(s[property]))
                    onCleanup(() => sub.destroy())
                    return [value, (v: any) => core.update(property, v)]
                },
                select<O>(fn: SelectFn<T, O>) {
                    const [value, setValue] = createSignal(fn(core.s.sanp()));
                    const obs = core.s.select(fn)
                    obs.sub(s => setValue(s as any))
                    onCleanup(() => obs.destroy())
                    return value
                }
            }
        },
    }

    return newStoreProxy(store as any, reactExtension) as Store<T, A, AA>
}

export { SubFn, VoidFn, AsyncFn, Sub, Plugin } from "../mute8/mute8"