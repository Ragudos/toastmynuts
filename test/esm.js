import { initializeToast } from "../dist/index.esm.js";

const toast = initializeToast({
	richColors: true,
	theme: "light",
});

console.log(toast.success);
const words = [
	"hi",
	" jfoewjifjeio jrije irjejrio jiejri jeiorji ewjiroj ioejrio jiowerjiowej jrioew jirjiweoj irjweiojr ijwer",
	"hhohohoooh",
];

document.querySelector("#warning").addEventListener("click", function () {
	toast.warning("Warning!");
});

document.querySelector("#info").addEventListener("click", function () {
	toast.info("Info!");
});

document.querySelector("#error").addEventListener("click", function () {
	toast.error("Error!");
});

document.querySelector("#success").addEventListener("click", function () {
	toast.success("Success!");
});

document.querySelector("#promise").addEventListener("click", async function () {
	const [toastId, data] = await toast.promise(
		"Loading...",
		() => {
			return data;
		},
		(err) => {
			return err;
		},
		new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("hello");
			}, 2_000);
		}),
	);
});

document.querySelector("#show").addEventListener("click", function () {
	const index = Math.floor(Math.random() * words.length);
	const word = words[index];
	toast(word);
});
