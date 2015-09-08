core.apps.site_settings = function() {

    this.needCalCategoriesRefresh = true;

}


core.apps.site_settings.prototype = {


    getTitle: function() {
        return "Site settings";
    },


    renderContent: function() {
        this.displayTpl(this.$["content"], "site_settings");
        this.createPagesList();
        this.createTimezonesList();
        this.selectAdsTab("advertising");
        this.loadData();
    },



    // newsletter data
    loadData: function() {
        desktop.setState("loading");
        var r = {
            dialog: "site_settings",
            act: "get_data"
        }
        core.transport.send("/controller.php", r, this.onDataResponce.bind(this));
    },


    onDataResponce: function(res) {
        desktop.setState("normal");
        if(res && res.status == "ok") {
            this.createEmailsList(res.email_list)
            this.setData(res.data);
            this.showBar("emails");

            if(core.data.scheme["seo_analytics_code"] == 0) {
                this.hideElement("box_analytics_allowed");
                this.showElement("box_analytics_not_allowed");
            }
        } else {
            desktop.modal_dialog.alert("Server error.");
        }
    },



    // selects

    createTimezonesList: function() {
        var opts = [];
        for(var i=0; i<24; i++) {
            var t = i < 10 ? "0" + i : i;
            opts.push({ text: "+" + t + " UTC/GMT", value: t});
        }
        this.$["inp_timezone"].setOptions(opts);
    },


    createPagesList: function() {
        var pl = core.data.pages_list;
        var opts = [ { text: "...", value: "" } ];
        for(var i=0; i<pl.length; i++) {
            opts.push({ text: pl[i].name, value: pl[i].id });
        }
        this.$["inp_default_rows_page_id"].setOptions(opts);
    },


    createEmailsList: function(list) {
        var opts = [];
        if(!list.length) {
//            var opts = [ { text: "No emails...", value: "" } ];
        } else {
//            var opts = [ { text: "Select email...", value: "" } ];
            for(var i=0; i<list.length; i++) {
                opts.push({ text: list[i].email, value: list[i].email});
            }
        }
        this.$["inp_email_general"].setOptions(opts);
        this.$["inp_email_contact_us"].setOptions(opts);
        this.$["inp_email_webmaster"].setOptions(opts);
        this.$["inp_email_newsletter"].setOptions(opts);
        this.$["inp_email_sales"].setOptions(opts);
    },




    // bars code

    onBarClick: function(e) {
        e = core.browser.event.fix(e);
        var el = e.target;
        if(!el.bar_name) el = el.parentNode;
        el.blur();
        this.showBar(el.bar_name);
    },


    showBar: function(bar) {
        if(this.activeBar) {
            this.hideElement("content_" + this.activeBar);
            this.$["bar_" + this.activeBar].className = "";
        }
        this.activeBar = bar;
        this.showElement("content_" + bar);
        this.$["bar_" + bar].className = "active";
    },




    // ads section

    onAdsTabClick: function(e) {
        e = core.browser.event.fix(e);
        var el = e.target.key ? e.target : e.target.parentNode;
        el.blur();
        this.selectAdsTab(el.key);
    },


    selectAdsTab: function(tab) {
        if(this.active_tab) {
            this.hideElement("tab_" + this.active_tab);
            this.$["btn_tab_" + this.active_tab].className = "";
        }
        this.active_tab = tab;
        this.showElement("tab_" + this.active_tab);
        this.$["btn_tab_" + this.active_tab].className = "active";
    },





    // site header doc

    onSelectHeaderDocClick: function() {
        desktop.openTextsManager(this.onHeaderDocSelected.bind(this));    
    },

    onHeaderDocSelected: function(doc) {
        if(this.header_doc_id == doc.id) return;
        this.header_doc_id = doc.id;
        core.data.texts.get(doc.id, this.setHeaderDocPreview.bind(this));
    },

    setHeaderDocPreview: function(doc) {
        this.$["header_doc_preview"].innerHTML = doc.content;
    },

    onRemoveHeaderDocClick: function() {
        this.$["header_doc_preview"].innerHTML = "";
        this.header_doc_id = null;
    },


    // popup buttons


    onSaveClick: function(e) {
        var d = this.getData();
        var p = {
            dialog: "site_settings",
            act: "set_data",
            data: php_serialize(d)
        }
        core.transport.send("/controller.php", p, this.onDataSaved.bind(this), "POST");
        desktop.setState("loading");
    },


    onDataSaved: function(r) {
        desktop.setState("normal");
        if(r == "ok") {
            desktop.hidePopupApp();
            desktop.loadURL(location.href);
        } else {
            desktop.modal_dialog.alert("Server error");
        }
    },





    // values

    getData: function() {
        var d = {
            footer_code: this.$["inp_footer_code"].value.trim(),
            ads_code: this.$["inp_ads_code"].value.trim(),
            analytics_code: this.$["inp_analytics_code"].value.trim(),
            rss_title: this.$["inp_rss_title"].value.trim(),

            email_general: this.$["inp_email_general"].value,
            email_contact_us: this.$["inp_email_contact_us"].value,
            email_webmaster: this.$["inp_email_webmaster"].value,
            email_newsletter: this.$["inp_email_newsletter"].value,
            email_sales: this.$["inp_email_sales"].value,

            timezone: this.$["inp_timezone"].value,
            timezone_notes: this.$["inp_timezone_notes"].value.trim(),
            header_doc_id: this.header_doc_id || null,

            site_search_visible: this.$["inp_site_search_visible"].checked ? 1 : 0,
            breadcrumbs_visible: this.$["inp_breadcrumbs_visible"].checked ? 1 : 0,
            header_visible: this.$["inp_header_visible"].checked ? 1 : 0,
            footer_visible: this.$["inp_footer_visible"].checked ? 1 : 0,
            default_rows_page_id: this.$["inp_default_rows_page_id"].value
        }
        return d;
    },



    free_user_message: "Available only for paid accounts",

    setData: function(d) {
        this.$["inp_footer_code"].value = d.footer_code;
        this.$["inp_ads_code"].value =  d.ads_code;
        this.$["inp_analytics_code"].value = d.analytics_code;
        this.$["inp_rss_title"].value =  d.rss_title;
        this.$["inp_email_general"].setValue(d.email_general);
        this.$["inp_email_contact_us"].setValue(d.email_contact_us);
        this.$["inp_email_webmaster"].setValue(d.email_webmaster);
        this.$["inp_email_newsletter"].setValue(d.email_newsletter);
        this.$["inp_email_sales"].setValue(d.email_sales);

        this.$["inp_timezone"].setValue(d.timezone);
        this.$["inp_timezone_notes"].value = d.timezone_notes;
        this.header_doc_id = d.header_doc_id;
        if(d.header_doc_id && d.header_doc_id != 0) {
            this.$["header_doc_preview"].innerHTML = "Loading...";
            core.data.texts.get(d.header_doc_id, this.setHeaderDocPreview.bind(this));
        } else {
            this.$["header_doc_preview"].innerHTML = "";
        }

        this.$["inp_site_search_visible"].setChecked(d.site_search_visible == 1);
        this.$["inp_breadcrumbs_visible"].setChecked(d.breadcrumbs_visible == 1);
        this.$["inp_header_visible"].setChecked(d.header_visible == 1);
        this.$["inp_footer_visible"].setChecked(d.footer_visible == 1);

        this.$["inp_default_rows_page_id"].setValue(d.default_rows_page_id);
    }


}
core.apps.site_settings.extendPrototype(core.components.html_component);
core.apps.site_settings.extendPrototype(core.components.popup_app);