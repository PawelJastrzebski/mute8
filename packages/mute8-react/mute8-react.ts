import * as mute8 from "../mute8/mute8"
import { Store as StoreMute8, StoreDefiniton, ProxyExtension } from "../mute8/mute8"
import { useState, useEffect } from 'react';

interface ReactExtension<T> {
    use(): [T, (newValeu: Partial<T>) => void]
    useOne<K extends keyof T>(property: K): [T[K], (newValue: T[K]) => void]
}

export type Store<T, A> = StoreMute8<T, A> & {
    react: ReactExtension<T>
}

export const newStore = <T extends Object, A>(store: StoreDefiniton<T, A>) => {
    const reactExtension:  ProxyExtension<T, A> = {
        name: "react",
        init(core) {
            return {
                use() {
                    const [value, setValue] = useState(core.snap());
                    useEffect(() => {
                        const sub = core.sub((s) => setValue(s))
                        return () => sub.destroy()
                    }, [])
        
                    return [value, (v: any) => core.update(v)]
                },
                useOne(property: keyof T) {
                    const [value, setValue] = useState((core.snap() as any)[property]);
                    useEffect(() => {
                        const sub = core.sub((s: any) => setValue(s[property]))
                        return () => sub.destroy()
                    }, [])
                    return [value, (v: any) => core.updateValue(property, v)]
                }
            }
        },
    }

    return mute8.newStoreProxy(store as any, reactExtension) as Store<T, A>
}

export { SubFn, VoidFn, Sub } from "../mute8/mute8"