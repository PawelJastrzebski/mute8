import * as mute8 from "../_mute8/mute8";
import { State as mute8State, StateBuilder } from "../_mute8/mute8";
export type State<T, A> = mute8State<T, A> & {
    use(): [T, (newValeu: Partial<T>) => void];
    useOne<K extends keyof T>(property: K): [T[K], (newValue: T[K]) => void];
};
export declare const newState: <T extends Object, A>(state: mute8.StateBuilder<T, A>) => State<T, A>;
