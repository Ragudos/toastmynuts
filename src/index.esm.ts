import { Toaster } from "./toaster";
import { ToastConfig, ToastFunctions, ToastOptions } from "./types";

let functions: ToastFunctions | undefined;

/**
 * @description Used to initialize a toaster. There can only be one instance
 * of a toaster. Further calls to this function will return the same instance.
 *
 * @throws {Error} If maxVisibleToasts is < 1 or toastDuration is < 100ms
 */
export function initializeToast(config?: ToastConfig): ToastFunctions {
	if (functions) {
		return functions;
	}

	const toaster = Toaster.getInstance(config);

	function defaultToast(message: string, options?: ToastOptions): string {
		return toaster.addToast(message, "neutral", options);
	}

	function successToast(message: string, options?: ToastOptions): string {
		return toaster.addToast(message, "success", options);
	}

	function errorToast(message: string, options?: ToastOptions): string {
		return toaster.addToast(message, "error", options);
	}

	function warningToast(message: string, options?: ToastOptions): string {
		return toaster.addToast(message, "warning", options);
	}

	function infoToast(message: string, options?: ToastOptions): string {
		return toaster.addToast(message, "info", options);
	}

	functions = Object.assign(defaultToast, {
		setPosition: toaster.setPosition.bind(toaster),
		setIsStackable: toaster.setIsStackable.bind(toaster),
		remove: toaster.removeToast.bind(toaster),
		success: successToast,
		error: errorToast,
		warning: warningToast,
		info: infoToast,
		promise: toaster.addPromiseToast.bind(toaster),
	});

	return functions;
}
