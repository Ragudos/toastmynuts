// @ts-check

export const TOAST_DURATION = 60_000;
export const TOAST_CONTAINER_ID = "__toastmynuts__";
export const TOAST_CLASS = "__toastmynuts__toast";
export const TOAST_MESSAGE_CLASS = "__toastmynuts__message";
export const TOAST_CLOSE_BTN_CLASS = "__toastmynuts__close-btn";
export const TOAST_DEFAULT_POSITION = { x: "middle", y: "top" };
export const TOAST_MAX_VISIBLE_TOASTS = 3;

export function genRandomId() {
    return Math.random().toString(16).slice(2);
}

/**
 * There should only be one instance of a
 * Toaster and this is not available externally.
 */
export class Toaster {
    /**
     * @private
     * @type {Toaster}
     */
    static _instance;

    /**
     * @private
     * @type {Toast[]}
     */
    _toasts;
    /**
     * @private
     * @type {ToastConfig | undefined}
     */
    static _config;

    /**
     * @private
     */
    constructor() {
        this._toasts = [];
    }

    /**
     * @returns {Toaster}
     * @param {ToastConfig | undefined} config
     */
    static getInstance(config) {
        if (!Toaster._instance) {
            Toaster._instance = new Toaster();
            Toaster._config = config;
        }

        return Toaster._instance;
    }

    /**
     * @param {string} message
     * @param {ToastType} [type]
     */
    async addToast(message, type = "neutral") {
        const toastContainer = this._getOrCreateToastContainer();
        const toastId = genRandomId();
        const [
            closeBtn,
            closeBtnAbortController
        ] = this._createCloseBtn(toastId);
        const toastElement = this._createToastElement(toastId, type);
        const messageElement = this._createMessageElement(message);
        const timeout = setTimeout(() => {
            if (Toaster._config && Toaster._config.ignoreErrors) {
                try {
                    this.removeToast(toastId);
                } catch (_err) {}
            } else {
                this.removeToast(toastId);
            }
        }, TOAST_DURATION);

        toastElement.appendChild(messageElement);
        toastElement.appendChild(closeBtn);
        toastContainer.prepend(toastElement);

        const originalHeight = toastElement.style.height;

        toastElement.style.height = "auto";

        const packedHeight = toastElement.getBoundingClientRect().height;

        toastElement.style.height = originalHeight;
        toastElement.style.setProperty("--_initial-height", `${packedHeight}px`);
        this._moveToastsDown(packedHeight);
        toastElement.removeAttribute("data-toast-state");

        this._toasts.push({
            _message: message,
            _type: type,
            _controllers: [closeBtnAbortController],
            _timeout: timeout,
            _duration: TOAST_DURATION,
            _id: toastId,
        });

        return toastId;
    }

    /**
     * @param {string} toastId
     */
    removeToast(toastId) {
        /**
         * @type {Toast | undefined}
         */
        let toast;
        /**
         * @type {number | undefined}
         */
        let toastIdx;

        for (let i = 0; i < this._toasts.length; ++i) {
            if (this._toasts[i]._id === toastId) {
                toast = this._toasts[i];
                toastIdx = i;
            }
        }

        if (!toast || toastIdx === undefined) {
            throw new Error("[ToastMyNuts] Could not find toast with ID " + toastId + " virtually");
        }

        /**
         * @type {HTMLElement | null}
         */
        const toastElement = document.getElementById(toast._id);

        if (!toastElement) {
            throw new Error("[ToastMyNuts] Could not find toast with ID " + toastId + " in the DOM");
        }

        const isExiting = toastElement.getAttribute("data-toast-state") === "closing";

        if (isExiting) {
            return;
        }

        toastElement.setAttribute("data-toast-state", "closing");

        while (toast._controllers.length !== 0) {
            toast._controllers.pop()?.abort();
        }

        const toastElementTransitionDuration = parseFloat(getComputedStyle(toastElement).transitionDuration);
        this._moveToastsUp(toastIdx);

        setTimeout(() => {
            // The toast idx might change already when this timeout is called,
            // so we find it again.

            /**
             * @type {Toast | undefined}
             */
            let toast;
            /**
             * @type {number | undefined}
             */
            let toastIdx;

            for (let i = 0; i < this._toasts.length; ++i) {
                if (this._toasts[i]._id === toastId) {
                    toast = this._toasts[i];
                    toastIdx = i;
                }
            }

            if (!toast || toastIdx === undefined) {
                throw new Error("[ToastMyNuts] Could not find toast with ID " + toastId + " virtually");
            }

            const toastElement = document.getElementById(toast._id);

            if (!toastElement) {
                throw new Error("[ToastMyNuts] Could not find toast with ID " + toast._id + " in the DOM");
            }

            if (toast._timeout) {
                clearTimeout(toast._timeout);
            }

            toastElement.remove();
            this._toasts.splice(toastIdx, 1);

            if (this._toasts.length === 0) {
                const toastContainer = document.getElementById(TOAST_CONTAINER_ID);

                toastContainer?.remove();
            }

            for (let i = toastIdx; i < this._toasts.length; ++i) {
                const toast = this._toasts[i];
                /**
                 * @type {HTMLElement | null}
                 */
                const toastElement = document.getElementById(toast._id);

                if (!toastElement) {
                    throw new Error("[ToastMyNuts] Could not find toast with ID " + toast._id + " in the DOM");
                }

                toastElement.style.setProperty("--_z-idx", i.toString());
            }
        }, toastElementTransitionDuration * 1000);
    }

