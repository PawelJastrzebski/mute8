import * as mute8 from "../mute8/mute8"
import { Store as StoreMute8, StoreDefiniton, ProxyExtension, SelectFn } from "../mute8/mute8"
import { useState, useEffect } from 'react';

interface ReactExtension<T> {
    use(): [T, (newValeu: Partial<T>) => void]
    useOne<K extends keyof T>(property: K): [T[K], (newValue: T[K]) => void]
    select<O>(fn: SelectFn<T, O>): O
}

export type Store<T, A, AA> = StoreMute8<T, A, AA> & {
    react: ReactExtension<T>
}

export const newStore = <T extends Object, A, AA>(store: StoreDefiniton<T, A, AA>) => {
    const extension: ProxyExtension<T, A, AA> = {
        name: "react",
        init(core) {
            return {
                use() {
                    const [value, setValue] = useState(core.s.sanp());
                    useEffect(() => {
                        const sub = core.s.sub((s) => setValue(s))
                        return () => sub.destroy()
                    }, [])

                    return [value, (v: any) => core.s.next(v)]
                },
                useOne(property: keyof T) {
                    const [value, setValue] = useState((core.s.sanp() as any)[property]);
                    useEffect(() => {
                        const sub = core.s.sub((s: any) => setValue(s[property]))
                        return () => sub.destroy()
                    }, [])
                    return [value, (v: any) => core.update(property, v)]
                },
                select<O>(fn: SelectFn<T, O>) {
                    const [value, setValue] = useState(fn(core.s.sanp()));
                    useEffect(() => {
                        const obs = core.s.select(fn)
                        obs.sub(v => setValue(v))
                        return () => obs.destroy()
                    }, [])
                    return value
                }
            }
        },
    }

    return mute8.newStoreProxy(store as any, extension) as Store<T, A, AA>
}

export { SubFn, VoidFn, AsyncFn, Sub, Plugin } from "../mute8/mute8"