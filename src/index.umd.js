//@ts-check
import { Toaster } from "./toaster";

/**
 * This is used internally and is not available as an external function.
 * Gets the config from
 *
 * ```html
 * <meta name="toastmynuts-config" content="{}">
 * ```
 *
 * A config object is a JSON object that contains the following properties:
 * - {@link ToastPosition} `position` - The position of the toasts.
 *
 * @returns {ToastConfig | undefined} The config object.
 */
function getConfig() {
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
const toast = Toaster.getInstance(config);

/**
 * @param {string} message
 * @param {ToastType} [type]
 */
function create(message, type) {
    if (config && config.ignoreErrors) {
        try {
            toast.addToast(message, type);
        } catch (error) {
            console.error(error);
        }
    } else {
        toast.addToast(message, type);
    }
}

/**
 * @param {string} toastId
 */
function remove(toastId) {
    if (config && config.ignoreErrors) {
        try {
            toast.removeToast(toastId);
        } catch (error) {}
    } else {
        toast.removeToast(toastId);
    }
}

// @ts-ignore
window.ToastMyNuts = Object.freeze({
    create,
    remove
});
