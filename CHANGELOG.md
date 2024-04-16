# v1.0.2

- Add base logic for:
    - Adding toasts
    - Removing toasts
    - Moving toasts on addition and removal
    - Toast base styling w/ plain black and white
    - Stackable and expanded toasts
    - Expand toasts on keypress (Alt + T) and pointerenter
    - Close toast on close button click.
- Published to NPM

# v1.0.3

- Fix wrong toast exit animation position when toasts are stacked

# v1.0.4

- Fix flickering when pointer enters the outermost part of toast
- Fix mouseenter and mouseleave interfering with key shortcut (Alt + T).

# v1.0.5

- Change box-sizing to border-box to not include padding in toast's height.
- Add stackable config option

# v1.0.6

- Fix toasts on stack not in sync with the new state of toasts array when toasts are removed very quickly
consecutively by using a new array for toBeRemoved toasts and removing the toast to be removed from the
array of toasts.

# v1.1.0

- Add close on swipe
- Fix z-index not updating properly after micro-optimization from commit 153a71d2eae294c210689caabe1cec8237693d65
