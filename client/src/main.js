import './global.css';
/*import App from './App.svelte';

const app = new App({
    target: document.body,
});*/

import HMR from "@roxi/routify/hmr";
import App from "./App.svelte";

const app = HMR(App, { target: document.body }, "routify-app");


export default app;
