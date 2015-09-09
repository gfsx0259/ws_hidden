core.apps.multi_texts = function(args) {

    this.docs = null;
    this.defaultProfile = {
        title: "",
        app_style: "",
        tags: "",
        dates: "rolling",
        daysCount: 0,
        startDate: null,
        endDate: null,
        ids: []
    };
};



core.apps.multi_texts.prototype = {

    buildContent: function(el) {
    },

    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.renderDocs();
    },

    renderDocs: function() {
        this.$["content"].innerHTML = "";
        var texts = this.profile["ids"];
        for (var i = 0; i < texts.length; i++) {
            if (texts[i] != null) {
                this.buildModel( this.$["content"],
                    { tag: "div", id: "text" + texts[i] }
                );
                core.data.texts.get(texts[i], this.setDocContent.bind(this));
            }
        }
    },

    setDocContent: function(text) {
        if (!text) return;
        console.log(text);
        this.buildModel(this.$["text" + text.id], [
            { tag: "div", innerHTML: "Title will be here" },
            { tag: "div", innerHTML: "Date will be here" },
            { tag: "div", style: { borderBottom: "1px dotted #777"},
              innerHTML: text.content }
        ]);
    },

    getUsedTexts: function() {
        return this.profile["ids"];
    }
};
core.apps.multi_texts.extendPrototype(core.components.html_component);
core.apps.multi_texts.extendPrototype(core.components.desktop_app);
