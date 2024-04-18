# v1.0.2

-   Add base logic for:
    -   Adding toasts
    -   Removing toasts
    -   Moving toasts on addition and removal
    -   Toast base styling w/ plain black and white
    -   Stackable and expanded toasts
    -   Expand toasts on keypress (Alt + T) and pointerenter
    -   Close toast on close button click.
-   Published to NPM

# v1.0.3

-   Fix wrong toast exit animation position when toasts are stacked

# v1.0.4

-   Fix flickering when pointer enters the outermost part of toast
-   Fix mouseenter and mouseleave interfering with key shortcut (Alt + T).

# v1.0.5

-   Change box-sizing to border-box to not include padding in toast's height.
-   Add stackable config option

# v1.0.6

-   Fix toasts on stack not in sync with the new state of toasts array when toasts are removed very quickly
    consecutively by using a new array for toBeRemoved toasts and removing the toast to be removed from the
    array of toasts.

# v1.1.0

-   Add close on swipe
-   Remove timeouts of toast on expand
-   Option to not stack toasts at all but still remove timeouts of toasts when the triggers for expansion are triggers.
-   Fix z-index not updating properly after micro-optimization from commit [153a71d2eae294c210689caabe1cec8237693d65](https://github.com/Ragudos/toastmynuts/commit/153a71d2eae294c210689caabe1cec8237693d65)

# v1.1.1

-   Fix animation being instant on height when toasts become stacked, which causes a flick-like feeling instead of a smooth flow from one height to another.

# v2.0.0

-   Add rich colors
-   Add directionality support (rtl and ltr)
-   Fix bug on pseudo element of toasts not detected for pointerenter of the toastContainer
-   Add dark and light theme
-   Add promise toast
-   Add option for toastDuration for customization
-   Fix bug on front toast height not updated when removing toasts
-   Separate logic for changing the z-index of toasts to a separate function.
-   Add shortcut functions to creating toasts (e.g. toast.success(message), toast.error(message)...)
-   Use Autoprefixer to add fallbacks for possible uses of unsupported CSS features in older browsers to the bundled CSS in dist/.
-   Add icons.
-   Add a fade when swiping further away from original position.
-   Add ESM module bundle
- Add toast options for possible individual toast config
- Fix CSS specificity of 0 not withholding the essential styles when an external style is applied. To do this, we separate the essential styles and apply a specificity to them.
- Use TypeScript instead of JSDoc to auto-generate a declaration file
- Remove ignoreErrors from the config
