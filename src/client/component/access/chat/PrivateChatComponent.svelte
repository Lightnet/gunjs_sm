<script>
    import { onMount, onDestroy } from 'svelte';
    import { onUserName } from '../../../mjs.js';
    import { gun } from '../../../mjs.js';
    import { generateId } from '../../../generateid';

    //let username = "Guest";
    //const onUserNameUnsubscribe = onUserName.subscribe(value => {
		//console.log(value);
		//username = value;
    //});
    
    let idcomponent = "chatlayout-" + generateId();
    let elcomponent;
    let idnav = "chatnav-" + generateId();
    let elnav;
    let idcontent = "chatcontent-" + generateId();
    let elcontent;

    let publickey;
    let privatesharekey;
    let privaterooms = [];
    let gunprivatechat;
    let privateroomkey;
    let selectprivatekey;
    let statusroom = "None";
    let chatmessages = [];

    let showjoinroom = true;
    let showaccessroom = false;

    let chatmessage = "test";
    let gunchat;

    let key;
	let keyCode;

	function inputhandleKeydown(event) {
		key = event.key;
        keyCode = event.keyCode;
        console.log("KEY:",key);
	}

    onMount(() => {
        elcomponent = document.getElementById(idcomponent);
        
        window.addEventListener('resize', handle_auto_resize);
        window.dispatchEvent(new Event('resize'));
        //InitChat();
        setTimeout(()=>{
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('resize'));
            scrollPublicMessage();
        },1000);
        updateprivatechatlist();
    });

    onDestroy(()=>{
        window.removeEventListener('resize', handle_auto_resize);
        if(gunchat !=null){
            gunchat.off()
        }
    });

    //PRIVATE CREATE ROOM
    async function btncreateprivateroom(){
        console.log("btnprivatechatcreate");
        let user = gun.user();// get user graph
        let pair = user._.sea;//user pair
        let genprivatechatid = Gun.text.random();//random string
        let gensharekey = Gun.text.random();//random string
        let pname = "private chat "+genprivatechatid;//id name
        let pdescription= "private chat";//id description
        let enc = await SEA.encrypt(gensharekey, pair);//encode key

        user.get('privatechatroom')
        .get(genprivatechatid).get('pri').put(enc);

        let dh = await SEA.secret(pair.epub, pair);
        enc = await SEA.encrypt(gensharekey, dh);

        user.get('privatechatroom')
        .get(genprivatechatid).get('pub').get(pair.pub).put(enc);

        user.get('privatechatroom')
        .get(genprivatechatid)
        .get('info')
        .put({
            pub:pair.pub,
            name:pname,
            description:pdescription,
            date:timestamp()
        });
        gun.get(genprivatechatid)
            .get('info')
            .put({
                pub:pair.pub,
                name:pname,
                description:pdescription,
                date:timestamp()
            });
        updateprivatechatlist();
    }

    //PRIVATE JOIN CHAT ROOM
    async function btnInitPrivateChat(){
        if(gunprivatechat !=null){
            gunprivatechat.off();
        }
        showjoinroom = false;

        chatmessages=[];
        //let privatekey = ($('#privatechatkey').val() || "").trim();
        let privatekey = (privateroomkey || "").trim();
        if(!privatekey)return;

        //let privatechatkey = privatekey;
        let user = gun.user();
        let pair = user._.sea;

        //GET ENC SHARE KEY
        let pub = await gun.get(privatekey).get('info').get('pub').then();
        let title = await gun.get(privatekey).get('info').get('name').then();
        console.log(pub , user.is.pub)
        if(pub == user.is.pub){
            console.log("OWNER");
            showaccessroom = true;
        }else{
            console.log("REFER");
        }

        let to = gun.user(pub);
        let epub =await to.get('epub').then();
        let encsharekey = await to.get('privatechatroom').get(privatekey).get('pub').get(pair.pub).then();
        //console.log(encsharekey);
        //let dh = await SEA.secret(pair.epub, pair);
        let dh = await SEA.secret(epub, pair);
        let dec = await SEA.decrypt(encsharekey, dh);
        console.log(dec);
        if(dec==null){
            console.log("NULL SHARE KEY!");
            return;
        }
        privatesharekey = dec;
        if(gunprivatechat !=null){
            gunprivatechat.off();
        }

        gunprivatechat = gun.get(privatekey);
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
        let date = ("0" +currentDate.getDate()).slice(-2);
        let timestring = year + "/" + month + "/" + date + ":";

        async function qcallback(data,key){
            console.log('incoming messages...');
            //console.log("key",key);
            //console.log("data",data);
            console.log(data);
            if(data == null)return;
            if(data.message != null){
                let message = window.atob(data.message);
                console.log(message);
                let decmsg = await SEA.decrypt(message,privatesharekey);
                if(decmsg!=null){
                    chatmessages.push({id:key, text: data.alias + ": " + decmsg});
                    chatmessages=chatmessages;
                    scrollPublicMessage();
                }
            }
        }

        //gunprivatechat.get('message').get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
        gunprivatechat.get('message').map().once(qcallback);
    }

    //PRIVATE ROOM UPDATE LIST
    function updateprivatechatlist(){
        //$('#privatechatroom').empty();
        //$('#privatechatroom').append($('<option selected disabled> -- Select Private Chat -- </option>'));
        let user = gun.user();
        privaterooms=[];
        user.get('privatechatroom').once().map().once(function(data,key){
            if(data !=null){
                addPrivateChat(key,data);
            }
        });
    }
    //PRIVATE ROOM ADD LIST
    async function addPrivateChat(index, data){
        let user = gun.user();
        console.log("add chat room list");
        //console.log(index);
        //console.log(data);
        let name = await user.get('privatechatroom').get(index).get('info').get('name').then();

        let bfound = false;

        for (let i = 0;i < privaterooms.length;i++   ){
            if(privaterooms[i].id == index){
                bfound=true;
                break;
            }
        }
        if(!bfound){
            privaterooms.push({
                id: index,
                value: index,
                text : name
            });
            privaterooms=privaterooms;
        }
        //$('#privatechatroom').append($('<option/>', { 
            //id: index,
            //value: index,
            //text : name
        //}));
    }

    function SelectPrivateChatRoom(){
        console.log("SELECTED");
        console.log(selectprivatekey);
        privateroomkey = selectprivatekey;
    }

    //PRIVATE ROOM LEAVE
    function btnleavePrivateChatRoom(){
        if(gunprivatechat !=null){
            gunprivatechat.off();
            gunprivatechat=null;
        }
        showjoinroom = true;
        showaccessroom = false;
        chatmessages=[];
        privateroomkey="";
        privatesharekey="";
    }
    //PRIVATE ROOM ADD
    async function btnprivateroomadd(){
        console.log("btnprivatechatadd");
        let user = gun.user();
        if(!user.is)return;
        //let privatekey = ($('#privatechatkey').val() || "").trim();
        let privatekey = (privateroomkey || "").trim();
        if(!privatekey)return;
        let gkey = await gun.get(privatekey).then();
        //console.log(gkey);
        if(gkey == undefined){
            console.log("NOT FOUND!");
            return;
        }
        let guninfo = gun.get(privatekey).get('info');
        let pub = await guninfo.get('pub').then();
        let title = await guninfo.get('name').then();
        let description = await guninfo.get('description').then();
        let date = await guninfo.get('date').then();
        //console.log(pub);console.log(title);console.log(date);
        user.get('privatechatroom').get(privatekey).get('info').put({
            pub:pub,
            name: title,
            description:description,
            date:date
        });
        updateprivatechatlist();
    }
    //PRIVATE ROOM REMOVE
    async function btnprivatechatremove(){
        console.log("btnprivatechatremove");
        let user = gun.user();
        if(!user.is)return;
        //let privatekey = ($('#privatechatkey').val() || "").trim();
        let privatekey = (privateroomkey || "").trim();
        if(!privatekey)return;
        let gkey = await gun.get(privatekey).then();
        if(gkey == undefined){
            console.log("NOT FOUND!");
            return;
        }
        user.get('privatechatroom').get(privatekey).put(null);
        updateprivatechatlist();
    }
    //PRIVATE GRANT USER
    async function btnprivatechatgrant(){
        console.log("btnprivatechatgrant");
        //let ppublickey = ($('#ppublickey').val() || "").trim();
        let ppublickey = publickey;
        if(!ppublickey)return;
        let pkey = (privateroomkey || "").trim();
        //check user pub key owner
        let pownid = await gun.get(pkey).get('info').get('pub').then();
        //console.log(pownid);console.log(ppublickey);
        if(pownid == ppublickey){
            console.log("owner");
            return;
        }
        let user = gun.user();
        let pair = user._.sea;
        let to = gun.user(ppublickey);

        let who = await to.get('alias').then();
        if(!who)return;
        
        if(!pkey)return;
        let pub = await to.get('pub').then();
        let epub = await to.get('epub').then();
        let dh = await SEA.secret(epub, pair);
        let enc = await SEA.encrypt(pkey, dh);

        user.get('privatechatroom')
            .get(pkey)
            .get('pub')
            .get(pub).put(enc);

        console.log(pkey);
        console.log("finish grant!");
    }
    //PRIVATE REVOKE USER 
    async function btnprivatechatrevoke(){
        console.log("btnprivatechatrevoke");
        //let ppublickey = ($('#ppublickey').val() || "").trim();
        let ppublickey = publickey;
        if(!ppublickey)return;
        let pkey = (privatesharekey || "").trim();
        //check user pub key owner
        let pownid = await gun.get(pkey).get('info').get('pub').then();
        if(pownid == ppublickey){
            console.log("owner");
            return;
        }
        let user = gun.user();
        let pair = user._.sea;
        let to = gun.user(ppublickey);
        let who = await to.get('alias').then();
        if(!who)return;
        if(!pkey)return;
        //need to generate new share key
        //user.get('privatechatroom')
            //.get(privatechatkey)
            //.get('pub').map().once(function(data,key){});

        let pub = await to.get('pub').then();
        user.get('privatechatroom')
            .get(pkey)
            .get('pub')
            .get(pub).put(null);
        console.log(pkey);
        console.log("finish revoke!");

    }
    //DIV RESIZE
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

    //https://gun.eco/docs/RAD
    // SEND CHAT MESSAGE
    async function getchatmessage(){
        //console.log("test");
        let user = gun.user();
        if(!user.is){ return }//check if user exist
        //let msg = ($('#inputprivatechat').val() || '').trim();
        let msg = (chatmessage || '').trim();
        let checkkey = (privatesharekey || "").trim();
        console.log(checkkey);
        if(!checkkey){
            console.log("EMPTY ROOM");
            return;
        }
        if(!msg) return;//check if not id empty
        let who = await user.get('alias').then();
        if(gunprivatechat !=null){
            let enc = await SEA.encrypt(msg, privatesharekey);
            enc = window.btoa(enc);//gun graph need to be string not SEA{} that will reject that is not soul of user
            gunprivatechat.get('message').set({
                alias:who,
                message:enc
            });
            /*
            gunprivatechat.get('message').get(timestamp()).put({
                alias:who,
                message:enc
            });
            */
        }
        console.log("send private chat...");
    }

    function handleKeydown(event) {
		let key = event.key;
        let keyCode = event.keyCode;
        //console.log(keyCode);
        //console.log(key);
        if(key == "Enter"){
            getchatmessage();
        }
	}
