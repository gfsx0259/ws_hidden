core.apps.layout_document = function(args) {

    this.title = core.data.body_doc_title || "Document missed";
    this.callFunction("initAdmin");
    

}
core.apps.layout_document.extendPrototype(core.components.html_component);