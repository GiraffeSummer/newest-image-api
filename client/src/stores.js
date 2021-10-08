import { writable } from 'svelte/store';

export const backend = import.meta.env.VITE_backend;
export const user = writable({});

export const safeFileName = (text) => {
    if (text == '' || text == undefined) return text;
    else
        return text.replace(/[^a-zA-Z0-9 @&$,.-_]/, '');
};