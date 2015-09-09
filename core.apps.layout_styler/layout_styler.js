core.apps.layout_styler = function() {

};

core.apps.layout_styler.prototype = {

    mark_html: "<div class='active_icon'></div>",

    getTitle: function() {
        return "Select style";
    },

    renderContent: function() {
        this.displayTpl(this.$["content"], "layout_styler");
    },


    onShowContent: function() {
        var v = core.values.layout_styler;
        this.pos = v.pos;
        if(this.pos.col != undefined) {
            this.mode = "col";
            this.data = clone(v.col_data);
            this.src_data = v.col_data;
            this.row_data = v.row_data;
            this.src_styles = core.values.cell_styles;
        } else {
            this.mode = "row";
            this.data = clone(v.row_data);
            this.src_data = v.row_data;
            this.src_styles = core.values.row_styles;
        }

        this.renderStyles();
        this.renderBgImg();
        if(!this.data.title) this.data.title = "";
        this.$["inp_title"].value = this.data.title;
        if(this.data.style == "background" || this.src_styles.length == 0) {
            this.selectTab("bg_image");
        } else {
            this.selectTab("styles_list");
        }
    },


    renderStyles: function() {
        if(this.mode == "col") {
            this.renderCellStyles();
        } else {
            this.renderRowStyles();
        }
    },


    // tabs

    onTabClick: function(e) {
        e = core.browser.event.fix(e);
        var el = e.target.key ? e.target : e.target.parentNode;
        el.blur();
        this.selectTab(el.key);
    },


    selectTab: function(tab) {
        if(this.active_tab) {
            this.hideElement("tab_" + this.active_tab);
            this.$["btn_tab_" + this.active_tab].className = "";
        }
        this.active_tab = tab;
        this.showElement("tab_" + this.active_tab);
        this.$["btn_tab_" + this.active_tab].className = "active";
    },




    // cell styles list

    cell_html: 
        "<div class='lcell_tl'><div class='lcell_tr'><div class='lcell_tc'></div></div></div>" +
        "<div class='lcell_ml'><div class='lcell_mr'><div class='lcell_mc'></div></div></div>" +
        "<div class='lcell_bl'><div class='lcell_br'><div class='lcell_bc'></div></div></div>",


    renderCellStyles: function() {
        var el = this.$["tab_styles_list"];
        if(this.src_styles.length) {
            var m = { tag: "div", childs: [] };

            if(this.row_data.style == "background") {
                m.style = { background: "url(" + core.common.getUserFile(this.row_data.background, 1) + ") repeat" };
                var s = ""; 
            } else {
                var s = this.row_data.style;
            }
            m.className = "layout_row_box " + (this.pos.row == 0 ? "layout_first_row " : "") + s;
            for(var i=0; i<this.src_styles.length; i++) {
                var s = this.src_styles[i].style;
                m.childs.push(
                    { tag: "div", 
                      className: "layout_cell " + s + " item",
                      style: { width: "25%" },
                      events: { onclick: [ "onSelectStyleClick", i ]},
                      innerHTML: this.cell_html + (s == this.data.style ? this.mark_html : "") }
                );
            }
            el.innerHTML = "";
            this.buildModel(el, m);
        } else {
            el.innerHTML = "No styles available";            
        }
    },



    // row styles list
    row_html: "<div class='layout_row'></div>",

    renderRowStyles: function() {
        var el = this.$["tab_styles_list"];
        if(this.src_styles.length) {
            var m = { tag: "div", childs: [] };
            for(var i=0; i<this.src_styles.length; i++) {
                var s = this.src_styles[i].style;
                m.childs.push(
                    { tag: "div", className: "style_preview_box",
                      events: { onclick: [ "onSelectStyleClick", i ]},
                      childs: [
                        { tag: "div", className: "style_title",
                          innerHTML: this.src_styles[i].title },
                        { tag: "div", 
                          innerHTML: this.row_html + (s == this.data.style ? this.mark_html : ""),
                          className: "layout_row_box " + s + " item" }
                      ]}
                );
            }
            el.innerHTML = "";
            this.buildModel(el, m);
        } else {
            el.innerHTML = "No styles available";            
        }
    },



    // common
    
    onSelectStyleClick: function(e, idx) {
        this.data.style = this.src_styles[idx].style;

        this.data.background = "";
        this.saveData();
    },


    // bg image

    renderBgImg: function() {
        this.$["img_preview"].style.background = 
            this.data.background ? 
            "url(" + core.common.getUserFile(this.data.background) + ")" : "";
    },

    onSelectImageClick: function() {
        desktop.openFilesManager(this.onImageSelected.bind(this), "pictures")
    },

    onImageSelected: function(f) {
        this.data.style = "background";
        this.data.background = f;
        this.saveData();
    },



    // botom buttons

    onClearClick: function() {
        this.data.style = "";
        this.data.background = "";
        this.data.title = "";
        this.saveData();
    },


    onSaveClick: function() {
        this.data.title = this.$["inp_title"].value.trim();
        this.saveData();
    },


    // sys

    saveData: function() {
        if(this.data.style != this.src_data.style ||
           this.data.background != this.src_data.background ||
           this.data.title != this.src_data.title) {
            if(this.mode == "col") {
                desktop.layout.rows[this.pos.row].setCellSettings(this.pos.col, this.data)
            } else {
                desktop.layout.rows[this.pos.row].setRowSettings(this.data);
            }
            desktop.layout.savePage();
        }
        desktop.hidePopupApp();
    }

};
core.apps.layout_styler.extendPrototype(core.components.html_component);
core.apps.layout_styler.extendPrototype(core.components.popup_app);