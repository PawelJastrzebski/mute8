import { Store as StoreMute8, StoreDefiniton, ProxyExtension, buildProxy, SelectFn } from "../mute8/mute8"
import { ref, onUnmounted, } from 'vue';

export type VueRef<T> = { readonly value: Readonly<T> } & Readonly<T>

interface VueExtension<T> {
    use(): VueRef<T>
    useOne<K extends keyof T>(property: K): VueRef<T[K]>
    select<O>(fn: SelectFn<T, O>): VueRef<O> 
}

export type Store<T, A, AA> = StoreMute8<T, A, AA> & {
    vue: VueExtension<T>
}

export const newStore = <T extends Object, A, AA>(store: StoreDefiniton<T, A, AA>) => {
    const extension: ProxyExtension<T, A, AA> = {
        name: "vue",
        init(core) {
            return {
                use() {
                    const val = ref(core.s.sanp())
                    const sub = core.s.sub(s => val.value = s as any)
                    onUnmounted(() => sub.destroy())
                    return val
                },
                useOne<K extends keyof T>(property: K & string) {
                    const val = ref((core.s.sanp() as any)[property])
                    const sub = core.s.sub(s => val.value = s[property] as any)
                    onUnmounted(() => sub.destroy())
                    return val
                },
                select<O>(fn: SelectFn<T, O>) {
                    const val = ref(fn(core.s.sanp()))
                    const obs = core.s.select(fn)
                    obs.sub(s => val.value = s as any)
                    onUnmounted(() => obs.destroy())
                    return val
                }
            }
        },
    }

    return buildProxy(store, extension) as Store<T, A, AA>
}

export { SubFn, VoidFn, AsyncFn, Sub, Plugin } from "../mute8/mute8"