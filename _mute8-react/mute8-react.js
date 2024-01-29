import * as mute8 from "../_mute8/mute8";
import { useState, useEffect } from 'react';
const proxyExtension = () => ({
    get(core, prop) {
        if (prop === 'use') {
            const use_fn = () => {
                const [value, setValue] = useState(core.snap());
                useEffect(() => {
                    const sub = core.subscribe((s) => setValue(s));
                    return () => sub.destroy();
                }, []);
                return [value, (v) => core.update(v)];
            };
            return {
                value: use_fn
            };
        }
        if (prop === 'useOne') {
            const use_fn = (property) => {
                const [value, setValue] = useState(core.snap()[property]);
                useEffect(() => {
                    const sub = core.subscribe((s) => setValue(s[property]));
                    return () => sub.destroy();
                }, []);
                return [value, (v) => core.updateValue(property, v)];
            };
            return {
                value: use_fn
            };
        }
        return null;
    }
});
export const newState = (state) => {
    const core = new mute8.StateCore(state.value, state.actions);
    const proxy = mute8.buildStateProxy(state.value, core, proxyExtension());
    return proxy;
};
