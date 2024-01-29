export declare class StateCore<T, A> {
    private subs;
    private inner;
    private triger;
    readonly actionsProxy: any;
    readonly actions: A;
    constructor(inner: T, actions: A);
    snap(): Readonly<T>;
    update(newState: Partial<T>): void;
    updateValue(key: any, value: any): void;
    notifySubs(): void;
    subscribe(fn: SubFn<T>): Sub;
}
export interface StateProxy<T, A> {
    snap(): T;
    sub(fn: SubFn<T>): Sub;
    set mut(v: Partial<T>);
    actions: A;
}
export interface ProxyExtension<T, A> {
    get(core: StateCore<T, A>, prop: string | symbol): {
        value: any;
    } | null;
}
export declare const buildStateProxy: <T, A>(target: any, core: StateCore<T, A>, ext?: ProxyExtension<T, A>) => any;
export type State<T, A> = StateProxy<T, A> & T;
export type SubFn<T> = (value: Readonly<T>) => void;
export interface Sub {
    destroy(): void;
}
export type VoidFn = ((...args: any) => Promise<void>);
export interface StateBuilder<T, A> {
    value: T & object & {
        actions?: never;
        snap?: never;
        sub?: never;
        mut?: never;
    };
    actions?: A & ThisType<T & Readonly<A>> & {
        [key: string]: VoidFn;
    };
}
export declare const newState: <T, A>(state: StateBuilder<T, A>) => State<T, A>;
