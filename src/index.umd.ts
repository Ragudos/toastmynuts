import { Toaster } from "./toaster";
import { ToastConfig, ToastFunctions, ToastOptions } from "./types";

declare global {
	interface Window {
		ToastMyNuts: Readonly<ToastFunctions>;
	}
}

/**
 * This is used internally and is not available as an external function.
 * Gets the config from
 *
 * ```html
 * <meta name="toastmynuts-config" content="{}">
 * ```
 */
function getConfig(): ToastConfig | undefined {
	const metaTag = document.querySelector("meta[name='toastmynuts:config']");

	if (!metaTag) {
		return undefined;
	}

	const rawConfig = metaTag.getAttribute("content");

	if (rawConfig) {
		const parsedConfig = JSON.parse(rawConfig);

		return parsedConfig;
	}

	return undefined;
}

const config = getConfig();
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

window.ToastMyNuts = Object.freeze(Object.assign(defaultToast, {
		setPosition: toaster.setPosition.bind(toaster),
		setIsStackable: toaster.setIsStackable.bind(toaster),
		remove: toaster.removeToast.bind(toaster),
		success: successToast,
		error: errorToast,
		warning: warningToast,
		info: infoToast,
		promise: toaster.addPromiseToast.bind(toaster),
	})
);
