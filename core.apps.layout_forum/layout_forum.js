core.apps.layout_forum = function(args) {


    if(core.data.main_menu_item && core.data.main_menu_item.title) {
        var ft = core.data.main_menu_item.title;
    } else {
        var ft = "Forum";
    }

    switch(core.data.forum_view) {

        case "categories":
            this.title = ft;
            break;

        case "category":
            this.title = [
                { title: ft, url: "/forum/" },
                core.data.forum_category ? core.data.forum_category.title : "Not found"
            ];
            break;

        case "topic":
            if(core.data.forum_category && core.data.forum_topic) {
                this.title = [
                    { title: ft, url: "/forum/" },
                    { title: core.data.forum_category.title, url: "/forum/?view=category&id=" + core.data.forum_category.id },
                    core.data.forum_topic.title
                ];
            } else {
                this.title = [
                    { title: ft, url: "/forum/" },
                    "Not found"
                ];
            }
            break;
    }

};

core.apps.layout_forum.prototype = {

    $: {},

    doc_elements: [
        "forum_content",
        "forum_post_editor",
        "inp_post_title",
        "inp_post_content",
        "msg_post_error"
    ],



    run: function() {
        var list = this.doc_elements.concat(this.doc_elements_admin);
        for(var i=0; i<list.length; i++) {
            var k = list[i];
            this.$[k] = document.getElementById(k);
        }
    },






    // post editor

    // mode: "edit" | "new"
    showPostEditor: function(mode) {
        if(!mode) {
            desktop.modal_dialog.alert("Editor mode not defined");
            return;
        }
        this.hideElement("forum_content");
        this.showElement("forum_post_editor");

        this.post_editor_mode = mode;

        var t,c;

        switch(mode) {
            case "new_topic":
                t = "";
                c = "";
                break;

            case "edit_topic":
                t = core.data.forum_topic.title;
                c = core.data.forum_topic.content;
                break;

            case "new_reply":
                break;
        }

        this.$["inp_post_title"].value = t;
        this.$["inp_post_content"].value = c.replace(/(<br>)/g, "").replace(/(<br\s*\/>)/gi,"");
    },


    hidePostEditor: function() {
        this.showElement("forum_content");
        this.hideElement("forum_post_editor");
    },


    savePostEditor: function() {
        var t = this.$["inp_post_title"].value.trim();
        if(t == "") {
            this.showPostError("Title not entered");
            return;
        }
        var c = this.$["inp_post_content"].value.trim();
        if(c == "") {
            this.showPostError("Content not entered");
            return;
        }

        desktop.setState("loading");
//        this.hideElement("post_editor_controls");
//        this.showElement("msg_post_saving");

        var p = {
            dialog: "forum",
            act: this.post_editor_mode,
            title: t,
            content: c,
            category_id: core.data.forum_category.id
        };


        switch(this.post_editor_mode) {
            case "new_topic":
                break;

            case "edit_topic":
                p.id = core.data.forum_topic.id;
                break;

            case "new_reply":
                p.topic_id = core.data.forum_topic.id;
                p.to_reply_id = this.to_reply_id;
                break;
        }

//        core.transport.send("/controller.php", p, this.onPostResponce.bind(this));
        core.transport.send("/controller.php", p, this.onPostResponce.bind(this), "POST");
    },



    onPostResponce: function(r) {
//        this.hideElement("msg_post_saving");
        if(!r) {
            this.showPostError("Server error");
            return;
        } else if(r.status == "error_title") {
            desktop.setState("normal");
//            this.showElement("post_editor_controls");
            this.showPostError("Title not entered");
            return;
        } else if(r.status == "error_content") {
//            this.showElement("post_editor_controls");
            desktop.setState("normal");
            this.showPostError("Content not entered");        
            return;
        }

        switch(this.post_editor_mode) {
            case "new_topic":
            case "edit_topic":
                desktop.loadURL("/forum/?view=topic&id=" + r.id);
                break;

            default:
                desktop.loadURL(location.href);
                break;
        }
    },



    showPostError: function(msg) {
        if(!msg) {
            this.hideElement("msg_post_error");
        } else {
            this.showElement("msg_post_error");
            this.$["msg_post_error"].innerHTML = msg;
        }
    },




    // topic

    deleteTopic: function() {
        desktop.modal_dialog.confirm("Delete topic?", this.deleteTopicConfirmed.bind(this))
    },


    deleteTopicConfirmed: function () {
    desktop.setState("loading");

        var p = {
            dialog: "forum",
            act: "delete_topic",
            id: core.data.forum_topic.id,
            category_id: core.data.forum_category.id
        };
//        core.transport.send("/controller.php", p, this.onTopicDeleteResponce.bind(this));
        core.transport.send("/controller.php", p, this.onTopicDeleteResponce.bind(this), "POST");
    },


    onTopicDeleteResponce: function(r) {
        if(!r || r.status == "error") {
            desktop.setState("normal");
            desktop.modal_dialog.alert("Error");
        } else {
            desktop.loadURL("/forum/?view=category&id=" + r.category_id);
        }
    },




    // replies

    replyTo: function(id) {
        this.hideElement("forum_content");
        this.showElement("forum_post_editor");

        this.post_editor_mode = "new_reply";
        this.to_reply_id = id;
        this.$["inp_post_title"].value = "Re: " + document.getElementById("forum_post_title" + id).innerHTML;
        this.$["inp_post_content"].value = "";
    }



};
core.apps.layout_forum.extendPrototype(core.components.html_component);