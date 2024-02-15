import { Store as StoreMute8, StoreDefiniton, ProxyExtension, newStoreProxy, SelectFn } from "../mute8/mute8"
import { signal, computed, effect, WritableSignal, Signal } from '@angular/core';

interface AngularExtension<T> {
    use(): WritableSignal<T>
    useOne<K extends keyof T>(property: K): WritableSignal<T[K]>
    select<O>(fn: SelectFn<T, O>): Signal<O>
}

export type Store<T, A, AA> = StoreMute8<T, A, AA> & {
    angular: AngularExtension<T>
}

export const newStore = <T extends Object, A, AA>(store: StoreDefiniton<T, A, AA>) => {
    const options = { allowSignalWrites: true };
    const extension: ProxyExtension<T, A, AA> = {
        name: "angular",
        init(core) {
            return {
                use() {
                    const sig = signal(core.s.sanp());
                    effect(onCleanup => {
                        const sub = core.s.sub(s => sig.set(s))
                        onCleanup(() => sub.destroy())
                    }, options)
                    computed(() => core.s.next(sig()))
                    return sig
                },
                useOne(property: keyof T) {
                    const sig = signal((core.s.sanp() as any)[property]);
                    effect(onCleanup => {
                        const sub = core.s.sub(s => sig.set(s[property]))
                        onCleanup(() => sub.destroy())
                    }, options)
                    computed(() => core.update(property, sig()))
                    return sig
                },
                select<O>(fn: SelectFn<T, O>) {
                    const sig = signal(fn(core.s.sanp()));
                    effect(onCleanup => {
                        const obs = core.s.select(fn)
                        obs.sub(v => sig.set(v))
                        onCleanup(() => obs.destroy())
                    }, options)
                    return sig.asReadonly()
                }
            }
        },
    }

    return newStoreProxy(store as any, extension) as Store<T, A, AA>
}

export { SubFn, VoidFn, AsyncFn, Sub, Plugin } from "../mute8/mute8"