core.apps.send_emails_to_friends = function() {
    var activeKey='';
    var message=false;
    var loadTemplateFlag=0;
    if(!core.data.email_templates) {
        core.data.email_templates = {};
    }
}


core.apps.send_emails_to_friends.prototype = {


    getTitle: function() {
        return "Send Email To Friends or Contacts";
    },


    renderContent: function() {
        this.displayTpl(this.$["content"], "send_emails_to_friends");
        this.loadSendToFriendEmail(); 
        if(this.message!=null&&this.message!=undefined&&this.message)
        {
            this.message=false;
            this.$["send_to_friend_email_message"].style.display='';
        }
        else
            this.$["send_to_friend_email_message"].style.display='none';
    },
    onEditMode: function(){
        this.$["added_recipients_emails"].contentEditable=true;
        //this.$["added_recipients_emails"].focus();
    },
    loadSendToFriendEmail:function()
    {
         desktop.setState("loading");
            var p = {
                dialog: "emails_manager",
                act: "get_template",
                key: "tell_to_friends%"
            }
            this.loadTemplateFlag=1;
            core.transport.send("/controller.php", p, this.onGetTemplateResponce.bind(this));
    },
    onChangeTemplate:function(r){
        this.$["send_to_friend_email_message"].style.display='none';
        var k=this.$["send_to_friend_template"][this.$["send_to_friend_template"].selectedIndex].value;
        if(k!='')
        {
             desktop.setState("loading");
             this.$["send_email_to_freinds_manager_panel"].className="send_email_to_freinds_manager";
             this.$["send_to_friend_email_subject_panel"].style.display='';
            this.$["send_to_friend_email_body_panel"].style.display='';
            this.$["send_to_friend_email_placeholder_panel"].style.display='';
            this.$["send_to_friend_template"].style.width="450px";
                var p = {
                    dialog: "emails_manager",
                    act: "get_template",
                    key: k
                }
                this.loadTemplateFlag=0;
                core.transport.send("/controller.php", p, this.onGetTemplateResponce.bind(this));
        }
        else
        {
             this.$["send_email_to_freinds_manager_panel"].className="send_email_to_freinds_manager1";
             this.$["send_to_friend_template"].style.width="620px";
            this.$["send_to_friend_email_subject_panel"].style.display='none';
            this.$["send_to_friend_email_body_panel"].style.display='none';
            this.$["send_to_friend_email_placeholder_panel"].style.display='none';
        }
    },
    hideShowRecipientSection: function(){
        this.$["send_to_friend_email_message"].style.display='none';
        if(this.$["send_to_all_user_option"].checked)
        {
            this.$["send_email_to_freinds_add_res_sec"].style.visibility='hidden';
            this.$["send_email_to_freinds_check_res_sec"].style.visibility='hidden';
        }
        else
        {
            this.$["send_email_to_freinds_add_res_sec"].style.visibility='visible';
            this.$["send_email_to_freinds_check_res_sec"].style.visibility='visible';
        }
    },
    onGetTemplateResponce: function(r) {
        desktop.setState("normal");
        if(!r || r.status != "ok") return;
        core.data.email_templates[r.key] = r.data;
        this.activeKey=r.data.key;
        if(this.loadTemplateFlag)
        {
            this.$["send_email_to_freinds_user_count"].innerHTML="("+r.users.length+")";
            this.loadTemplates(r.emails);
        }
        this.editTemplate(r.key);
        var k=this.$["send_to_friend_template"][this.$["send_to_friend_template"].selectedIndex].value;
    },
    loadTemplates:function(temps){
        for(counter=0;counter<this.$["send_to_friend_template"].length;counter++)
            this.$["send_to_friend_template"].remove(counter);
        this.$["send_to_friend_template"].options.add(new Option("Select",""));
        var counter=0;
        for(var temp in temps)
        {
            counter++;          
            this.$["send_to_friend_template"].options.add(new Option(temps[temp].name,""+temps[temp].key));          
        }
        
    },
    editTemplate: function(key) { 
        var tpl = core.data.email_templates[key];
        if(tpl.subject!=undefined)
            this.$["inp_send_to_friend_email_subject"].value = tpl.subject;
        else
            this.$["inp_send_to_friend_email_subject"].value = tpl.default_subject;
        if(tpl.body!=undefined)
            this.$["inp_send_to_friend_email_body"].value = tpl.body;
        else
            this.$["inp_send_to_friend_email_body"].value = tpl.default_body;
        //this.$["inp_send_to_friend_email_subject"].focus();

        // render placeholders list
        this.$["send_to_friend_email_keys"].innerHTML = "";
        var plist =tpl.placeholders.split(",");
        for(var i=0; i<plist.length; i++) {
            var pname = "{" + plist[i] + "}";
            this.buildModel(this.$["send_to_friend_email_keys"],
                { tag: "div", className: "key",
                  events: { onclick: [ "insertPlaceholder", pname ] },
                  innerHTML: pname }
            );
        }
    },
    onFocusUserNameBox:function(){
        if(this.$["username_txt_box"].value=='Type name here...')
        {
            this.$["username_txt_box"].value="";
            this.$["username_txt_box"].className="send_email_to_freinds_textbox1";
        }
    },
    onFocusEmailBox:function(){
        if(this.$["email_txt_box"].value=='Type email address here...')
        {
            this.$["email_txt_box"].value="";
            this.$["email_txt_box"].className="send_email_to_freinds_textbox1";
        }
    },
    onAddRecipient:function(){
        this.$["send_to_friend_email_message"].style.display='none';
        if(this.$["username_txt_box"].value!=""&&this.$["username_txt_box"].value!="Type name here..."&&this.$["email_txt_box"].value!=''&&this.$["email_txt_box"].value!="Type email address here...")
        {        

            this.$["added_recipients_emails"].innerHTML+=this.$["username_txt_box"].value+"&lt;"+this.$["email_txt_box"].value+"&gt;"+"; ";   
            this.$["send_email_to_freinds_edit_button"].style.display='';
            this.$["username_txt_box"].value="Type name here...";
            this.$["email_txt_box"].value="Type email address here...";
            this.$["username_txt_box"].className="send_email_to_freinds_textbox";
            this.$["email_txt_box"].className="send_email_to_freinds_textbox";
        }
    },
    addEmailConrol: function(e){
        var inputBoxObj=document.createElement('input');
        inputBoxObj.setAttribute("type","text");
        inputBoxObj.setAttribute("class","inp_send_to___friend_email_address");
        this.$["friend_email_panel"].appendChild(inputBoxObj);
    },
    removeEmailConrol: function(e){
        var objs=document.getElementsByClassName('inp_send_to___friend_email_address');
        if(objs.length>1)
        {
            var obj=objs[objs.length-1];
            obj.parentNode.removeChild(obj);
        }
    },
    onSendClick:function(){
        var emailStr=this.$["added_recipients_emails"].innerHTML;
        emailStr=emailStr.replace(/&lt;/g,"<");
        emailStr=emailStr.replace(/&gt;/g,">");
        //emailStr=emailStr.replace(/[\s]+/g,"");
        emailStr=emailStr.replace(/<br>+/gi,"");
        emailStr=emailStr.replace(/<br\/>+/gi,"");
        emailStr=emailStr.replace(/&nbsp;+/gi,"");
        /*var email_array=emailStr.split(';');
        var email_user_objs=new Array();
        var obj_counter=0;
        for(var counter=0;counter<email_array.length;counter++)
        {
            var email_user_str=email_array[counter].replace(/>/g,"");
            var email_user_array=email_user_str.split('<');
            if(email_user_array.length>1)
            {
                var username=email_user_array[0].trim();
                var email=email_user_array[1].trim();
                if(username!=''&&email!='')
                {
                    
                    email_user_objs[obj_counter]={name:username,emailaddress:email};
                    obj_counter++;
                }
            }
        }*/
        var send_to_user=this.$["send_to_all_user_option"].checked;
        var add_to_recipients=this.$["add_to_recipient_option"].checked;
        /*desktop.modal_dialog.alert(dump(email_user_objs));
        return false;
        var objs=document.getElementsByClassName('inp_send_to___friend_email_address');
        var _emails="";
        for(var counter=0;counter<objs.length;counter++)
        {
            if(_emails=='')
                _emails=objs[counter].value;
            else
                _emails=_emails+";"+objs[counter].value;
        }*/
         desktop.setState("loading");
            var p = {
                dialog: "newsletter",
                act: "send_email_to_freinds",
                subject:this.$["inp_send_to_friend_email_subject"].value,
                emailbody:this.$["inp_send_to_friend_email_body"].value,
                sendtouser:send_to_user,
                addtorecipients:add_to_recipients,
                emails: emailStr
            }
            core.transport.send("/controller.php", p, this.onEmailsStatus.bind(this));



    },
    onEmailsStatus:function(status){
        desktop.setState("normal");
        /*var msg="";
        for(email in status)
            msg+="Status of "+email+" is :: "+status[email]+"\n";
        desktop.modal_dialog.alert(msg);*/
        this.message=true;
        this.$["content"].innerHTML='';
        this.renderContent();
        //desktop.hidePopupApp();
        /*if(status=="ok")
            desktop.modal_dialog.alert('Email Successfully Send');
        else
            desktop.modal_dialog.alert('Error during sending the emails');*/
    },
    setActiveInput: function(e) {
        e = core.browser.event.fix(e);
        this.active_input = e.target;
    },
     insertPlaceholder: function(e, key) {
        e = core.browser.event.fix(e);
        e.target.blur();
        if(!this.active_input) return;
        var o = this.active_input;
        if(document.all&&document.selection) {          
            o.focus();
            var range = document.selection.createRange();
            if(typeof range.text == 'string')
                document.selection.createRange().text =document.selection.createRange().text+key;
        } else {
            if(o.setSelectionRange) {
                var rangeStart = o.selectionStart;
                var rangeEnd = o.selectionEnd;
                var tempStr1 = o.value.substring(0,rangeStart);
                var tempStr2 = o.value.substring(rangeEnd);
                o.value = tempStr1 + key + tempStr2;
            }
        }
    },
    /* insertPlaceholder: function(e, key) {
        e = core.browser.event.fix(e);
        e.target.blur();
        if(!this.active_input) return;
        var o = this.active_input;
        if(document.all) {
            if(o.createTextRange && o.caretPos) {
                var caretPos = o.caretPos;
                caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? key + ' ' : key;
            } else {
                o.value = key;
            }
        } else {
            if(o.setSelectionRange) {
                var rangeStart = o.selectionStart;
                var rangeEnd = o.selectionEnd;
                var tempStr1 = o.value.substring(0,rangeStart);
                var tempStr2 = o.value.substring(rangeEnd);
                o.value = tempStr1 + key + tempStr2;
            }
        }
    },*/
    onCancelClick: function(e) {
        desktop.hidePopupApp();
    }


}
core.apps.send_emails_to_friends.extendPrototype(core.components.html_component);
core.apps.send_emails_to_friends.extendPrototype(core.components.popup_app);