/*
 Project: gunjs_sm
 Created by: Lightnet
 License: MIT
 Information: Work in progres.
 */
localStorage.clear();
//window.localStorage.clear(); //try this to clear all local storage
console.log("init app 1...");
//'use strict';
//console.log(`running svelte version ${svelte.VERSION}`);
//import {utils} from './mjs';
//import Gun from 'gun/gun';
//import 'gun/lib/then';
//import '../common/gunjstrustsharekeyv2';
//import 'gun/sea';
//require('gun/sea');
//let register_class = utils.register_class;
//app.$on("workspace",(event)=>{
	//console.log("workspace: " + event.detail);
//});
import App from './App.svelte';
import { setGun } from './mjs';

var gun = Gun({peers:["http://localhost:8080/gun"], localStorage: false});
setGun(gun);

const app = new App({
	target: document.body,
	props: {
		//name: 'MJS'
	}
});

//export default app;