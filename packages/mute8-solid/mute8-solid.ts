import { Store as StoreMute8, StoreDefiniton, ProxyExtension, newStoreProxy } from "../mute8/mute8"
import { createSignal, Accessor, onCleanup, } from 'solid-js';

interface SolidExtension<T> {
    use(): [Accessor<T>, (newValeu: Partial<T>) => void]
    useOne<K extends keyof T>(property: K): [Accessor<T[K]>, (newValue: T[K]) => void]
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
                    const [value, setValue] = createSignal(core.s());
                    const sub = core.sub(s => setValue(s as any))
                    onCleanup(() => sub.destroy())
                    return [value, (v: any) => core.u(v)]
                },
                useOne(property: keyof T) {
                    const [value, setValue] = createSignal((core.s() as any)[property]);
                    const sub = core.sub((s: any) => setValue(s[property]))
                    onCleanup(() => sub.destroy())
                    return [value, (v: any) => core.uv(property, v)]
                }
            }
        },
    }

    return newStoreProxy(store as any, reactExtension) as Store<T, A, AA>
}

export { SubFn, VoidFn, AsyncFn, Sub, Plugin } from "../mute8/mute8"