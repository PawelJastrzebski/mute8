import { Store as StoreMute8, StoreDefiniton, ProxyExtension, buildProxy, SelectFn } from "../mute8/mute8"
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
    const extension: ProxyExtension<T, A, AA> = {
        name: "solid",
        init(core) {
            return {
                use() {
                    const [value, setValue] = createSignal(core.s.sanp());
                    const sub = core.s.sub(s => setValue(s as any))
                    onCleanup(() => sub.destroy())
                    return [value, (v: any) => core.s.mut(v)]
                },
                useOne<K extends keyof T>(property: K & string) {
                    const [value, setValue] = createSignal((core.s.sanp() as any)[property]);
                    const sub = core.s.sub((s: any) => setValue(s[property]))
                    onCleanup(() => sub.destroy())
                    return [value, (v: any) => core.s.set(property, v)]
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

    return buildProxy(store, extension) as Store<T, A, AA>
}

export { SubFn, VoidFn, AsyncFn, Sub, Plugin } from "../mute8/mute8"