import type { Directionality, ToastConfig, ToastOptions, ToastPosition, ToastType } from "./types";
export declare const TOAST_DEFAULT_DURATION = 10000;
export declare const TOAST_CONTAINER_ID = "__toastmynuts__";
export declare const TOAST_WRAPPER_ID = "__toastmynuts__wrapper";
export declare const TOAST_CLASS = "__toastmynuts__toast";
export declare const TOAST_MESSAGE_CLASS = "__toastmynuts__message";
export declare const TOAST_CLOSE_BTN_CLASS = "__toastmynuts__close-btn";
export declare const TOAST_TYPE_ATTR_NAME = "data-toast-type";
export declare const TOAST_DEFAULT_POSITION: {
    x: string;
    y: string;
};
export declare const TOAST_MAX_VISIBLE_TOASTS = 3;
export declare const TOAST_TYPE_ICONS: {
    [key in ToastType]: string;
};
export declare function genRandomId(): string;
export declare function getDir(): Directionality;
/**
 * There should only be one instance of a
 * Toaster and this is not available externally.
 */
export declare class Toaster {
    private static _instance;
    private static _toastDuration;
    private static _config;
    /**
     * We store the directionality of the document
     * if it's not specified in the config
     * so we don't repeatedly call getComputedStyle
     */
    private static _defaultDir;
    private _toasts;
    /**
     * To avoid a race condition for moving toasts upwards when removing a toast,
     * where in the loop, they'd have the same reference to the toast array before the
     * previous toasts were removed (they are still in an exit animation and yet to be removed),
     * we add them to a toBeRemovedArray so we can remove them from the main toast array
     */
    private _toastToBeRemoved;
    private _toastContainerAbortControllers;
    private constructor();
    /**
     * @throws {Error} If maxVisibleToasts is < 1 or toastDuration is < 100ms
     */
    static getInstance(config?: ToastConfig): Toaster;
    /**
     * @param param The position of the toast container
     *
     * @description Sets the position of the toast container,
     * which in turn changes the position of the toasts.
     */
    setPosition({ x, y }: ToastPosition): void;
    /**
     * @param isStackable
     *
     * @description Whether or not to stack toasts. Take note
     * that this will only take into effect if all toasts are empty,
     * since we are attaching listeners to the supposed toast container which
     * is created when the first toast is added.
     */
    setIsStackable(isStackable: boolean): void;
    /**
     * @throws {[string, K]} If the promise fails,
     * the promise toast will be updated to an error toast.
     */
    addPromiseToast<T, K>(loadingMessage: string, successMessageStringOrCb: string | ((data: T | undefined) => string), errorMessageStringOrCb: string | ((err: K) => string), asyncOperation: Promise<T> | (() => Promise<T>), options?: ToastOptions): Promise<[string, T]>;
    addToast(message: string, type?: ToastType, options?: ToastOptions): string;
    removeToast(toastId: string): void;
    /**
     * Whether our toast did not have an exit animation
     */
    private _removeToastPermanently;
    /**
     * Removes all timeouts in the toasts array
     * and for each toast, changed their duration to
     * the remaining time before they get removed.
     * Used when expanding a stacked toast.
     */
    private _removeTimeoutOfToasts;
    /**
     * Adds all timeouts in the toasts array.
     * Used when stacking an expanded stacked toast.
     */
    private _addTimeoutToToasts;
    /**
     * @param toastIdx The starting point from where we move the z indices of its sibling toasts.
     */
    private _changeToastsZindex;
    /**
     * Used when a toast is removed
     */
    private _moveToastsUp;
    /**
     * Used when a new toast is added
     */
    private _moveToastsDown;
    private _getOrCreateToastContainer;
    private _createMessageElement;
    private _createToastElement;
    /**
     * Only call this once on a toast element.
     */
    private _attachSwipeListenersToToast;
    private _createCloseBtn;
}
