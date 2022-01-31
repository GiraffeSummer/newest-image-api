import { writable } from 'svelte/store';

export const backend = import.meta.env.VITE_backend;
export const user = writable({});

export const minTags = 1;
export const maxTags = 20;

export const safeFileName = (text) => {
    if (text == '' || text == undefined) return text;
    else
        return text.replace(/[^a-zA-Z0-9 @&$,.-_]/, '');
};

export const objectMap = (obj, fields, invert = false) => {
    const temp = {};
    for (const key in obj) {
        if (fields.includes(key) == !invert) temp[key] = obj[key];
    }
    return temp;
}

export let PermissionKeys = [];

export const SetPermKeys = (perms) => {
    PermissionKeys = perms;
}

export function HighestPermission(user) {
    if (PermissionKeys.length <= 0) throw new Error("permission keys not set");
    let index = 0;
    user.permissions.forEach(p => {
        let i = PermissionKeys.indexOf(p);
        if (i > index) index = i;
    })

    return { index, permission: PermissionKeys[index] }
}


const elem = {}

export function addListener(evtName, listener) {
    elem[evtName] = listener;
}

export function dispatchEvent(evtName, data) {
    if (typeof elem[evtName] === 'function') {
        return elem[evtName](data);
    }
    else
        throw new Error('listener is not a function');
}

export function searchQuery(q = null) {
    if (location.search == '') return Object.create({});
    let search = location.search.substring(1);
    let obj = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    if (q != null) {/*if( obj.hasOwnProperty(q))*/return obj[q]; }
    else return obj
}