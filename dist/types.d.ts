import type { Toaster } from "./toaster";
/**
 * @default { "x": "middle", "y": "top" }
 */
export type ToastPosition = {
    x: "left" | "middle" | "right";
    y: "top" | "bottom";
};
/**
 * @global
 * @default "neutral"
 * What type of toast to display.
 */
export type ToastType = "neutral" | "info" | "success" | "warning" | "error" | "promise";
export type Directionality = "ltr" | "rtl" | "auto";
/**
 * The configuration when initializing this library.
 */
export type ToastConfig = {
    position?: ToastPosition;
    /**
     * The amount of toasts visible on the screen
     * when they are expanded. Excess toasts will be hidden.
     *
     * @default 3
     */
    maxVisibleToasts?: number;
    /**
     * Whether or not to close the toasts when swiped.
     * The swiping direction will be based on where the toast entered.
     *
     * @default true
     */
    closeOnSwipe?: boolean;
    /**
     * Whether or not toasts should stack on top of each other.
     * If set to false, toasts will never be stacked.
     *
     * @default true
     */
    stackable?: boolean;
    /**
     * Whether or not to add colors to the toasts based on their type
     */
    richColors?: boolean;
    /**
     * The theme of the toast.
     *
     * @default "system"
     */
    theme?: "dark" | "light" | "system";
    /**
     * The default duration of a toast in milliseconds.
     *
     * @default 10_000
     */
    toastDuration?: number;
    dir?: Directionality;
};
/**
 * The options when adding a toast.
 */
export type ToastOptions = {
    /**
     * Whether or not to close the toast when swiped.
     * The swiping direction will be based on where the toast entered.
     *
     * @default true
     */
    closeOnSwipe?: boolean;
    /**
     * Whether or not to use rich colors for the toasts.
     *
     * @default false
     */
    richColors?: boolean;
    /**
     * The theme of the toast.
     *
     * @default "system"
     */
    theme?: "dark" | "light" | "system";
    dir?: Directionality;
};
/**
 * The schema of the Toast object.
 */
export type Toast = {
    /**
     * A unique identifier for the toast.
     */
    _id: string;
    /**
     * The message displayed in the toast.
     */
    _message: string;
    /**
     * The lifetime duration of the toast before it gets removed.
     */
    _duration: number;
    /**
     * When the toast was created in milliseconds using ```Date.now()```.
     */
    _created_on: number;
    /**
     * When the toast's timeout was created in milliseconds using ```Date.now()```.
     * Used for removing and adding timeouts
     */
    _timeout_created_on: number | undefined;
    /**
     * The type of toast to display.
     */
    _type: ToastType;
    /**
     * An array of abort controllers for the toast.
     */
    _controllers: (AbortController | undefined)[];
    /**
      * The timeout id for the toast responsible for removing it when it reaches its lifetime duration.
      */
    _timeout: number | undefined;
};
export type ToastFunctions = ((message: string, options?: ToastOptions) => string) & {
    setPosition: (position: ToastPosition) => void;
    setIsStackable: (isStackable: boolean) => void;
    remove: (id: string) => void;
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string, options?: ToastOptions) => string;
    warning: (message: string, options?: ToastOptions) => string;
    info: (message: string, options?: ToastOptions) => string;
    promise: typeof Toaster.prototype.addPromiseToast;
};
