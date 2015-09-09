core.apps.layout_no_page = function(args) {

    this.title = "Page not found";

    args.parentElement.innerHTML = "<div class='no_columns'>Page not found.</div>";

};
core.apps.layout_no_page.extendPrototype(core.components.html_component);