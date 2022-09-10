declare type When<T> = {
    is: <R>(prediction: (v: T) => boolean, producer: () => R) => Chain<T, R>;
};
declare type Chain<T, R> = {
    is: (prediction: (v: T) => boolean, producer: () => R) => Chain<T, R>;
    default: (producer: () => R) => R;
};
export declare const when: <T>(value: T) => When<T>;
export {};
