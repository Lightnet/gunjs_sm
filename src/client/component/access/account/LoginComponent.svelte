<script>
    import { onMount, afterUpdate, onDestroy, createEventDispatcher } from 'svelte';
    import ModalComponent from "../../base/ModalComponent.svelte";
    import { generateId } from '../../helper/generateid.js';
    import { gun, onLogin, setUser } from '../../../mjs.js';

    const dispatch = createEventDispatcher();
    let idcomponent = generateId(20);
    let loginid = "test";
    let password = "test";
    //loginid="beta",password="beta";
    let showModal = false;
    let message = "";

    let users = [];
    let selectuser;
    
    onMount(async () => {
        //console.log("mount");
        users.push({id:0,name:"beta",password:"test"});
        users.push({id:1,name:"alpha",password:"test"});
        users.push({id:2,name:"test",password:"test"});
        users=users;
    });

    onDestroy(() => {
       password="";
       message="";
    });

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    function btnlogin(e){
        //console.log(e);
        console.log(loginid, password);
        if(isEmpty(loginid)||isEmpty(password)){
            console.log("empty");
            return;
        }
        //console.log(gun);
        let user = gun.user();
        user.auth(loginid, password,(ack)=>{
            if(ack.err){
                //console.log("fail!");
                message = ack.err;
                showModal = true;
            }else{
                //self.$parent.$emit('view','index');
                //console.log("do something");
                //console.log(ack);
                //console.log(ack.sea);
                //console.log(ack.put);
                setUser(ack.put);
                //setSea(ack.sea);
                //dispatch("hevent",{action:"login"});
                onLogin.set(true);
            }
        });
    }

    function btnregister(e){
        //console.log(e);
        let user = gun.user();
        if(isEmpty(loginid)||isEmpty(password)){
            console.log("empty");
            return;
        }
        user.create(loginid, password, function(ack){
            //console.log(ack);
            if(ack.err){
                //console.log("fail!");
                //self.msg = "Register Alias Fail!";
                //console.log(ack.err);
                message = ack.err;
                showModal = true;
            }
            if(ack.pub){
                //console.log("created!", ack.pub);
                //self.msg = "Alias Created!";
                //self.bregister = false;
                message = "Alias Created!";
                showModal = true;
            }
        });
    }

    function clickForgot(e){
        dispatch("hevent",{action:"forgot"});
    }

    function SelectUser(){
        console.log(selectuser);
        loginid = users[selectuser].name;
        password = users[selectuser].password;
    }
</script>

<style>

</style>
<div id="{idcomponent}">
    <select bind:value={selectuser} on:change={SelectUser}>
        <option selected disabled> - Select User - </option>
        {#each users as item}
            <option value={item.id}> {item.name} </option>
        {/each}
    </select>
    <table>
        <tr>
            <td>Alias:</td>
            <td><input type="text" bind:value={loginid} placeholder="Alias"></td>
        </tr>
        <tr>
            <td>Password:</td>
            <td><input type="text" bind:value={password} placeholder="Passphase"></td>
        </tr><tr>
            <td>
                <button on:click={btnregister}>Register</button>
            </td><td style=" text-align: center;">
                <button on:click={btnlogin}>Login</button>
                <button on:click={clickForgot}>Forgot</button>
            </td>
        </tr>
    </table>
    
    {#if showModal}
    <ModalComponent on:close="{()=> {showModal=false;}}">
        <h2 slot="header">
            Message:
        </h2>

        <div slot="body">
            {message}
        </div>
    </ModalComponent>
    {/if}
</div>