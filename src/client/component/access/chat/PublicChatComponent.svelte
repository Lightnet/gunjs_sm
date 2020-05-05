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

    let chatmessage = "test";
    let gunchat;

    onMount(() => {
        elcomponent = document.getElementById(idcomponent);
        
        window.addEventListener('resize', handle_auto_resize);
        window.dispatchEvent(new Event('resize'));
        InitChat();
        setTimeout(()=>{
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('resize'));
            scrollPublicMessage();
        },1000);
    });

    onDestroy(()=>{
        window.removeEventListener('resize', handle_auto_resize);
        if(gunchat !=null){
            gunchat.off()
        }
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

    //https://gun.eco/docs/RAD
    async function InitChat(){
        console.log("Init Chat...")
        //$('#publicchatlist').empty();
        //document.getElementById('publicchatlist').innerHTML = "";
        let publicchatlist = document.getElementById('publicchatlist');
        publicchatlist.innerHTML = "";

        let encmsg = await SEA.work("public","chat"); //encrypttion key default?
        async function qcallback(data,key){
            //console.log('incoming messages...');
            //console.log("key",key);
            //console.log("data",data);
            if(data == null)return;
            if(data.message != null){
                let message = window.atob(data.message);
                //console.log(message);
                let dec = await SEA.decrypt(message,encmsg);
                //console.log(dec)
                if(dec!=null){
                    var div = document.createElement("div");
                    div.setAttribute("id",key);
                    //div.setAttribute("text", data.alias + ": " + dec);
                    div.innerHTML = data.alias + ": " + dec;
                    publicchatlist.appendChild(div);
                    /*
                    $('#publicchatlist').append($('<div/>', { 
                        id: key,
                        text : data.alias + ": " + dec
                    }));
                    */
                    scrollPublicMessage();
                }
            }
        }
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
        let date = ("0" +currentDate.getDate()).slice(-2);
        let timestring = year + "/" + month + "/" + date + ":";
        //console.log(timestring);
        if(gunchat !=null){
            gunchat.off()
        }
        gunchat = gun.get('chat');
        //gunchat.get({'.': {'*': '2019/08/'}}).map().once(qcallback);
        //gunchat.get({'.': {'*': timestring}}).map().once(qcallback);
        gunchat.get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
    }

    async function getchatmessage(){
        //console.log("test");
        console.log(chatmessage);

        let user = gun.user();
        if(!user.is){ return }//check if user exist
        let msg = (chatmessage || '').trim();
        if(!msg) return;//check if not id empty
        
        let encmsg = await SEA.work("public","chat");//encrypttion key default?
        //console.log(encmsg);
        let enc = await SEA.encrypt(msg,encmsg);
        //console.log(enc);
        let who = await user.get('alias').then();
        //console.log(who);
        //console.log(typeof enc)
        enc = window.btoa(enc);
        gun.get('chat').get(timestamp()).put({
            alias:who,
            message:enc
        });
        console.log("send message...");
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
        <label> Chat </label>
    </div>
    <div id={idcontent}>
        <div id="publicchatlist" class="messagetexts">
        </div>
        <div class="messageinput">
            <input on:keydown={handleKeydown} bind:value={chatmessage} placeholder="enter chat entere"> 
            <button on:click={getchatmessage}>Chat</button>
        </div>
    </div>
</div>