core.apps.layout_newsletter = function(args) {


    var el = document.getElementById("newsletter_content");
    if(el) {
        this.title = [ 
            { title: "Newsletters", url: "/newsletter/" },
            el.getAttribute("date")
        ];
    } else {
        this.title = "Newsletters";
    }

}
core.apps.layout_newsletter.extendPrototype(core.components.html_component);