// @ts-check

export const TOAST_DURATION = 5_000;
export const TOAST_CONTAINER_ID = "__toastmynuts__";
export const TOAST_CLASS = "__toastmynuts__toast";
export const TOAST_MESSAGE_CLASS = "__toastmynuts__message";

export class Toaster {
    /**
     * @type {Toaster | undefined}
     * @private
     */
    static instance;

    /**
     * @private
     * @type {Toast[]}
     */
    _toasts;

    /**
     * @private
     * @type {number[]}
     */
    _timers;

    /**
     * @type {ToastConfig | undefined}
     */
    static _config;

    /**
     * @private
     */
    constructor() {
        this._toasts = [];
        this._timers = [];
    }

    /**
     * @returns {Toaster}
     * @param {ToastConfig | undefined} config
     */
    static getInstance(config) {
        if (!Toaster.instance) {
            Toaster.instance = new Toaster();
        }

        Toaster._config = config;

        return Toaster.instance;
    }

    /**
     * @param {string} message
     * @param {ToastType} [type]
     */
    addToast(message, type = "neutral") {
        // Since the last item would have the index of (len - 1).
        const toastIdx = this._toasts.length;
        const closeBtnAbortController = new AbortController();
        let timeout;

        const closeBtnListener = () => {
            if (Toaster._config && Toaster._config.ignoreErrors) {
                try {
                    this.removeToast(toastIdx);
                } catch (_error) {}
            } else {
                this.removeToast(toastIdx);
            }
        };

        timeout = setTimeout(() => {
            if (Toaster._config && Toaster._config.ignoreErrors) {
                try {
                    this.removeToast(toastIdx);
                } catch (_error) {}
            } else {
                this.removeToast(toastIdx);
            }
        }, TOAST_DURATION);

        const closeBtn = this._createCloseBtn();
        closeBtn.addEventListener("click", closeBtnListener, { signal: closeBtnAbortController.signal });

        const toastElement = document.createElement("li");
        toastElement.classList.add(TOAST_CLASS);
        toastElement.setAttribute("data-original-idx", toastIdx + "");
        toastElement.setAttribute("data-idx", toastIdx + "");
        toastElement.style.setProperty("--_idx", toastIdx + "");
        toastElement.setAttribute("data-toast-type", type);

        const messageElement = document.createElement("div");
        messageElement.classList.add(TOAST_MESSAGE_CLASS);
        messageElement.textContent = message;

        toastElement.appendChild(messageElement);
        toastElement.appendChild(closeBtn);

        const toastContainer = document.getElementById(TOAST_CONTAINER_ID);

        if (!toastContainer) {
            throw new Error("[ToastMyNuts] Could not find toast container with ID: " + TOAST_CONTAINER_ID);
        }

        toastContainer.appendChild(toastElement);

        const toast = {
            _message: message,
            _duration: TOAST_DURATION,
            _type: type,
            _controllers: [closeBtnAbortController]
        };

        this._toasts.push(toast);
        this._timers.push(timeout);
    }

    /**
     * @param {number} toastIdx The original index of the toast
     *
     * @throws {Error} If the toast or its corresponding
     * timer with the given ID does not exist either on the DOM or virtually.
     */
    removeToast(toastIdx) {
        /**
         * @type {HTMLElement | null}
         */
        const toastElement = document.querySelector(`.${TOAST_CLASS}[data-original-idx="${toastIdx}"]`);

        if (!toastElement) {
            throw new Error("[ToastMyNuts] Could not find toast with ID: " + toastIdx + " in the DOM.");
        }

        const isExiting = toastElement.getAttribute("data-toast-state") === "closing";

        if (isExiting) {
            return;
        }

        const rawCurrIdx = toastElement.getAttribute("data-idx");

        if (!rawCurrIdx) {
            throw new Error("[ToastMyNus] Could not get the value of attribute [data-idx] from the toast.");
        }

        const currIdx = +rawCurrIdx;
        const toast = this._toasts[currIdx];

        if (!toast) {
            throw new Error("[ToastMyNuts] Could not find toast with ID: " + currIdx + " virtually.");
        }

        while (toast._controllers.length !== 0) {
            toast._controllers.pop()?.abort();
        }

        const toastElementAnimationDuration = +toastElement.style
            .getPropertyValue("--_transition-duration")
            .split("ms")[0];

        toastElement.setAttribute("data-toast-state", "closing");

        setTimeout(() => {
            // We remove them together for synchronization.
            this._moveToasts(currIdx);
            toastElement.remove();
            this._toasts.splice(currIdx, 1);
            if (this._timers[currIdx]) {
                clearTimeout(this._timers[currIdx]);
                this._timers.splice(currIdx, 1);
            } else {
                throw new Error("[ToastMyNuts] Could not find timer for toast with ID: " + currIdx);
            }
        }, toastElementAnimationDuration);
    }

    /**
     * @private
     */
    _createCloseBtn() {
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "x";
        closeBtn.classList.add("__toastmynuts__close-btn");

        return closeBtn;
    }

    /**
     * @private
     * @param {number} start
     * Moves toasts that are after the one that was removed.
     * For now, we only care about decrementing their indeces
     * by one as we only have one point of entrance
     * while adding toasts.
     */
    _moveToasts(start) {
        for (let idx = start; idx < this._toasts.length; ++idx) {
            /**
             * @type {HTMLElement | null}
             */
            const toastElement = document.querySelector(`.${TOAST_CLASS}[data-idx="${idx}"]`);

            if (!toastElement) {
                throw new Error("[ToastMyNuts] Could not find toast with ID: " + idx + " in the DOM.");
            }

            toastElement.setAttribute("data-idx", (idx - 1) + "");
            toastElement.style.setProperty("--_idx", (idx - 1) + "");
        }
    }
}