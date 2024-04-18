// @ts-ignore
import { initializeToast } from "toastmynuts";

document.addEventListener("DOMContentLoaded", init);

function init() {
	const toast = initializeToast();
	const btns = document.querySelectorAll("button[data-render-toast]");

	for (let i = 0; i < btns.length; ++i) {
		const btn = btns[i];
		const toastType = btn.getAttribute("data-render-toast");
		const isRichColor = btn.getAttribute("data-rich-color") === "true";

		btn.addEventListener("click", async () => {
			const theme = (btn.getAttribute("data-theme") || document.documentElement.getAttribute(
				"data-theme",
			)) as "light" | "dark" | "system" | undefined;
			const positionX = btn.getAttribute("data-change-position-x") as "left" | "middle" | "right" | undefined;
			const positionY = btn.getAttribute("data-change-position-y") as "top" | "bottom" | undefined;

			if (positionX && positionY) {
				toast.setPosition({ x: positionX, y: positionY });
			}

			switch (toastType) {
				case "neutral":
					{
						toast(
							"👋 Hi there. Thank you for checking out ToastMyNuts.",
							{
								richColors: isRichColor,
								theme,
							},
						);
					}
					break;
				case "success":
					{
						toast.success(
							"Success! You have successfully completed the task.",
							{
								richColors: isRichColor,
								theme,
							},
						);
					}
					break;
				case "error":
					{
						toast.error(
							"Error! Something went wrong. Please try again.",
							{
								richColors: isRichColor,
								theme,
							},
						);
					}
					break;
				case "warning":
					{
						toast.warning("Warning! Please be cautious.", {
							richColors: isRichColor,
							theme,
						});
					}
					break;
				case "info":
					{
						toast.info("Fun fact: Javascript is awesome", {
							richColors: isRichColor,
							theme,
						});
					}
					break;
				case "no-swipe":
					{
						toast("This toast cannot be swiped away.", {
							closeOnSwipe: false,
							theme,
						});
					}
					break;
				case "promise":
					{
						const [toastId, data] = await toast.promise(
							"Loading...",
							(data) => {
								return `Welcome, ${data.name}! Your data has been registered.`;
							},
							(err) => {
								console.error(err);
								return "Something went wrong. Please try again.";
							},
							async () => {
								const res = await fetch(
									"https://jsonplaceholder.typicode.com/users/1",
								);
								return res.json();
							},
							{
								richColors: isRichColor,
								theme,
							},
						);
					}
					break;
				case "disable-stack":
					{
						if (document.getElementById("__toastmynuts__")) {
							alert(
								"Please wait until all toasts are dismissed.",
							);
							return;
						}
						toast.setIsStackable(false);
					}
					break;
				case "enable-stack": {
					if (document.getElementById("__toastmynuts__")) {
						alert("Please wait until all toasts are dismissed.");
						return;
					}
					toast.setIsStackable(true);
				}
			}
		});
	}
}
