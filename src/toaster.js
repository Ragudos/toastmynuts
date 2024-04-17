// @ts-check

export const TOAST_DURATION = 10_000;
export const TOAST_CONTAINER_ID = "__toastmynuts__";
export const TOAST_WRAPPER_ID = "__toastmynuts__wrapper";
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
	 * @type {Toast[]}
	 *
	 * To avoid a race condition for moving toasts upwards when removing a toast,
	 * where in the loop, they'd have the same reference to the toast array before the
	 * previous toasts were removed (they are still in an exit animation and yet to be removed),
	 * we add them to a toBeRemovedArray so we can remove them from the main toast array
	 */
	_toastToBeRemoved;

	/**
	 * @private
	 * @type {ToastConfig | undefined}
	 */
	static _config;

	/**
	 * @private
	 * @type {(() => void) | undefined}
	 */
	static _toastContainerMouseEnterListener;

	/**
	 * @private
	 * @type {(() => void) | undefined}
	 */
	static _toastContainerMouseLeaveListener;

	/**
	 * @private
	 * @type {((evt: KeyboardEvent) => void) | undefined}
	 */
	static _toastContainerKeyDownListener;

	/**
	 * @private
	 * @type {((evt: KeyboardEvent) => void) | undefined}
	 */
	static _toastContainerKeyUpListener;

	/**
	 * @private
	 */
	constructor() {
		this._toasts = [];
		this._toastToBeRemoved = [];
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
		const [closeBtn, closeBtnAbortController] =
			this._createCloseBtn(toastId);
		const [toastElement, toastListenersAbortController] =
			this._createToastElement(toastId, type);
		const toastRelativeContainer = document.createElement("div");
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

		toastRelativeContainer.appendChild(messageElement);
		toastRelativeContainer.appendChild(closeBtn);
		toastElement.appendChild(toastRelativeContainer);
		toastContainer.appendChild(toastElement);

		const originalHeight = toastElement.style.height;

		toastElement.style.height = "auto";

		const packedHeight = toastElement.getBoundingClientRect().height;
		const packedHeightString = `${packedHeight}px`;

		toastElement.style.height = originalHeight;
		toastContainer.style.setProperty(
			"--_front-toast-height",
			packedHeightString,
		);
		toastElement.style.setProperty("--_initial-height", packedHeightString);

		toastElement.removeAttribute("data-toast-state");
		this._moveToastsDown(packedHeight);

		const dateNow = Date.now();

		this._toasts.push({
			_message: message,
			_type: type,
			_controllers: [
				closeBtnAbortController,
				toastListenersAbortController,
			],
			_timeout: timeout,
			_duration: TOAST_DURATION,
			_id: toastId,
			_created_on: dateNow,
			_timeout_created_on: dateNow,
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
			throw new Error(
				"[ToastMyNuts] Could not find toast with ID " +
					toastId +
					" virtually",
			);
		}

		/**
		 * @type {HTMLElement | null}
		 */
		const toastElement = document.getElementById(toast._id);

		if (!toastElement) {
			throw new Error(
				"[ToastMyNuts] Could not find toast with ID " +
					toastId +
					" in the DOM",
			);
		}

		const isExiting =
			toastElement.getAttribute("data-toast-state") === "closing";

		if (isExiting) {
			return;
		}

		while (toast._controllers.length !== 0) {
			toast._controllers.pop()?.abort();
		}

		const isHidden =
			toastElement.getAttribute("data-toast-state") === "hidden";

		if (toast._timeout !== undefined) {
			clearTimeout(toast._timeout);
		}

		if (isHidden) {
			this._removeToastPermanently(toastId, true);
			this._toasts.splice(toastIdx, 1);

			for (let i = toastIdx; i < this._toasts.length; ++i) {
				const toast = this._toasts[i];

				if (!toast) {
					continue;
				}

				/**
				 * @type {HTMLElement | null}
				 */
				const toastElement = document.getElementById(toast._id);

				if (!toastElement) {
					throw new Error(
						"[ToastMyNuts] Could not find toast with ID " +
							toast._id +
							" in the DOM",
					);
				}

				toastElement.style.setProperty("--_z-idx", i.toString());
			}

			return;
		}

		toastElement.setAttribute("data-toast-state", "closing");

		const toastElementTransitionDuration = parseFloat(
			getComputedStyle(toastElement).transitionDuration,
		);
		this._moveToastsUp(toastIdx);
		this._toastToBeRemoved.push(toast);
		// Remove the array so that, if a user instantly closes another toast,
		// the then call to _moveToastsUp will reference the updated state.
		this._toasts.splice(toastIdx, 1);

		for (let i = toastIdx; i < this._toasts.length; ++i) {
			const toast = this._toasts[i];

			if (!toast) {
				continue;
			}

			/**
			 * @type {HTMLElement | null}
			 */
			const toastElement = document.getElementById(toast._id);

			if (!toastElement) {
				throw new Error(
					"[ToastMyNuts] Could not find toast with ID " +
						toast._id +
						" in the DOM",
				);
			}

			toastElement.style.setProperty("--_z-idx", i.toString());
		}

		setTimeout(() => {
			this._removeToastPermanently(toastId, false);
		}, toastElementTransitionDuration * 1000);
	}

	/**
	 * @private
	 * @param {string} toastId
	 * @param {boolean} isRemovedInstantly
	 * Whether our toast did not have an exit animation
	 */
	_removeToastPermanently(toastId, isRemovedInstantly) {
		// The toast idx might change already when this callback is called,
		// so we find it again.

		/**
		 * @type {Toast | undefined}
		 */
		let toast;
		let toastIdx;

		if (isRemovedInstantly) {
			for (let i = 0; i < this._toasts.length; ++i) {
				if (this._toasts[i]._id === toastId) {
					toast = this._toasts[i];
					toastIdx = i;
				}
			}
		} else {
			for (let i = 0; i < this._toastToBeRemoved.length; ++i) {
				if (this._toastToBeRemoved[i]._id === toastId) {
					toast = this._toastToBeRemoved[i];
					toastIdx = i;
				}
			}
		}

		if (!toast) {
			throw new Error(
				"[ToastMyNuts] Could not find toast with ID " +
					toastId +
					" virtually",
			);
		}

		const toastElement = document.getElementById(toast._id);

		// TODO: Find a way for the toast Element to exist when toasts are removed
		// almost instantly one after the other. For some reason, it doesn't exist,
		// but we still successfully execute everything.
		toastElement?.remove();

		if (!isRemovedInstantly && toastIdx !== undefined) {
			this._toastToBeRemoved.splice(toastIdx, 1);
		}

		if (this._toasts.length === 0) {
			const toastWrapper = document.getElementById(TOAST_WRAPPER_ID);
			const toastContainer = document.getElementById(TOAST_CONTAINER_ID);

			if (Toaster._toastContainerMouseEnterListener) {
				toastContainer?.removeEventListener(
					"pointerenter",
					Toaster._toastContainerMouseEnterListener,
				);
			}

			if (Toaster._toastContainerMouseLeaveListener) {
				toastContainer?.removeEventListener(
					"pointerleave",
					Toaster._toastContainerMouseLeaveListener,
				);
			}

			if (Toaster._toastContainerKeyDownListener) {
				window.removeEventListener(
					"keydown",
					Toaster._toastContainerKeyDownListener,
				);
			}

			if (Toaster._toastContainerKeyUpListener) {
				window.removeEventListener(
					"keyup",
					Toaster._toastContainerKeyUpListener,
				);
			}

			toastWrapper?.remove();
		}
	}

	/**
	 * @private
	 * Removes all timeouts in the toasts array
	 * and for each toast, changed their duration to
	 * the remaining time before they get removed.
	 * Used when expanding a stacked toast.
	 */
	_removeTimeoutOfToasts() {
		const dateNow = Date.now();

		for (let i = 0; i < this._toasts.length; ++i) {
			const toast = this._toasts[i];

			if (toast._timeout) {
				const remainingTime =
					toast._duration - (dateNow - toast._timeout_created_on);

				if (remainingTime <= 0) {
					continue;
				}

				clearTimeout(toast._timeout);
				toast._duration = remainingTime;
				toast._timeout = undefined;
			}
		}
	}

	/**
	 * @private
	 * Adds all timeouts in the toasts array.
	 * Used when stacking an expanded stacked toast.
	 */
	_addTimeoutToToasts() {
		const dateNow = Date.now();

		for (let i = 0; i < this._toasts.length; ++i) {
			const toast = this._toasts[i];

			if (!toast._timeout) {
				toast._timeout_created_on = dateNow;
				toast._timeout = setTimeout(() => {
					if (Toaster._config && Toaster._config.ignoreErrors) {
						try {
							this.removeToast(toast._id);
						} catch (_err) {}
					} else {
						this.removeToast(toast._id);
					}
				}, toast._duration);
			}
		}
	}

	/**
	 * @private
	 * @param {number} start
	 * Used when a toast is removed
	 */
	_moveToastsUp(start) {
		const maxVisibleToasts =
			Toaster._config?.maxVisibleToasts ?? TOAST_MAX_VISIBLE_TOASTS;

		for (let i = 0; i < start; ++i) {
			const toast = this._toasts[i];

			if (!toast) {
				throw new Error(
					"[ToastMyNuts] Could not find toast with index " +
						i +
						" virtually",
				);
			}

			/**
			 * @type {HTMLElement | null}
			 */
			const toastElement = document.getElementById(toast._id);

			if (!toastElement) {
				throw new Error(
					"[ToastMyNuts] Could not find toast with ID " +
						toast._id +
						" in the DOM",
				);
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
					throw new Error(
						"[ToastMyNuts] Could not find toast with ID " +
							toast._id +
							" in the DOM",
					);
				}

				const initialHeight = parseFloat(
					toastElement.style.getPropertyValue("--_initial-height"),
				);

				heightOffset += initialHeight;
			}

			toastElement.style.setProperty(
				"--_height-offset",
				`${heightOffset}px`,
			);
			// -2 because we need to account for the toast that will be removed.
			toastElement.style.setProperty(
				"--_idx",
				(this._toasts.length - i - 2).toString(),
			);

			if (i === this._toasts.length - 2) {
				toastElement.setAttribute("data-front-toast", "true");
			}

			if (this._toasts.length - i <= maxVisibleToasts + 1) {
				if (
					toastElement.getAttribute("data-toast-state") === "hidden"
				) {
					toastElement.removeAttribute("data-toast-state");
					toastElement.removeAttribute("aria-hidden");
				}
			}
		}
	}

	/**
	 * @private
	 * @param {number} baseHeightOffset
	 * Used when a new toast is added
	 */
	_moveToastsDown(baseHeightOffset) {
		const maxVisibleToasts =
			Toaster._config?.maxVisibleToasts ?? TOAST_MAX_VISIBLE_TOASTS;

		for (let i = 0; i < this._toasts.length; ++i) {
			const toast = this._toasts[i];
			const toastElement = document.getElementById(toast._id);

			if (!toastElement) {
				throw new Error(
					"[ToastMyNuts] Could not find toast with ID " + toast._id,
				);
			}

			let heightOffset = baseHeightOffset;

			for (let j = i + 1; j < this._toasts.length; ++j) {
				const toast = this._toasts[j];
				const toastElement = document.getElementById(toast._id);

				if (!toastElement) {
					throw new Error(
						"[ToastMyNuts] Could not find toast with ID " +
							toast._id,
					);
				}

				let initialHeight = parseFloat(
					toastElement.style.getPropertyValue("--_initial-height"),
				);

				heightOffset += initialHeight;
			}

			toastElement.style.setProperty(
				"--_height-offset",
				`${heightOffset}px`,
			);
			toastElement.style.setProperty(
				"--_idx",
				(this._toasts.length - i).toString(),
			);
			toastElement.removeAttribute("data-front-toast");

			if (this._toasts.length - i >= maxVisibleToasts) {
				if (
					toastElement.getAttribute("data-toast-state") !== "closing"
				) {
					toastElement.setAttribute("data-toast-state", "hidden");
					toastElement.setAttribute("aria-hidden", "true");
				}
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
			const toastWrapper = document.createElement("div");

			toastWrapper.id = TOAST_WRAPPER_ID;
			toastWrapper.setAttribute("aria-label", "Notifications (Alt + T)");

			const toastContainer = document.createElement("ol");

			toastContainer.id = TOAST_CONTAINER_ID;
			const isStackable =
				Toaster._config?.stackable === true ||
				Toaster._config?.stackable === undefined;

			toastContainer.setAttribute(
				"data-position-x",
				Toaster._config?.position?.x || TOAST_DEFAULT_POSITION.x,
			);
			toastContainer.setAttribute(
				"data-position-y",
				Toaster._config?.position?.y || TOAST_DEFAULT_POSITION.y,
			);
			toastContainer.setAttribute(
				"data-stackable",
				isStackable ? "true" : "false",
			);
			toastContainer.setAttribute(
				"data-expanded",
				isStackable ? "false" : "true",
			);

			if (isStackable) {
				Toaster._toastContainerMouseEnterListener = () => {
					if (
						toastContainer.getAttribute(
							"data-did-toggle-expansion",
						) === "true"
					) {
						return;
					}

					toastContainer.setAttribute("data-expanded", "true");
					toastContainer.removeAttribute("data-should-stack");
					this._removeTimeoutOfToasts();
				};

				Toaster._toastContainerMouseLeaveListener = () => {
					if (
						toastContainer.getAttribute(
							"data-did-toggle-expansion",
						) === "true"
					) {
						return;
					}

					const children = toastContainer.children;

					for (let i = 0; i < children.length; ++i) {
						if (
							children[i].getAttribute("data-is-swiping") ===
							"true"
						) {
							toastContainer.setAttribute(
								"data-should-stack",
								"true",
							);
							return;
						}
					}

					toastContainer.setAttribute("data-expanded", "false");
					this._addTimeoutToToasts();
				};

				Toaster._toastContainerKeyDownListener = (e) => {
					if (e.altKey && e.code === "KeyT") {
						if (
							toastContainer.getAttribute(
								"data-did-toggle-expansion",
							) === "true"
						) {
							return;
						}

						const shouldExpand =
							toastContainer.getAttribute("data-expanded") ===
							"false";

						toastContainer.setAttribute(
							"data-expanded",
							shouldExpand ? "true" : "false",
						);
						toastContainer.setAttribute(
							"data-did-toggle-expansion",
							"true",
						);

						if (shouldExpand) {
							this._removeTimeoutOfToasts();
						} else {
							this._addTimeoutToToasts();
						}
					}
				};

				Toaster._toastContainerKeyUpListener = (e) => {
					if (e.code === "KeyT") {
						toastContainer.setAttribute(
							"data-did-toggle-expansion",
							"false",
						);
					}
				};

				toastContainer.addEventListener(
					"pointerenter",
					Toaster._toastContainerMouseEnterListener,
				);
				toastContainer.addEventListener(
					"pointerleave",
					Toaster._toastContainerMouseLeaveListener,
				);
				window.addEventListener(
					"keydown",
					Toaster._toastContainerKeyDownListener,
				);
				window.addEventListener(
					"keyup",
					Toaster._toastContainerKeyUpListener,
				);
			}

			toastWrapper.appendChild(toastContainer);
			document.body.appendChild(toastWrapper);

			return toastContainer;
		}

		if (!(toastContainer instanceof HTMLOListElement)) {
			throw new Error(
				"[ToastMyNuts] Colliding ID " + TOAST_CONTAINER_ID + ".",
			);
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
	 * @returns {[HTMLLIElement, AbortController]}
	 */
	_createToastElement(toastId, type) {
		const listenerAbortController = new AbortController();
		const toastElement = document.createElement("li");

		toastElement.id = toastId;
		toastElement.classList.add(TOAST_CLASS);
		toastElement.style.setProperty("--_idx", "0");
		toastElement.style.setProperty(
			"--_z-idx",
			this._toasts.length.toString(),
		);
		toastElement.setAttribute("data-toast-type", type);
		toastElement.setAttribute("data-toast-state", "entering");
		toastElement.setAttribute("aria-live", "polite");
		toastElement.setAttribute("aria-atomic", "true");
		toastElement.setAttribute("data-front-toast", "true");

		toastElement.addEventListener(
			"pointerdown",
			(evt) => {
				toastElement.setAttribute("data-is-swiping", "true");

				const originalPosition = evt.screenY;

				toastElement.style.setProperty(
					"--_original-position",
					originalPosition.toString(),
				);
			},
			{ signal: listenerAbortController.signal },
		);

		window.addEventListener(
			"pointerup",
			(evt) => {
				const swipeOffset = parseFloat(
					toastElement.style.getPropertyValue("--_swipe-offset"),
				);

				toastElement.setAttribute("data-is-swiping", "false");

				if (Math.abs(swipeOffset) > 15) {
					toastElement.setAttribute("data-exit-swipe", "true");
					this.removeToast(toastId);
				} else {
					toastElement.style.setProperty("--_swipe-offset", "0px");
					toastElement.style.removeProperty("--_original-position");
				}

				const toastContainer =
					document.getElementById(TOAST_CONTAINER_ID);

				if (!toastContainer) {
					if (!Toaster._config?.ignoreErrors) {
						throw new Error(
							"[ToastMyNuts] Could not find toast container with ID " +
								TOAST_CONTAINER_ID,
						);
					} else {
						return;
					}
				}

				if (
					toastContainer.getAttribute("data-should-stack") === "true"
				) {
					toastContainer.setAttribute("data-should-stack", "false");
					toastContainer.setAttribute("data-expanded", "false");
					this._addTimeoutToToasts();
				}
			},
			{ signal: listenerAbortController.signal },
		);

		window.addEventListener(
			"pointermove",
			(evt) => {
				const isSwiping =
					toastElement.getAttribute("data-is-swiping") === "true";

				if (!isSwiping) {
					return;
				}
				const toastContainer =
					document.getElementById(TOAST_CONTAINER_ID);

				if (!toastContainer) {
					if (!Toaster._config?.ignoreErrors) {
						throw new Error(
							"[ToastMyNuts] Could not find toast container with ID " +
								TOAST_CONTAINER_ID,
						);
					} else {
						return;
					}
				}

				const verticalPosition =
					toastContainer.getAttribute("data-position-y");
				const isTop = verticalPosition === "top";
				const isBottom = verticalPosition === "bottom";
				const originalPosition = parseFloat(
					toastElement.style.getPropertyValue("--_original-position"),
				);
				const swipeOffset = originalPosition - evt.screenY;

				if (
					(isTop && swipeOffset < 0) ||
					(isBottom && swipeOffset > 0)
				) {
					return;
				} else if (
					!isTop &&
					!isBottom &&
					!Toaster._config?.ignoreErrors
				) {
					throw new Error(
						"[ToastMyNuts] Invalid vertical position " +
							verticalPosition,
					);
				}

				toastElement.style.setProperty(
					"--_swipe-offset",
					`${swipeOffset}px`,
				);
			},
			{ signal: listenerAbortController.signal },
		);

		return [toastElement, listenerAbortController];
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

		closeBtn.addEventListener(
			"click",
			() => {
				if (Toaster._config && Toaster._config.ignoreErrors) {
					try {
						this.removeToast(toastId);
					} catch (_err) {}
				} else {
					this.removeToast(toastId);
				}
			},
			{ signal: closeBtnAbortController.signal },
		);

		return [closeBtn, closeBtnAbortController];
	}
}
