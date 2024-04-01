declare type SemaphoreResult<T> = T extends undefined ? boolean : T;
export declare class Semaphore<T = void> {
    #private;
    wait(timeout?: number): Promise<SemaphoreResult<T>>;
    notify(value?: T): void;
    notifyAll(value?: T): void;
}
export {};
