# ToastMyNuts

ToastMyNuts is a lightweight and customizable toast notification library designed for use in web applications. With ToastMyNuts, you can easily display informative and visually appealing toast notifications to your users, enhancing their overall experience.

Thanks to [Sonner Toast by Emilkowalski](https://sonner.emilkowal.ski) as I got the idea of stacking toasts from his project.

## Features

-   **Easy Integration**: Simply import ToastMyNuts as an ES module or add a script tag to your page with a CDN link.
-   **Responsive**: ToastMyNuts ensures a responsive and user-friendly experience across different devices and screen sizes.
-   **Customizable**: I used the `:where()` pseudo-selector on the non-essential CSS to apply 0 specificity, so you can easily customize the toasts!
-   **Limit visible toasts**: Toasts are blocking your view? Fret not, for you can limit the amount of toasts visible in the viewport.
-   **Stackable**: Better yet, why not stack your toasts? They can either be stacked or expanded. If you specify them to not be stackable, then they won't ever be stackable. They are stackable by default.
-   **Swipeable**: Lazy to click on the close button? Don't worry, you can swipe your toasts clean! You can turn them off when initiating this library.
-   **Rich colors**: Add playfulness to your toasts by enabling richColors OR you can customize them using CSS variables. What a rich experience!
-   **Promises**: Are you looking to have one entire function to show a loading message, and success or error message for a toast when doing an asynchronous operation? Then, the `toast.promise()` function is just what you need! When promises are awaiting, they will not be closeable at all.
-   **Smooth like butter**: Toasts are smooth by default.
-   **Support for `prefers-reduced-motion`**: The CSS code for this library automatically adds `transition-duration: 0.01ms` when users turn off their animations on their devices.

## Installation
-   Via CDN like Unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/toastmynuts@2.0.0/dist/styles.css"/>
<script src="https://unpkg.com/toastmynuts@2.0.0/dist/index.umd.js" crossorigin="anonymous"></script>
```

-   Via ES Modules

**Note**: This can only be used on the client, so please take note if you are using
server side stuff. Also, there can only be one instance of a toaster, so if you call ```initializeToast``` again, the returned instance will be the same as the one from the very first invocations.

```ts
import { initializeToast } from "toastmynuts";
import "toastmynuts/styles.css";

export const toast = initializeToast({
	// Config here. Refer to the documentation for types.
});
```

## Usage
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
The library makes use of the behavior of promises to allow you to dynamically set a message for either a successful or failed asynchronous operation.

```ts
try {
	const [toastId, data] = toast.promise(
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

## Contributing

Contributions to ToastMyNuts are welcome! Whether you want to report a bug, request a feature, or submit a pull request, your involvement helps improve the library for everyone.

Contribution guidelines are yet to be made.

## License

ToastMyNuts is licensed under the MIT License. See the [LICENSE](https://github.com/Ragudos/toastmynuts/blob/main/LICENSE) file for details.
