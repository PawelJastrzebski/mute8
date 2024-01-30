import React from "react"
import ReactMute8Context, { ReactMute8ContextValue } from "../components/context"

export function createContextHook(context = ReactMute8Context) {
    return function useReduxContext(): ReactMute8ContextValue<any, any> {
        const contextValue = React.useContext(context)
        return contextValue!
    }
}

export const useContext = /*#__PURE__*/ createContextHook()