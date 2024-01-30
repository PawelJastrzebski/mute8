import React, { useCallback } from "react";
import type { ReactMute8ContextValue } from "../components/context";
import { ReactMute8Context } from '../components/context'
import { createContextHook, useContext as useDefaultContext } from './useContext'

export function createSelectorHook(
    context: React.Context<ReactMute8ContextValue<
        any,
        any
    > | null> = ReactMute8Context,
) {
    const useReduxContext = context === ReactMute8Context ? useDefaultContext : createContextHook(context)

    const a = useReduxContext()

    // const use_fn = <T, A>(
    //     selector: (state: T) => A
    // ) => {

    //     if (!selector) {
    //         throw new Error('Selector is required')
    //     }

    //     if (typeof selector !== 'function') {
    //         throw new Error('Selector must be a function')
    //     }

    //     const newSelector = useCallback({
    //         [selector.name](state: T) {
    //             return selector(state)
    //         }
    //     }[selector.name], [selector]);
    //     return newSelector(core.snap() as any);
    // };
}

export const useSelector = /*#__PURE__*/ createSelectorHook()