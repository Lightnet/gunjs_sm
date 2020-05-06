<script>
    import { onMount, afterUpdate, onDestroy, createEventDispatcher } from 'svelte';
    import { generateId } from '../../helper/generateid.js';
    import { gun, onLogout } from '../../../mjs.js';

    const dispatch = createEventDispatcher();
    let idcomponent = generateId(20);
    
    onMount(async () => {
        //console.log("mount")
        let user = gun.user();
        if(user.is){
            console.log("logout");
            user.leave();
            onLogout();
            dispatch('hevent','home');
        }
    });

    onDestroy(() => {
       //console.log("onDestroy");
    });
</script>

<style>

</style>
<div id="{idcomponent}">

</div>