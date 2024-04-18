import { ToastFunctions } from "./types";
declare global {
    interface Window {
        ToastMyNuts: Readonly<ToastFunctions>;
    }
}