//https://svelte.dev/tutorial/svelte-window

    function timestamp(){
        let currentDate = new Date();
        //console.log(currentDate);
        let year = currentDate.getFullYear();
        let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
        let date = ("0" +currentDate.getDate()).slice(-2);
        let hour = ("0" +currentDate.getHours()).slice(-2);
        let minute = ("0" +currentDate.getMinutes()).slice(-2);
        let second = ("0" +currentDate.getSeconds()).slice(-2);
        let millisecond = currentDate.getMilliseconds();
        return year + "/" + (month) + "/" + date + ":" + hour+ ":" + minute+ ":" + second+ ":" + millisecond;        
    }

    function scrollPublicMessage(){
        let element = document.getElementById("publicchatlist");
        element.scrollTop = element.scrollHeight;
    }

</script>
<style>
.messagetexts{
    height: calc(100% - 24px);
    width: 100%;
    overflow-y: scroll;
}
.messageinput{
    height: 24px;
    width: 100%;
}
</style>

<div id={idcomponent} >
    <div id={idnav}>
        <label>Private Room: (WIP)</label>
        {#if showjoinroom}
            <button on:click={btncreateprivateroom}> Create </button>
            <select bind:value={selectprivatekey} on:change={SelectPrivateChatRoom}>
                <option selected disabled>-- Select Private Room --</option>
                {#each privaterooms as item}
                    <option value={item.id}> {item.text}</option>
                {/each}
            </select>
            <input bind:value={privateroomkey} on:keydown={inputhandleKeydown} placeholder="Private Chat Key" />
            <button on:click={btnprivateroomadd}>Add</button>
            <button on:click={btnprivatechatremove}>Remove</button>
            <button on:click={btnInitPrivateChat}>Join Room</button>
               
        {:else}
            {#if showaccessroom}
                <input bind:value={publickey} placeholder="Public Key"/>
                <button on:click={btnprivatechatgrant}>Grant</button>
                <button on:click={btnprivatechatrevoke}>Revoke</button>
            {/if}
            <button on:click={btnleavePrivateChatRoom}>Leave Room</button>
        {/if}
        <button>Options</button>
        
        <label> {statusroom} </label>

        <label>Private Key: {privateroomkey}</label>

    </div>
    <div id={idcontent}>
        <div id="publicchatlist" class="messagetexts">
            {#each chatmessages as item}
                <div id={item.id}> {item.text}</div>
            {/each}
        </div>
        <div class="messageinput">
            {#if showjoinroom==false}
                <input on:keydown={handleKeydown} bind:value={chatmessage} placeholder="enter chat entere"> 
                <button on:click={getchatmessage}>Chat</button>
            {/if}
        </div>
    </div>
</div>