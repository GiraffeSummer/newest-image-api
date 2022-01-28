import { writable } from "svelte/store";

export let gifImages = writable([]);
export let lastSearch = writable('')
export let result = writable('')