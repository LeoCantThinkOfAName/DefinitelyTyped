import RouteInfo from './route-info';

export default interface Transition<T = any> extends Partial<Promise<T>> {
    /**
     * Custom state can be stored on a Transition's `data` object.
     * This can be useful for decorating a Transition within an earlier hook and shared with a later hook.
     * Properties set on `data` will be copied to new transitions generated by calling `retry` on this transition.
     */
    data: Record<string, unknown>;
    /**
     * This property is a `RouteInfo` object that represents where transition originated from.
     * It's important to note that a `RouteInfo` is a linked list and this property is simply the head node of the list.
     * In the case of an initial render, `from` will be set to `null`.
     */
    readonly from: RouteInfo | null;
    /**
     * The Transition's internal promise.
     * Calling `.then` on this property is that same as calling `.then` on the Transition object itself,
     * but this property is exposed for when you want to pass around a Transition's promise,
     * but not the Transition object itself, since Transition object can be externally `abort`ed,
     * while the promise cannot.
     */
    readonly promise: Promise<T>;
    /**
     * This property is a `RouteInfo` object that represents where the router is transitioning to.
     * It's important to note that a `RouteInfo` is a linked list and this property is simply the leafmost route.
     */
    readonly to: RouteInfo;
    /**
     * Aborts the Transition. Note you can also implicitly abort a transition
     * by initiating another transition while a previous one is underway.
     */
    abort(): Transition<T>;
    /**
     * Forwards to the internal `promise` property which you can use in situations where you want to pass around a thennable,
     * but not the Transition itself.
     *
     * @param onRejection
     * @param label optional string for labeling the promise. Useful for tooling.
     */
    catch<TResult = never>(
        onRejected?: ((reason: any) => TResult | PromiseLike<TResult>),
        label?: string,
    ): Promise<TResult>;
    /**
     * Forwards to the internal `promise` property which you can use in situations where you want to pass around a thennable,
     * but not the Transition itself.
     *
     * @param onFinally
     * @param label optional string for labeling the promise. Useful for tooling.
     */
    finally(onFinally?: (() => void), label?: string): Promise<T>;
    /**
     * Transitions are aborted and their promises rejected when redirects occur;
     * this method returns a promise that will follow any redirects that occur and
     * fulfill with the value fulfilled by any redirecting transitions that occur.
     *
     * @return a promise that fulfills with the same value that the final redirecting transition fulfills with
     */
    followRedirects(): Promise<T>;
    /**
     * Sets the URL-changing method to be employed at the end of a successful transition.
     * By default, a new Transition will just use `updateURL`,
     * but passing 'replace' to this method will cause the URL to update using 'replaceWith' instead.
     * Omitting a parameter will disable the URL change,
     * allowing for transitions that don't update the URL at completion
     * (this is also used for handleURL, since the URL has already changed before the transition took place).
     *
     * @param  method the type of URL-changing method to use at the end of a transition. Accepted values are 'replace',
     *                falsy values, or any other non-falsy value (which is interpreted as an updateURL transition).
     * @return        This transition
     */
    method(method?: string): Transition<T>;
    /**
     * Retries a previously-aborted transition (making sure to abort the
     * transition if it's still active). Returns a new transition that
     * represents the new attempt to transition.
     */
    retry(): Transition<T>;
    /**
     * A standard promise hook that resolves if the transition succeeds and rejects if it fails/redirects/aborts.
     *
     * Forwards to the internal `promise` property which you can use in situations where you want to pass around a thennable,
     * but not the Transition itself.
     *
     * @param  onFulfilled
     * @param  onRejected
     * @param  label label optional string for labeling the promise. Useful for tooling.
     */
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>),
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>),
        label?: string,
    ): Promise<TResult1 | TResult2>;
    /**
     * Fires an event on the current list of resolved/resolving handlers within this transition.
     * Useful for firing events on route hierarchies that haven't fully been entered yet.
     *
     * @param  ignoreFailure a boolean specifying whether unhandled events throw an error
     * @param  name          the name of the event to fire
     */
    send(ignoreFailure: boolean, name: string): void;
    /**
     * Fires an event on the current list of resolved/resolving handlers within this transition.
     * Useful for firing events on route hierarchies that haven't fully been entered yet.
     * Note: This method is also aliased as `send`
     *
     * @alias send
     *
     * @param  ignoreFailure a boolean specifying whether unhandled events throw an error
     * @param  name          the name of the event to fire
     */
    trigger(ignoreFailure: boolean, name: string): void;
}
