/*
 Project: module_ui_app_svelte

 Created by: Lightnet

 License: MIT

 */
//console.log("init ?");
import { writable, get } from 'svelte/store';
import useLocalStorage from './useLocalStorage.js';

const appid = "mjs";
var themeid = "default";
//===============================================
// Gun /SEA
export var gun = {};
export function setGun(value){
    //console.log("set?");
    gun = value;
}
export function getGun(){
    return gun;
}

export const onUserName = writable("Guest");
export const onPub = writable("");
var userData = {};

export function pair(){
    return sea;
}

export function setUser(data){
    onUserName.set(data.alias);
    onPub.set(data.pub);
    //console.log(data);
}
export const onLogin = writable(false);

export function onLogout(){
    onUserName.set("Guest");
    userData = {};
    sea={
        epriv:"",
        eqpub:"",
        priv:"",
        pub:"",
    }
    onPub.set("");
    onLogin.set(false);
}

export default {
    gun,
    setGun,
    getGun,
    onUserName,
    onPub,
    setUser,
    onLogout,
}
