//@ts-check
import { TOAST_CONTAINER_ID, Toaster } from "./toaster";

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
    const metaTag = document.querySelector("meta[name=\"toastmynuts:config\"]");

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

/**
 * @type {ToastPosition}
 */
const position = config?.position ? config.position : { x: "middle", y: "top" };

const toastContainer = document.createElement("ol");
toastContainer.id = TOAST_CONTAINER_ID;
toastContainer.setAttribute("aria-label", "Notifications (Alt + T");
toastContainer.setAttribute("data-position-x", position.x);
toastContainer.setAttribute("data-position-y", position.y);

document.body.appendChild(toastContainer);

const toast = Toaster.getInstance(config);

// @ts-ignore
window.ToastMyNuts = Object.freeze({
    /**
     * @param {string} message
     * @param {ToastType} [type]
     */
    create: (message, type) => {
        if (config && config.ignoreErrors) {
            try {
                toast.addToast(message, type);
            } catch (error) {
                console.error(error);
            }
        } else {
            toast.addToast(message, type);
        }
    },
    /**
     * @param {number} toastIdx
     */
    remove: (toastIdx) => {
        if (config && config.ignoreErrors) {
            try {
                toast.removeToast(toastIdx);
            } catch (error) {
                console.error(error);
            }
        } else {
            toast.removeToast(toastIdx);
        }
    }
});
