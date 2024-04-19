---
title: Usage
description: How to use the library.
rank: 3
---

-   Via CDN like Unpkg

**Note**: The toaster will automatically be initialized for you once you load the script for the library. There can only be one instance of this toaster, and it is exposed under the `window` object.

```html
<!-- When the script loads, it will look for a configuration in JSON format from a meta tag. Below is an example -->
<meta name="toastmynuts:config" content='{"richColors": true}' />
```

To render toasts

```html
<script>
	// Rendering a default toast
	const toastId = window.ToastMyNuts("Hello, World!");
	// Then to remove that toast manually. Note that if the toast has been removed
	// when you call this, an error will be thrown.
	window.ToastMyNuts.remove(toastId);
</script>
```

-   Via ES Modules

```ts
import { toast } from "path where you initialized the toast";

// Render a default toast;
const toastId = toast("Hello, World!");
// Then to remove that toast manually. Note that if the toast has been removed
// when you call this, an error will be thrown.
toast.remove(toastId);
```
<br>

### Promises

<p style="margin-top: 0rem; margin-bottom: 2rem;">
	The library makes use of the behavior of promises to allow you to dynamically set a message for either a successful or failed asynchronous operation.
</p>

```ts
try {
	const [toastId, data] = await toast.promise(
		// The loading message
		"Loading...",
		// The success message.
		// Either a string or a callback fn that returns a string.
		// This fn will have access to the data.
		(data) => {
			return `Welcome, ${data.name}! Your data has been registered.`;
		},
		// The error message.
		// Either a string or a callback fn that returns a string.
		// This fn will have access to the data.
		(err) => {
			return "Something went wrong. Please try again.";
		},
		// Can either be an asynchronous function or a promise
		async () => {
			const res = await fetch(
				"https://jsonplaceholder.typicode.com/users/1",
			);
			return res.json();
		},
		{ /** Toast options... */ }
	);
} catch (res) {
	const [toastId, err] = res;

	console.error(err);
}
```
