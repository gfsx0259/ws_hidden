core.apps.layout_app_styler = function() {

}

core.apps.layout_app_styler.prototype = {


    getTitle: function() {
        return "Select style";
    },

    renderContent: function() {
        this.displayTpl(this.$["content"], "layout_app_styler");
    },


    onShowContent: function() {
        this.data = core.values.layout_app_styler;
        this.renderList();
    },



    renderList: function() {
        var content_el = this.$["content"];
        var caption = "<h3>Block caption</h3>";
        var el = this.$["list"];
        el.innerHTML = "";
        for(var i=0; i<core.values.app_styles.length; i++) {
            var s = core.values.app_styles[i].style;
            var box = this.buildModel(el, 
                { tag: "div", className: "item", 
                  events: { onclick: ["onItemClick", i ] } }
            );

            this.displayTpl(box, "app_window");
            this.$["window"].className = "app " + s;
            this.$["caption"].innerHTML = caption;
            this.$["content"].innerHTML = "Block content";
            if(s == this.data.app_style) {
                this.buildModel(box, { tag: "div", className: "active_icon" });
            }
        }
        this.$["content"] = content_el;
    },



    onItemClick: function(e, idx) {
        this.setStyle(core.values.app_styles[idx].style);
    },


    setStyle: function(v) {
        this.data.callback(v);
        desktop.hidePopupApp();
    }

}
core.apps.layout_app_styler.extendPrototype(core.components.html_component);
core.apps.layout_app_styler.extendPrototype(core.components.popup_app);