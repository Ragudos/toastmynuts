import { ToastConfig, ToastFunctions } from "./types";
/**
 * @description Used to initialize a toaster. There can only be one instance
 * of a toaster. Further calls to this function will return the same instance.
 *
 * @throws {Error} If maxVisibleToasts is < 1 or toastDuration is < 100ms
 */
export declare function initializeToast(config?: ToastConfig): ToastFunctions;
