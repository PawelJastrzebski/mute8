import type { Context } from 'react'
import { createContext } from 'react'
import type { Store } from '../../mute8/mute8'

export interface ReactMute8ContextValue<T extends Object, A = any> {
    store: Store<T, A>
}

const ContextKey = Symbol.for(`react-mute8-context`)
const _getContext: { [ContextKey]?: Map<typeof createContext, Context<ReactMute8ContextValue<any, any> | null>> } = (typeof globalThis !== 'undefined' ? globalThis : {}) as any

function getContext<T, A>(): Context<ReactMute8ContextValue<T, A> | null> {
    if (!createContext) return {} as any

    const contextMap = (_getContext[ContextKey] ??= new Map<typeof createContext, Context<ReactMute8ContextValue<any, any> | null>>())
    let realContext = contextMap.get(createContext)
    if (!realContext) {
        realContext = createContext<ReactMute8ContextValue<any, any> | null>(null as any)
        if (process.env.NODE_ENV !== 'production') {
            realContext.displayName = 'ReactRedux'
        }
        contextMap.set(createContext, realContext)
    }
    return realContext
}

export const ReactMute8Context = /*#__PURE__*/ getContext()

export type ReactMute8ContextInstance = typeof ReactMute8Context

export default ReactMute8Context