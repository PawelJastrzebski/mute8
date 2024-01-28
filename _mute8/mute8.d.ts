export declare class StateCore<T> {
    private subs;
    private inner;
    private triger;
    constructor(inner: T);
    snap(): Readonly<T>;
    update(newState: Partial<T>): void;
    updateValue(key: any, value: any): void;
    notifySubs(): void;
    subscribe(fn: SubFn<T>): Sub;
}
export interface StateProxy<T> {
    snap(): T;
    sub(fn: SubFn<T>): Sub;
    set mut(v: Partial<T>);
}
export interface ProxyExtension<T> {
    get(core: StateCore<T>, prop: string | symbol): {
        value: any;
    } | null;
}
export declare const proxyBuilder: <T>(target: any, core: StateCore<T>, ext?: ProxyExtension<T>) => any;
export type State<T> = StateProxy<T> & T;
export type SubFn<T> = (value: Readonly<T>) => void;
export interface Sub {
    destroy(): void;
}
export interface StateBuilder<T> {
    value: T & object & {
        snap?: never;
        sub?: never;
        mut?: never;
    };
    actions?: {
        [key: string]: Function;
    };
}
export declare const newState: <T>(state: StateBuilder<T>) => State<T>;
