core.apps.layout_store = function(args) {
    
    if(core.data.main_menu_item && core.data.main_menu_item.title) {
        var mt = core.data.main_menu_item.title;
    } else {
        var mt = "Store";
    }

    var sp = core.data.store_path;
    if(sp && sp.length) {
        this.title = [
            { title: mt, url: "/store/" }
        ];
        for(var i=0; i<sp.length; i++) {
            this.title.push({ title: sp[i].title, url: "/store/?view=category&cid=" + sp[i].id });
        }
        var p = core.data.store_product;
        if(p) {
            this.title.push(p.id ? p.name : "Product not found");
        }
    } else {
        this.title = mt;
    }

};




core.apps.layout_store.prototype = {

    $: {},

    doc_elements: [
        "product_form",
        "product_add_to_cart",
        "product_qty"
    ],



    run: function() {
        var list = this.doc_elements.concat(this.doc_elements_admin);
        for(var i=0; i<list.length; i++) {
            var k = list[i];
            this.$[k] = document.getElementById(k);
        }

        var p = core.data.store_product;
        if(p) {
            this.showForm(p.form_id);
        }
    },




    // product form

    showForm: function(fid) {
        fid = parseInt(fid);
        if(!fid) return;

        this.initForm();
        if(!core.data.forms || !core.data.forms[fid]) {
            this.loadForm(fid);
            return;
        }
        this.form.setStructure(core.data.forms[fid]);
        this.$["product_form"].innerHTML = "";
        this.form.render();
    },


    initForm: function() {
        if(this.form) return;
        this.form = new core.objects.form();
        var fp = {
            parent_el: this.$["product_form"],
            disable_submit: true
        };
        this.form.setProperties(fp);
    },


    loadForm: function(fid) {
        this.$["product_add_to_cart"].disabled = true;

        this.$["product_form"].innerHTML = "Loading...";
        var p = {
            dialog: "forms_manager",
            act: "get",
            id: fid
        };
        core.transport.send("/controller.php", p, this.onFormDataResponce.bind(this));        
    },


    onFormDataResponce: function(r) {
        this.$["product_add_to_cart"].disabled = false;

        if(!r || r.status != "ok") return;

        if(!core.data.forms) {
            core.data.forms = {}
        }
        core.data.forms[r.form_id] = r.form;
        this.showForm(r.form_id);
    },



    // product qty

    onQtyChanged: function() {
        var v = parseInt(this.$["product_qty"].value, 10) || 1;
        this.$["product_qty"].value = v;
    },



    // cart

    onBtnClick_AddToCart: function() {
        var product = core.data.store_product;
        if(!product) return;

        var fid = parseInt(product.form_id);
        if(fid) {
            if(!this.form.checkRequiredFields(true)) return;
            var form_data = this.form.collectHTMLValues();
        } else {
            var form_data = "";
        }

        var variations = [];
        for(var i=0; i<product.variations.length; i++) {
            variations.push($("inp_product_variation" + product.variations[i].id).value);
        }

        var p = {
            dialog: 'ecommerce',
            act: 'cart_add_product',
            amount: parseInt(this.$["product_qty"].value, 10) || 1,
            pid: product.id,
            variations: variations.join(","),
            form_data: form_data,
            page_url: location.href
        };
        core.transport.send('/controller.php', p, this.onResp_AddToCart.bind(this), 'POST');
        this.$["product_add_to_cart"].disabled = true;
    },


    onResp_AddToCart: function(r) {
        this.$["product_add_to_cart"].disabled = false;
        if (this.isInvalidResponse(r, 'cart_add_product')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status == 0) {
            desktop.modal_dialog.alert(r.data.text);
            return;
        }
        var msg = r.data.text + '\nTotal amount: '+r.data.cart.total_amount_items+r.data.cur;
        if($('scart_icon_text')){
            $('scart_icon_text').innerHTML = '<span>Shopping Cart</span> '+r.data.items_num+' item/s | $'+r.data.total+' value'
        }
        if(r.data.redirect_to_page) {
            desktop.ecom_cart.gotoCheckoutPage(r.data.redirect_to_page, r.data.checkout_ssl);
        } else {
            if($('shoppingCartTblBox')) {
                for(var id in desktop.layout.apps) {
                    if (desktop.layout.apps[id].appName == 'shopping_cart') {
                        desktop.layout.apps[id].loadShoppingCart();
                    }
                }
            }
            desktop.modal_dialog.alert(msg);
        }
    },


    // checking response received from the backend;
    // if reponse is wrong then shows message box
    isInvalidResponse: function(resp, actName) {
        var msg, isInvalid = true;

        if (typeof(resp) != "object") {
            msg = "Response object is omitted";
        } else if(resp.status != "ok") {
            msg = "Backend error #1: status";
        } else if(resp.act != actName) {
            msg = "Backend error #2: action";
        } else {
            isInvalid = false;
        }
        return isInvalid;
    }


};
core.apps.layout_store.extendPrototype(core.components.html_component);