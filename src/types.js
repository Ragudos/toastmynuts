/**
 * @global
 *
 * @default { "x": "middle", "y": "top" }
 *
 * @typedef {Object} ToastPosition
 * @property {"left" | "middle" | "right"} x The horizontal position of the toast.
 * @property {"top" | "bottom"} y The vertical position of the toast.
 *
 * @default "neutral"
 *
 * What type of toast to display.
 *
 * @typedef {"neutral" | "info" | "success" | "warning" | "error"} ToastType
 *
 * @typedef {Object} ToastConfig
 * @property {ToastPosition} [position]
 * @property {boolean} ignoreErrors
 * We silence thrown errors by having an empty catch block
 *```ts
 * try {
 *  // Code that may throw an error
 * } catch (_error) {}
 * ```
 *
 * @typedef {Object} Toast
 * The unique ID of the toast. **This should not be altered externally.**
 * @property {string} _message
 * The message displayed in the toast. **This should not be altered externally.**
 * @property {number} _duration
 * The duration in milliseconds before a toast disappears. **This should not be altered externally.**
 * @property {ToastType} _type
 * The type of toast to display. **This should not be altered externally.**
 * @property {AbortController[]} _controllers
 * An array of aborters this function has. They are stored, so they can destroy their
 * respective events along with the toast. **This should not be altered externally.**
 */