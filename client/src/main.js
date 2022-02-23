import './global.css';
import App from './App.svelte';
import '../node_modules/mini.css/dist/mini-dark.min.css';
/*const app = new App({
    target: document.body,
});*/

import HMR from "@roxi/routify/hmr";

const app = HMR(App, { target: document.body }, "routify-app");


export default app;
