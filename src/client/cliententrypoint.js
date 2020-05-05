/*
 Project: gunjs_sm
 Created by: Lightnet
 License: MIT
 Information: Work in progres.
 */
localStorage.clear();
console.log("init engine...");
//'use strict';
//import App from './App.svelte';
//console.log(`running svelte version ${svelte.VERSION}`);
//import {utils} from './mjs';
/*
import Gun from 'gun/gun';
import 'gun/lib/then';
import '../common/gunjstrustsharekeyv2';
import 'gun/sea';
*/
//require('gun/sea');
//localStorage.clear();
//window.localStorage.clear(); //try this to clear all local storage
//let register_class = utils.register_class;

//app.$on("workspace",(event)=>{
	//console.log("workspace: " + event.detail);
//});
//console.log("main app");
//export default app;

import {setGun} from './mjs';
import App from './App.svelte';
//import App from './component/threejs/ThreejsECSYComponent.svelte';

var gun = Gun("http://localhost:8080/gun");
setGun(gun);

const app = new App({
	target: document.body,
	props: {
		//name: 'MJS'
	}
});