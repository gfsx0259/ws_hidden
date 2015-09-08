core.apps.upgrade_browser = function() {

    this.displayTpl(document.body, "upgrade_browser_box");

}
                                    

core.apps.upgrade_browser.prototype = {

    onHideClick: function() {
        this.hideElement("window");
    }

}
core.apps.upgrade_browser.extendPrototype(core.components.html_component);