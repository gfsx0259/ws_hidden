core.apps.layout_row_settings = function() {};


core.apps.layout_row_settings.prototype = {

    window_resize: {
        height: 400,
        width: 670,
        target: "styles"
    },


    renderContent: function() {
        this.displayTpl(this.$.content, "layout_row_settings");

        if(!this.style_select) {
            this.style_select = new core.objects.style_select({
                parent_el: this.$.styles,
                callback: core.values.layout_row_settings.callback
            });
        }
        this.style_select.setParams({
            key: core.values.layout_row_settings.key,
            selected_style_id: core.values.layout_row_settings.style_id
        });
    },


    onShowContent: function() {
        var titles = {
            layout_row255: "footer",
            layout_row1: "body",
            layout_row0: "header"
        };
        this.setTitle("Select " + titles[core.values.layout_row_settings.key] + " row style");
    },


    onCancelClick: function() {
        desktop.hidePopupApp();
    }


};
core.apps.layout_row_settings.extendPrototype(core.components.html_component);
core.apps.layout_row_settings.extendPrototype(core.components.popup_app);