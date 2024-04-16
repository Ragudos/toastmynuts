/**
* @global
*
* @default { "x": "middle", "y": "top" }
*
* @typedef {Object} ToastPosition
* @property {"left" | "middle" | "right"} x The horizontal position of the toast.
* @property {"top" | "bottom"} y The vertical position of the toast.
*/

/**
* @global
* @default "neutral"
* What type of toast to display.
* @typedef {"neutral" | "info" | "success" | "warning" | "error"} ToastType
*/

/**
* @global
*
* @typedef {Object} ToastConfig
* @property {ToastPosition} [position]
* @property {number} maxVisibleToasts
* The amount of toasts visible on the screen when they
* are expanded. Excess toasts will be hidden.
* @property {boolean} ignoreErrors
* We silence thrown errors by having an empty catch block
*```ts
* try {
*  // Code that may throw an error
* } catch (_error) {}
* ```
* @property {boolean} stackable
* Whether or not toasts should stack on top of each other.
* By default, toasts will stack on top of each other and can be expanded.
* If this is set to false, toasts will not be stacked.
*/

/**
* @global
* @typedef {Object} Toast
* @property {string} _id
* @property {string} _message
* The message displayed in the toast. **This should not be altered externally.**
* @property {number} _duration
* The duration in milliseconds before a toast disappears. **This should not be altered externally.**
* @property {ToastType} _type
* The type of toast to display. **This should not be altered externally.**
* @property {AbortController[]} _controllers
* An array of aborters this function has. They are stored, so they can destroy their
* respective events along with the toast. **This should not be altered externally.**
* @property {number | undefined} _timeout
* The timeout id for the toast. **This should not be altered externally.**
*/

/**
 * @global
 *
 * @typedef {Object} ToastRemoval
 * @property {number} idxInToastArray
 * The index of the toast in the toast array, so it can be used when changing the z indices of its siblings.
 */