    /**
     * @private
     * @param {number} start
     * Used when a toast is removed
     */
    _moveToastsUp(start) {
        const maxVisibleToasts = Toaster._config?.maxVisibleToasts ?? TOAST_MAX_VISIBLE_TOASTS;

        for (let i = 0; i < start; ++i) {
            const toast = this._toasts[i];

            if (!toast) {
                throw new Error("[ToastMyNuts] Could not find toast with index " + i + " virtually");
            }

            /**
             * @type {HTMLElement | null}
             */
            const toastElement = document.getElementById(toast._id);

            if (!toastElement) {
                throw new Error("[ToastMyNuts] Could not find toast with ID " + toast._id + " in the DOM");
            }

            let heightOffset = 0;

            // Don't include the height of the toast that will be moved
            for (let j = i + 1; j < this._toasts.length; ++j) {
                // Don't include the height of the toast that is being removed
                if (j === start) {
                    continue;
                }

                const toast = this._toasts[j];

                /**
                 * @type {HTMLElement | null}
                 */
                const toastElement = document.getElementById(toast._id);

                if (!toastElement) {
                    throw new Error("[ToastMyNuts] Could not find toast with ID " + toast._id + " in the DOM");
                }

                const initialHeight = parseFloat(toastElement.style.getPropertyValue("--_initial-height"));

                heightOffset += initialHeight;
            }

            toastElement.style.setProperty("--_height-offset", `${heightOffset}px`);
            // -2 because we need to account for the toast that will be removed.
            toastElement.style.setProperty("--_idx", (this._toasts.length - i - 2).toString());

            if (this._toasts.length - i <= maxVisibleToasts + 1) {
                toastElement.removeAttribute("data-toast-state");
            }
        }
    }

    /**
     * @private
     * @param {number} baseHeightOffset
     * Used when a new toast is added
     */
    _moveToastsDown(baseHeightOffset) {
        const maxVisibleToasts = Toaster._config?.maxVisibleToasts ?? TOAST_MAX_VISIBLE_TOASTS;

        for (let i = 0; i < this._toasts.length; ++i) {
            const toast = this._toasts[i];
            const toastElement = document.getElementById(toast._id);

            if (!toastElement) {
                throw new Error("[ToastMyNuts] Could not find toast with ID " + toast._id);
            }

            let heightOffset = baseHeightOffset;

            for (let j = i + 1; j < this._toasts.length; ++j) {
                const toast = this._toasts[j];
                const toastElement = document.getElementById(toast._id);

                if (!toastElement) {
                    throw new Error("[ToastMyNuts] Could not find toast with ID " + toast._id);
                }

                let initialHeight = parseFloat(toastElement.style.getPropertyValue("--_initial-height"));

                heightOffset += initialHeight;
            }

            toastElement.style.setProperty("--_height-offset", `${heightOffset}px`);
            toastElement.style.setProperty("--_idx", (this._toasts.length - i).toString());

            if (this._toasts.length - i >= maxVisibleToasts) {
                toastElement.setAttribute("data-toast-state", "hidden");
            }
        }
    }

    /**
     * @private
     * @returns {HTMLOListElement}
     */
    _getOrCreateToastContainer() {
        const toastContainer = document.getElementById(TOAST_CONTAINER_ID);

        if (!toastContainer) {
            const toastContainer = document.createElement("ol");

            toastContainer.id = TOAST_CONTAINER_ID;
            toastContainer.setAttribute("aria-label", "Notifications (Alt + T)");
            toastContainer.setAttribute("data-position-x", Toaster._config?.position?.x || TOAST_DEFAULT_POSITION.x);
            toastContainer.setAttribute("data-position-y", Toaster._config?.position?.y || TOAST_DEFAULT_POSITION.y);

            document.body.appendChild(toastContainer);

            return toastContainer;
        }

        if (!(toastContainer instanceof HTMLOListElement)) {
            throw new Error("[ToastMyNuts] Colliding ID " + TOAST_CONTAINER_ID + ".");
        }

        return toastContainer;
    }

    /**
     * @private
     * @param {string} message
     * @returns {HTMLDivElement}
     */
    _createMessageElement(message) {
        const messageElement = document.createElement("div");

        messageElement.textContent = message;
        messageElement.classList.add(TOAST_MESSAGE_CLASS);

        return messageElement;
    }

    /**
     * @private
     * @param {string} toastId
     * @param {ToastType} type
     *
     * @returns {HTMLLIElement}
     */
    _createToastElement(toastId, type) {
        const toastElement = document.createElement("li");

        toastElement.id = toastId;
        toastElement.classList.add(TOAST_CLASS);
        toastElement.style.setProperty("--_idx", "0");
        toastElement.style.setProperty("--_z-idx", this._toasts.length.toString());
        toastElement.setAttribute("data-toast-type", type);
        toastElement.setAttribute("data-toast-state", "entering");
        toastElement.setAttribute("aria-live", "polite");

        return toastElement;
    }

    /**
     * @private
     * @param {string} toastId
     * @return {[HTMLButtonElement, AbortController]}
     */
    _createCloseBtn(toastId) {
        const closeBtnAbortController = new AbortController();
        const closeBtn = document.createElement("button");

        closeBtn.type = "button";
        closeBtn.setAttribute("aria-label", "Close notification");
        closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" /></svg>`;
        closeBtn.classList.add(TOAST_CLOSE_BTN_CLASS);

        closeBtn.addEventListener("click", () => {
            if (Toaster._config && Toaster._config.ignoreErrors) {
                try {
                    this.removeToast(toastId);
                } catch (_err) {}
            } else {
                this.removeToast(toastId);
            }
        }, { signal: closeBtnAbortController.signal });

        return [closeBtn, closeBtnAbortController];
    }
}
