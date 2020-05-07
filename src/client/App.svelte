<script>
    import { onMount, onDestroy, createEventDispatcher} from 'svelte';
    import { generateId } from './generateid';
    import { gun, onLogin } from './mjs';

    import LoginComponent from "./component/access/account/LoginComponent.svelte";
    import ForgotComponent from "./component/access/account/ForgotComponent.svelte";
    import LogoutComponent from "./component/access/account/LogoutComponent.svelte";

    import AccountComponent from "./component/access/account/AccountComponent.svelte";

    import MessagesComponent from "./component/access/messages/MessagesComponent.svelte";
    import ChatComponent from "./component/access/chat/ChatComponent.svelte";
    import PublicComponent from "./component/access/chat/PublicChatComponent.svelte";
    import PrivateChatComponent from "./component/access/chat/PrivateChatComponent.svelte";

    import TestChatComponent from "./component/access/chat/TestChatComponent.svelte";
    import ForumComponent from "./component/access/forum/ForumComponent.svelte";


    let idcomponent = "main-" + generateId();
    let elcomponent;
    let idnav = "nav-" + generateId();
    let elnav;
    let idcontent = "content-" + generateId();
    let elcontent;
    let accessview = AccountComponent;
    accessview = TestChatComponent;
    //let accessview=null;
    let blogin = false;
    let bforgot = false;
    let navmenus = [];

    const unsubLogin = onLogin.subscribe(value => {
		//console.log(value);
		blogin = value;
    });

    function setupMenu(){
        navmenus.push({name:"Home",context:"home",comp:null});
        //navmenus.push({name:"Test Area",context:"testarea",comp:TestAreaComponent});
        navmenus.push({name:"Account",context:"account",comp:AccountComponent});
        //navmenus.push({name:"Contacts",context:"contacts",comp:ContactsComponent});
        navmenus.push({name:"Messages",context:"context",comp:MessagesComponent});
        navmenus.push({name:"Public Chat",context:"publicchat",comp:PublicComponent});
        navmenus.push({name:"Private Chat",context:"privatechat",comp:PrivateChatComponent});
        navmenus.push({name:"Test Chat",context:"testchat",comp:TestChatComponent});
        navmenus.push({name:"Forum",context:"forum",comp:ForumComponent});

        //navmenus.push({name:"Database",context:"database",comp:DatabaseComponent});
        //navmenus.push({name:"Admin",context:"admin",comp:AdminComponent});
        navmenus.push({name:"Logout",context:"logout",comp:LogoutComponent});
        //navmenus.push({name:"Logout",context:"logout",comp:null});
        navmenus=navmenus;
    }

    function h_context(e){
        //console.log(e);
        accessview=e;
    };
    
    onMount(() => {
        elcomponent = document.getElementById(idcomponent);
        elnav = document.getElementById(idnav);
        elcontent = document.getElementById(idcontent);
        setupMenu();
        window.addEventListener('resize', handle_auto_resize);
        window.dispatchEvent(new Event('resize'));
    });

    onDestroy(()=>{
        unsubLogin();
        window.removeEventListener('resize', handle_auto_resize);
    });

    function handle_auto_resize(event){
        let parent = elcomponent.parentNode;
        elcomponent.style.height = parent.clientHeight + 'px';
        elcomponent.style.width = parent.clientWidth + 'px';
        if(elnav == null){
            elnav = document.getElementById(idnav);
            return;
        }
        elnav.style.height = (24) + 'px';
        elnav.style.width = parent.clientWidth + 'px';
        //console.log(parent.clientHeight, parent.clientWidth);

        if(elcontent == null){
            elcontent = document.getElementById(idcontent);
            return;
        }
        elcontent.style.height = (parent.clientHeight - 24) + 'px';
        elcontent.style.width = parent.clientWidth + 'px';
    }

    function h_event(e){
        console.log(e)
        if(e.detail != null){
            if(e.detail.action !=null){
                /*
                if(e.detail.action == "login"){
                }
                */
                if(e.detail.action == "forgot"){
                    bforgot=true;
                }

                if(e.detail.action == "forgotclose"){
                    bforgot=false;
                }
            }
        }
        //bforgot=true;
    };

    function hevent(e){
        //console.log(e);
        for(let i=0;i<navmenus.length;i++){
            if(navmenus[i].context == e.detail){
                accessview = navmenus[i].comp;
                break;
            }
        }
    }

</script>
<style>


</style>

<div id="{idcomponent}" class="mainbody">
    Hello
    <div id="{idnav}" class="access_navmenu">
        {#if blogin}
            {#each navmenus as menu}
                <a href="/#" on:click="{()=>h_context(menu.comp)}">{menu.name} </a>
            {/each}
        {/if}
    </div>
    
    <div id="{idcontent}" class="">
        
        <!--
        {#if blogin}
            {#if accessview !=null}
                <svelte:component this={accessview} on:hevent={hevent}/>
            {/if}
        {:else}
            {#if bforgot}
                <ForgotComponent on:hevent={h_event}></ForgotComponent>
            {:else}
                Access
                <LoginComponent on:hevent={h_event}></LoginComponent>
            {/if}
        {/if}
        -->
        <TestChatComponent></TestChatComponent>

    </div>
</div>