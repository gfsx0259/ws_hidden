core.apps.layout_forum.extendPrototype({


    // common

    doc_elements_admin: [
        "forum_categories",
        "forum_categories_editor",
        "forum_categories_list"
    ],




    // categories editor

    showCategoriesEditor: function(e) {
        this.showElement("forum_categories_editor");
        this.hideElement("forum_categories");

        this.deleted_categories = [];
        this.max_order_id = 0;
        this.categories = clone(core.data.forum_categories);

        if(this.categories.length > 0) {
            this.$["forum_categories_list"].innerHTML = "";
            for(var i=0; i<this.categories.length; i++) {
                var c = this.categories[i];
                if(c.order_id > this.max_order_id) {
                    this.max_order_id = c.order_id;
                }
                this.renderCategory(i);
            }
        } else {
            this.$["forum_categories_list"].innerHTML = "List empty";
        }
    },



    hideCategoriesEditor: function() {
        this.hideElement("forum_categories_editor");
        this.showElement("forum_categories");
    },



    renderCategory: function(idx) {
        var c = this.categories[idx];
        this.buildModel(this.$["forum_categories_list"],
            { tag: "div", className: "category_editor_wrapper",
              childs: [
                { tag: "div", className: "forum_editor",
                  id: "category" + idx,
                  childs: [
                    { tag: "div", className: "inputs",
                      childs: [
                        { tag: "label", innerHTML: "Title:" },
                        { tag: "div", className: "input_wrapper",
                          childs: [
                            { tag: "input", id: "inp_category_title" + idx,
                              events: { onblur: [ "setCategoryTitle", idx ] },
                              value: c.title }
                          ]},
                        { tag: "label", innerHTML: "Description:" },
                        { tag: "div", className: "input_wrapper",
                          childs: [
                            { tag: "textarea", id: "inp_category_description" + idx,
                              events: { onblur: [ "setCategoryDescription", idx ] },
                              value: c.description }
                          ]}
                      ]},
                    { tag: "div", className: "controls",
                      childs: [
                        { tag: "button", className: "move_up",
                          events: { onclick: [ "moveCategory", [idx, "up"] ] },
                          innerHTML: "Move up" },
                        { tag: "button", className: "move_up",
                          events: { onclick: [ "moveCategory", [idx, "down"] ] },
                          innerHTML: "Move down" },
                        { tag: "button", className: "move_up",
                          events: { onclick: [ "deleteCategory", idx ] },
                          innerHTML: "Delete" }
                      ]}
                ]}
            ]}
        );
    },


    // collect values

    setCategoryTitle: function(e, idx) {
        this.categories[idx].title = this.$["inp_category_title" + idx].value.trim().substr(0, 120);
    },


    setCategoryDescription: function(e, idx) {
        this.categories[idx].description = this.$["inp_category_description" + idx].value.trim();
    },




    // TODO: �� �㦭�?
    updateCategoriesControls: function() {
    /*
        for(var i=0; i<this.categories.length; i++) {
            var c = this.categories[i];        
        }
        */
    },



    // manage categories

    addCategory: function() {
        if(!this.categories.length) {
            this.$["forum_categories_list"].innerHTML = "";
        }

        this.max_order_id++;
        var c = {
            id: -1,
            // TODO: remove counter
            title: "New category" + this.categories.length,
            description: "",
            order_id: this.max_order_id
        };
        this.categories.push(c);
        this.renderCategory(this.categories.length - 1);
        this.updateCategoriesControls();
    },


    moveCategory: function(e, args) {
        var idx = args[0];
        var dir = args[1];
        if((idx == 0 && dir == "up") || (idx == this.categories.length - 1 && dir == "down")) return;
        if(dir == "up") {
            var a = idx - 1;
            var b = idx;
        } else {
            var a = idx;
            var b = idx + 1;
        }
        swapValues(this.categories, a, b);
        var tmp = this.categories[a].order_id;
        this.categories[a].order_id = this.categories[b].order_id;
        this.categories[b].order_id = tmp;

        for(var i=a; i<=b; i++) {
            this.$["inp_category_title" + i].value = this.categories[i].title;
            this.$["inp_category_description" + i].value = this.categories[i].description;
        }
    },


    deleteCategory: function(e, idx) {
        desktop.modal_dialog.confirm(
            "Delete category '" + this.categories[idx].title + "' ?",
            this.deleteCategoryConfirmed.bind(this, idx)
        );
    },

    deleteCategoryConfirmed: function(idx) {
        var c = this.categories[idx];
        if(c.id != undefined) {
            this.deleted_categories.push(c.id);
        }
        this.categories.splice(idx, 1);

        core.browser.element.remove(this.$["category" + this.categories.length]);

        if(this.categories.length == 0) {
            this.$["forum_categories_list"].innerHTML = "Empty list";
        } else {
            for(var i=idx; i<this.categories.length; i++) {
                var c = this.categories[i];
                this.$["inp_category_title" + i].value = c.title;
                this.$["inp_category_description" + i].value = c.description;
            }
        }
    },



    // save categories
    saveCategories: function() {
        desktop.setState("loading");
        var p = {
            dialog: "forum",
            act: "update_categories",
            data: php_serialize(this.categories),
            del: php_serialize(this.deleted_categories)
        };
        core.transport.send("/controller.php", p, this.onCategoriesUpdated.bind(this), "POST");
    },


    onCategoriesUpdated: function(r) {
        if(!r || r.status != "success") {
            desktop.setState("normal");
            desktop.modal_dialog.alert("Server error");
        } else {
            desktop.loadURL("/forum/");
        }
    }



});