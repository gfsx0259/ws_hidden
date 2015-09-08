core.apps.websemble_setup_site = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        image_height: 100,
        popup: false,
        cols: 3,
        spacing: 1,
        items_per_page: 9
    }
}


core.apps.websemble_setup_site.prototype = {


    onOpen: function() {
        this.is_data_loading = true;
        var r = {
            dialog: "websemble_site_templates"
        }
        core.transport.send("/controller.php", r, this.onSitesListResponse.bind(this));

        this.setTitle(this.profile["title"]);
        this.$["window"].style.overflow = "hidden";
    },



    onSitesListResponse: function(r) {
        if(r && r.status == "ok") {
            this.is_data_loading = false;

            this.$.content.innerHTML = "";
            this.data = r.data;
            this.buildModel(this.$.content, [
                { tag: "div",
                  id: "pager_top" },
                { tag: "div", 
                  className: "image_gallery", 
                  id: "image_gallery",
                  childs:[
                    { tag:"table", id:'table',
                      childs: [
                        { tag: "tbody", id: "table_body" }
                      ]}
                  ]},
                { tag: "div",
                  id: "pager_bottom" }
            ]);
            this.refresh();
        } else {
            this.$.content.innerHTML = "Server error";
        }
    },



    refresh: function() {
        if(this.is_data_loading) return;
        this.offset = 0;
        this.renderPage();

        if(this.data.length > this.profile.items_per_page) {
            this.showElements(["pager_top", "pager_bottom"]);
            if(!this.pagers) {
                var p = {
                    per_page: this.profile.items_per_page,
                    parent: this.$["pager_top"],
                    callback: this.setOffset.bind(this),
                    class_name: "pager"
                }
                this.pagers = { top: new core.objects.pager(p) };
                p.parent = this.$["pager_bottom"];
                this.pagers["bottom"] = new core.objects.pager(p);
            }
            this.pagers["top"].setData(this.offset, this.data.length, this.profile.items_per_page);
            this.pagers["bottom"].setData(this.offset, this.data.length, this.profile.items_per_page);
        } else {
            this.hideElements(["pager_top", "pager_bottom"]);
        }
    },



    setOffset: function(ofs) {
        this.offset = ofs;
        this.pagers["top"].setData(this.offset, this.data.length, this.profile.items_per_page);
        this.pagers["bottom"].setData(this.offset, this.data.length, this.profile.items_per_page);
        this.renderPage();
    },



    renderPage: function() {
        core.browser.element.removeChilds(this.$["table_body"]);
        var col_width = Math.floor(98/this.profile.cols) + "%",
            rows = Math.ceil(this.profile.items_per_page/this.profile.cols),
            m = [],
            mr,
            item_idx = 0,
            img_src,
            is_empty_cell,
            page_item,
            cell_m;


        for(var r=0; r<rows; r++) {
            mr = {
                tag: "tr",
                className: "row",
                childs: []
            }
            for(var c=0; c<this.profile.cols; c++) {
                var page_item = this.data[item_idx + this.offset]
                if(!page_item || item_idx >= this.profile.items_per_page) continue;


                cell_m = [
                    { tag: "img", className: "gallery_img",
                      events: { 
                        onclick: ["onItemClick", item_idx + this.offset] 
                      },
                      title: page_item.title,
                      src: "http://" + core.data.home_domain + "/var/admin_sites_thumbs/" + page_item.id + ".jpg",
                      style: { 
                        width: "auto",
                        height: this.profile.image_height + "px", 
                        cursor: "pointer"
                      }}
                ];


                mr.childs.push(
                    { tag: "td",
                      style: { width: col_width },
                      childs: [
                        { tag: "div", 
                          did:'div',
                          className: is_empty_cell ? "cell_div empty" : "cell_div",
                          style: { margin: this.profile.spacing + "px" },
                          childs: [
                            { tag: "div", className: "img_box",
                              childs: [
                                { tag: "div", className: "t",
                                  innerHTML: "<div class='tr'><div class='tc'></div></div>" },
                                { tag: "div", className: "m",
                                  childs: [
                                    { tag: "div", className: "mr",
                                      childs: [
                                        { tag: "div", className: "mc",
                                          childs: cell_m }
                                      ]}
                                  ]},
                                { tag: "div", className: "b",
                                  innerHTML: "<div class='br'><div class='bc'></div></div>" }
                              ]}
                          ]}
                      ]}
                );
                item_idx++;
            }
            m.push(mr);
        }
        this.buildModel(this.$.table_body, m);
    },



    onItemClick: function(e, idx) {
        if(this.data[idx]) {
            desktop.loadURL("http://" + core.data.home_domain + "/?dialog=setup_site&src_site_id=" + this.data[idx].id);
        }
    }

}
core.apps.websemble_setup_site.extendPrototype(core.components.html_component);
core.apps.websemble_setup_site.extendPrototype(core.components.desktop_app);