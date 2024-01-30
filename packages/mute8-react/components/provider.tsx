import React, { useMemo, useLayoutEffect, useEffect } from 'react';
import { Store } from './../mute8-react';
import ReactMute8Context from './context';

export interface ProviderProps<T, A> {
  children: React.ReactNode
  store: Store<T, A>
}

export const isClientSide = !!(
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
)

export const useProviderLayoutEffect = isClientSide ? useLayoutEffect : useEffect

function Provider<T extends Object, A>({
  store,
  children,
}: ProviderProps<T, A>) {
  const contextValue = useMemo(() => {
    return {
      store,
    }
  }, [store])

  const previousState = useMemo(() => store.snap(), [store])

  useProviderLayoutEffect(() => {
    // const { subscription } = contextValue
    // subscription.onStateChange = subscription.notifyNestedSubs
    // subscription.trySubscribe()

    // if (previousState !== store.getState()) {
    //   subscription.notifyNestedSubs()
    // }
    // return () => {
    //   subscription.tryUnsubscribe()
    //   subscription.onStateChange = undefined
    // }
  }, [contextValue, previousState])

  const Context = ReactMute8Context

  // @ts-ignore 'AnyAction' is assignable to the constraint of type 'A', but 'A' could be instantiated with a different subtype
  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
}

export default Provider