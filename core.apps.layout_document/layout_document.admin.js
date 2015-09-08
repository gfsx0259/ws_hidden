core.apps.layout_document.extendPrototype({

    initAdmin: function() {
        core.data.texts.addListener(core.data.body_doc_id, 1, this.setDocContent.bind(this));
    },

    setDocContent: function(doc) {
        $("body_doc_content").innerHTML = doc.content;
    }

});