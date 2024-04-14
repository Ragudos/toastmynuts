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

function initializeToast() {
    const config = getConfig();
    const position = config.position;
}

initializeToast();

window.ToastMyNuts = Object.freeze({});
