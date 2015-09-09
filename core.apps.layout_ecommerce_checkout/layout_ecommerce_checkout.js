core.apps.layout_ecommerce_checkout = function(args) {

    this.title = 'Checkout';
    this.cart = window["static_cart"] || null;
    this.ecommerce_settings = window["static_ecommerce_settings"] || null;
    this.origBorderColor = '';
    this.states_list = window["states_list"] || null;

};

core.apps.layout_ecommerce_checkout.prototype = {

    run: function() {
        // show/hide shipping info
        if(this.cart) {
            this.updateShippingInfo(this.cart.have_freight);
        }
        // show/hide card details
        if ($('inp_payment_method_pp') && $('inp_payment_method_pp').checked){
            this.updatePaymentInfo('paypal');
        }else{
            this.updatePaymentInfo('ematters');
        }
        
        // other inits
        if($('inp_first_name')) {
            this.origBorderColor = $('inp_first_name').style.borderColor;
        }

        this.onSelCountry(true);
        this.onClickExistingCustomer();
    },



    updateShippingInfo: function(have_freight) {
        var disabled = have_freight ? false : true;
        var ids = ['inp_street','inp_city','inp_state','inp_postcode','inp_country','inp_state_id'];
        var p = {
            disabled: disabled,
            style: {
                backgroundColor: disabled ? '#eee' : '#fff'
            }
        };
        this.setElementAttributes(ids, p);
    },

    updatePaymentInfo: function(payment_method) {
        var disabled = payment_method == 'ematters' ? false : true;
        var ids = ['inp_cc_type','inp_cc_holder','inp_cc_number','inp_cc_exp_month','inp_cc_exp_year','inp_cc_cvv2'];
        var p = {
            disabled: disabled,
            style: {
                backgroundColor: disabled ? '#eee' : '#fff'
            }
        };
        this.setElementAttributes(ids, p);
    },

    setElementAttributes: function(ids, attributes) {
        var el, attr_name, style_name, styles;

        for (var i in ids) {
            el = $(ids[i]);
            if (!el) continue;

            for (attr_name in attributes) {
                switch (attr_name) {
                    case 'disabled':
                        el[attr_name] = attributes[attr_name];
                        break;
                    case 'style':
                        styles = attributes[attr_name];
                        for (style_name in styles) {
                            el.style[style_name] = styles[style_name];
                        }
                        break;
                    default:
                        //do nothing
                }//switch
            }//for
        }//for
    },
    //=====================================================================================
    //=====================================================================================
    // checking response received from the backend;
    // if reponse is wrong then shows message box
    isInvalidResponse: function(resp, actName) {
        var msg, isInvalid = true;

        if (typeof(resp) != 'object') {
            msg = 'Response object is omitted';
        }
        else
        if (resp.status != 'ok') {
            msg = 'Backend error #1: status';
        }
        else
        if (resp.act != actName) {
            msg = 'Backend error #2: action';
        }
        else {
            isInvalid = false;
        }

        if (isInvalid) {
            this.showMessageBox('e', msg, 5);
        }

        return isInvalid;
    },

    showMessageBox: function(name, html, hideDelayTime) {
        desktop.modal_dialog.alert(html);
    },
    //=====================================================================================
    //=====================================================================================






    onSelCountry: function(skip_addr_change){
        if(!$("inp_country")) return;
        var country_id = $("inp_country").value;
        var opts = $("inp_state_id").options;
        var visible_states = 0;

        for(var i=1; i<opts.length; i++) {
            if(opts[i].id.indexOf(country_id + "_") == -1) {
                opts[i].style.display = "none";
            } else {
                opts[i].style.display = "";
                visible_states++;
            }
        }

        if(country_id == 0 || !visible_states) {
            $("inp_state_id").value = 0;
        }
        if(!skip_addr_change) {
            this.onAddrChanged();
        }
    },
    

    onPostcodeChanged: function() {
        var el = $("inp_postcode");
        el.value = el.value.replace(/[^0-9]/gi, "");
        this.onAddrChanged();
    },


    onAddrChanged: function() {
        clearTimeout(this.tm_fregiht);
        this.tm_fregiht = setTimeout(this.updateFreight.bind(this), 400);
    },

    updateFreight: function() {
        var pc = $("inp_postcode").value.replace(/[^0-9]/gi, "");
        var p = {
            dialog: 'ecommerce',
            act: 'cart_update_freight',
            postcode: pc ? pc : "",
            country_id: $("inp_country").value, 
            state_id: $("inp_state_id").value
        };
        core.transport.send('/controller.php', p, this.freghtResponce.bind(this));
    },


    freghtResponce: function(r) {
        if (this.isInvalidResponse(r, 'cart_update_freight')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status == 0) {
            desktop.modal_dialog.alert(r.data.text);
            return;
        }

        this.cart = r.data.cart;
        this.updateContent_DefaultViewEx(this.cart);
    },





    // clear cart
    onBtnClick_ClearCart: function() {
        var p = {
            dialog: 'ecommerce',
            act: 'cart_clear_cart'
        };
        core.transport.send('/controller.php', p, this.onResp_ClearCart.bind(this), 'POST');
    },

    onResp_ClearCart: function(r) {
        if (this.isInvalidResponse(r, 'cart_clear_cart')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status && r.data.redirect_url) {
            desktop.loadURL(r.data.redirect_url);
        }
    },


    
    //change qty
    onBtnClick_ChangeProduct: function(cart_key) {
        var is_tax_payer = $('inp_is_tax_payer') ? $('inp_is_tax_payer').value : 0;
        var qty = parseInt($('product_qty_'+cart_key).value, 10) ? parseInt($('product_qty_'+cart_key).value, 10) : 1;
        var p = {
            dialog: 'ecommerce',
            act: 'cart_change_product',
            cart_key: cart_key,
            qty: qty,
            is_tax_payer: is_tax_payer
        };
        core.transport.send('/controller.php', p, this.onResp_ChangeProduct.bind(this), 'POST');
    },
    
    onResp_ChangeProduct: function(r) {
        if (this.isInvalidResponse(r, 'cart_change_product')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status == 0) {
            desktop.modal_dialog.alert(r.data.text);
            return;
        }
        this.cart = r.data.cart;
        this.updateContent_DefaultView(this.cart);
    },


    
    // remove product from cart
    onBtnClick_RemoveProduct: function(cart_key) {
        var is_tax_payer = $('inp_is_tax_payer') ? $('inp_is_tax_payer').value : 0;
        var p = {
            dialog: 'ecommerce',
            act: 'cart_remove_product',
            cart_key: cart_key,
            is_tax_payer: is_tax_payer
        };
        core.transport.send('/controller.php', p, this.onResp_RemoveProduct.bind(this), 'POST');
    },

    onResp_RemoveProduct: function(r) {
        if (this.isInvalidResponse(r, 'cart_remove_product')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status == 0) {
            desktop.modal_dialog.alert(r.data.text);
            return;
        }

        this.cart = r.data.cart;
        this.updateContent_DefaultView(this.cart);
    },


    // add discount
    onBtnClick_AddDiscount: function(e) {
        var code = $('discount_code').value;
        var is_tax_payer = $('inp_is_tax_payer') ? $('inp_is_tax_payer').value : 0;
        var p = {
            dialog: 'ecommerce',
            act: 'cart_add_discount',
            code: code,
            is_tax_payer: is_tax_payer
        };
        core.transport.send('/controller.php', p, this.onResp_AddDiscount.bind(this), 'POST');
    },

    onResp_AddDiscount: function(r) {
        if (this.isInvalidResponse(r, 'cart_add_discount')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status == 0) {
            desktop.modal_dialog.alert(r.data.text);
            return;
        }

        this.cart = r.data.cart;
        this.updateContent_DefaultViewEx(this.cart);
    },


    // remove discount
    onBtnClick_RemoveDiscount: function(arg) {
        var btn = (arg && arg.id) ? arg : arg.target;
        var id = btn.id.replace(/discount_remove_/, '');
        var is_tax_payer = $('inp_is_tax_payer') ? $('inp_is_tax_payer').value : 0;
        var p = {
            dialog: 'ecommerce',
            act: 'cart_remove_discount',
            id: id,
            is_tax_payer: is_tax_payer
        };
        core.transport.send('/controller.php', p, this.onResp_RemoveDiscount.bind(this), 'POST');
    },

    onResp_RemoveDiscount: function(r) {
        if (this.isInvalidResponse(r, 'cart_remove_discount')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status == 0) {
            desktop.modal_dialog.alert(r.data.text);
            return;
        }

        this.cart = r.data.cart;
        this.updateContent_DefaultView(this.cart);
    },







    updateContent_DefaultViewEx: function(cart) {
        // update product list table
        this.updateContent_ProductList(cart);
        // update discount list table
        this.updateContent_DiscountList(cart);
        // update amounts
        cart.currency = '$';
        $('total_amount_items').innerHTML = '+ {currency}{total_amount_items}'.sprintf(cart);
        $('total_amount_discounts').innerHTML = '- {currency}{total_amount_discounts}'.sprintf(cart);
        $('total_amount_freight').innerHTML = '+ {currency}{total_amount_freight}'.sprintf(cart);
        $('total_amount_taxes').innerHTML = '+ {currency}{total_amount_taxes}'.sprintf(cart);
//        $('total_amount_order').innerHTML = '+ {currency}{total_amount_order}'.sprintf(cart);
        $('total_amount_all').innerHTML = '{currency}{total_amount_all}'.sprintf(cart);
        // show/hide Shipping information
        this.updateShippingInfo(cart.have_freight);
    },

    updateContent_DefaultView: function(cart) {
        this.onAddrChanged();
///        this.getCountryCart($("inp_country").value, $("inp_state_id").value);
    },

    
    updateContent_ProductList: function(cart) {
        var table = $('order-list');
        var rows = table.rows;
        var row, row_id, cur_prod_id, items_updated = [], rows_to_delete = [];

        // scan through all table rows and:
        // a) find rows related to items deleted from cart
        // b) all other rows update with new information
        for (var i = 0; i < rows.length; i++) {
            row = rows[i];
            row_id = row.id;
            // skip rows which are not related to product info
            if (row_id.indexOf('product_list_row_') == -1)
                continue;

            // get product ID
            var cart_key = row_id.replace(/product_list_row_/, '');

            // check presence of product id in cart
            if (cart.items[cart_key] == undefined) {
                // product not exists in cart; mark that row to be deleted
                rows_to_delete[rows_to_delete.length] = row;
            } else {
                // current item is existing in cart; related row data will be update; item will be marked
                this.updateContent_ProductListRow(cart_key, cart.items[cart_key]);
                cart.items[cart_key]._row_updated = 1;
            }
        }//for

        // remove rows marked to be deleted
        var p;
        for (i = rows_to_delete.length-1; i >= 0; i--) {
            p = rows_to_delete[i].parentNode;
            p.removeChild(rows_to_delete[i]);
        }

        // find items which are not presented and add rows for them
        for(var cart_key in cart.items) {
            var product = cart.items[cart_key];
            if(product._row_updated == undefined) {
                this.renderContent_ProductListRow(cart_key, product);
            }
        }
    },

    renderContent_ProductListRow: function(cart_key, product) {
        var m = {
            tag:'tr', id:'product_list_row_'+cart_key, className : (product.allowed?'':'disalowed'), 
            childs: [
              { tag:'td', id:'product_desc_'+cart_key, 
                innerHTML: 
                    product.name + 
                    "<div>" + product.variations_info + "</div>" +
                    "<div>" + product.form_data + "</div>" },
              { tag:'td', id:'product_price_sell_'+cart_key, innerHTML:'$'+product.price_sell},
              { tag:'td', 
                childs: [
                  { tag:'input', type:'text', 
                    name:'product_qty_'+cart_key, id:'product_qty_'+cart_key, value:product.amount, 
                    className:'inp-product-qty',
                    events: { 
                      onkeyup: [ "onBtnClick_ChangeProduct", cart_key ],
                      onmouseup: [ "onBtnClick_ChangeProduct", cart_key ]
                    }}
                ]},
              { tag:'td', id:'product_price_amount_'+cart_key, innerHTML:'$'+product.price_amount},
              { tag:'td', className:'col-actions', 
                childs: [
                  { tag:'button', id:'product_remove_'+cart_key, 
                    className:'btn-product-remove', 
                    events:{onclick:['onBtnClick_RemoveProduct', cart_key ]} }
                ]}
            ]
        };

        var table_el = $('order-list');
        if(core.browser.ie && table_el.firstChild) table_el = table_el.firstChild; 
        this.buildModel(table_el, m);
    },

    updateContent_ProductListRow: function(cart_key, product) {
        $('product_list_row_'+cart_key).className = (product.allowed?'':'disalowed');
        $('product_desc_'+cart_key).innerHTML = 
            product.name + 
            "<div>" + product.variations_info + "</div>" +
            "<div>" + product.form_data + "</div>" +
            (product.allowed ? '' : '<div>(can`t be shipped to current location)</div>');
        $('product_desc_'+cart_key).className = 'ecom_products';
		$('product_price_sell_'+cart_key).innerHTML = '$'+product.price_sell;
        $('product_qty_'+cart_key).value = product.amount;
        $('product_price_amount_'+cart_key).innerHTML = '$'+product.price_amount;
    },

    updateContent_DiscountList: function(cart) {
        var table = $('discount-list');
        var rows = table.rows;
        var row, row_id, cur_discount_id, rows_to_delete = [];

        // scan through all table rows and:
        // a) find rows related to discounts deleted from cart
        // b) all other rows update with new information
        for (var i = 0; i < rows.length; i++) {
            row = rows[i];
            row_id = row.id;
            if (row_id.indexOf('discount_list_row_') == -1)
                continue;

            cur_discount_id = row_id.replace(/discount_list_row_/, '');
            if (cart.discounts[cur_discount_id] == undefined) {
                rows_to_delete[rows_to_delete.length] = row;
            } else {
                cart.discounts[cur_discount_id]._rendered = 1;
            }
        }//for

        // remove rows marked to be deleted
        var p;
        for (i = rows_to_delete.length-1; i >= 0; i--) {
            p = rows_to_delete[i].parentNode;
            p.removeChild(rows_to_delete[i]);
        }

        // find discounts which are not presented and add rows for them
        for(i in cart.discounts) {
            discount = cart.discounts[i];
            if(!discount._rendered) {
                this.renderContent_DiscountListRow(discount);
            }
        }
    },


    renderContent_DiscountListRow: function(discount) {
        var id = discount.id;
        var str_amount;

        if (discount.type_discount == 1) {
            str_amount = discount.discount + '%';
        } else {
            str_amount = '$' + discount.discount;
        }

        if (discount.type_apply == 1) {
            str_amount += ' from appropriate products';
        } else {
            str_amount += ' from whole order';
        }

        var m = {
            tag:'tr', id:'discount_list_row_'+id, childs: [
                {tag:'td', id:'discount_code'+id, innerHTML:discount.code},
                {tag:'td', childs: [
                    {tag:'div', id:'discount_name_'+id, className:'d1', innerHTML:discount.name, childs: [
                        {tag:'button', id:'discount_remove_'+id, className:'btn-discount-remove', events:{onclick:['onBtnClick_RemoveDiscount']}}
                    ]},
                    {tag:'div', id:'discount_amount_'+id, className:'d2', innerHTML:str_amount},
                    {tag:'div', id:'discount_desc_'+id, className:'d3', innerHTML:discount.description},
                ]},
            ]
        };
        var table_el = $('discount-list');
        if(core.browser.ie && table_el.firstChild) table_el = table_el.firstChild; 
        this.buildModel(table_el, m);
    },

    onSelChange_PaymentMethod: function(val) {
        this.updatePaymentInfo(val);
    },

    onBtnClick_PopupInfo: function(n) {
        var texts = {
            1: 'You can find CVV2 number at the back side of your credit card',
            2: 'Here you can read Terms of Service\nblah-blah-blah'
        };
        var titles = {
            1: 'Where do I find CVV2?',
            2: 'Terms of service'
        };
//        var app = new core.apps.textbox();
//        app.setsomething();
//        app.renderContent();
    },

    onBtnClick_Pay: function() {
        // check cart: presence
        if (!this.cart) {
            desktop.modal_dialog.alert('Error! Cart is not initialised');
            return;
        }
        // check cart: total amount & items number (at least one)
        var count = 0;
        for (var i in this.cart.items) {
            count++;
            break;
        }
        if (!count || !this.cart.total_amount_items) {
            desktop.modal_dialog.alert('You cart is empty. Please order something first.');
            return;
        }

        // validate form values
        var msg = this.validateForm();
        if (msg.length) {
            desktop.modal_dialog.alert(msg);
            return;
        }

        if (this.cart.allowed == 0) {
            desktop.modal_dialog.alert('Some of products in cart can not be shipped. Please remove it from your cart.');
            return;
        }
        
        var p = this.getFields($('customer_form'));
        if (p.payment_method != 'ematters'){
            this.sendPPData();
        }else{
            this.sendPPData(true);
        }
        
        return true;
    },

    sendPPData: function(ccard) {
       var p = this.getFields($('customer_form'));
       p.dialog = 'ecommerce';
       p.act = 'cart_payment_prepare';
       if (!ccard){
           p.paypal = '1';
       }
       if(this.customer_id && $("inp_existing_customer").checked) {
           p.customer_id = this.customer_id;
       }
       core.transport.send('/controller.php', p, this.onSendPPData.bind(this), 'POST');
       return false;
   },

   onSendPPData: function(res) {
       if(res.data.paypal == 1){
           var ppForm = $('paypal_form'); 
           ppForm.business.value = res['data'].business;
           ppForm["return"].value = res['data'].r_url;
           ppForm.cancel_return.value = res['data'].c_url;
           ppForm.notify_url.value = res['data'].n_url;
           ppForm.custom.value = res['data'].id;
           ppForm.amount.value = res['data'].total;
           ppForm.currency_code.value = res['data'].cur;
           ppForm.action = res['data'].p_action;
           ppForm.submit();
           if (test_mode){
               $('inp_test_pp_id').value = res.data.id;
               $('pp_test_mode_form').submit();
           }
       } else {
           $('inp_cc_id').value = res.data.id;
           $('cc_form').submit();
       }
   },

    
   validateForm: function() {                                                                        
        var f, l, er = {};
        f = this.getFields($('customer_form'));
        l = this.getLabels($('customer_form'));

        //
        // VALIDATE FIELDS
        //
        // GROUP 1: contact data
        if (isEmpty(f.first_name)) {
            er.first_name = 'empty';
        }

        if (isEmpty(f.last_name)) {
            er.last_name = 'empty';
        }

        if (isEmpty(f.email)) {
            er.email = 'empty';
        }

        if (isEmpty(f.email_confirm)) {
            er.email_confirm = 'empty';
        }
        else
        if (f.email != f.email_confirm) {
            er.email_confirm = 'notconfirmed';
        }

        // GROUP 2: freight delivery data
        if (this.cart.have_freight == 1) {
            if (isEmpty(f.street)) {
                er.street = 'empty';
            }

            if (isEmpty(f.city)) {
                er.city = 'empty';
            }

            if (isEmpty(f.state) && (isEmpty(f.state_id) || f.state_id==0)) {
                er.state = 'empty';
            }

            if (isEmpty(f.postcode)) {
                er.postcode = 'empty';
            }

            if (isEmpty(f.country) || f.country == 0) {
                er.country = 'notselected';
            }
        }

        // GROUP 3: payment details data
        if (this.ecommerce_settings && this.ecommerce_settings.charge_sales_tax) {
            if (isEmpty(f.is_tax_payer) || f.is_tax_payer == 0) {
                er.is_tax_payer = 'notselected';
            }
        }

        if (isEmpty(f.payment_method) || f.payment_method == 0) {
            er.payment_method = 'notselected';
        }
        else
        if (f.payment_method == 'ematters') {
            if (isEmpty(f.cc_type) || f.cc_type == 0) {
                er.cc_type = 'notselected';
            }

            if (isEmpty(f.cc_holder)) {
                er.cc_holder = 'empty';
            }

            if (isEmpty(f.cc_holder)) {
                er.cc_holder = 'empty';
            }

            if (isEmpty(f.cc_number) || !isCN(f.cc_number)) {
                er.cc_number = 'cc_number';
            }

            if (isEmpty(f.cc_exp_month)) {
                er.cc_exp_month = 'notselected';
            }

            if (isEmpty(f.cc_exp_year)) {
                er.cc_exp_year = 'notselected';
            }

            if (isEmpty(f.cc_cvv2) || !isCVV(f.cc_cvv2)) {
                er.cc_cvv2 = 'cc_cvv2';
            }
        }

        // GROUP4: terms
        if (isEmpty(f.terms_agree)) {
            er.terms_agree = 'You must accept "Terms of service"'; 
        }

        // check if any errors found, build error message string, highlight errorneous fields
        var ert, fname, el, s1;
        var s1 = '';
        var s2 = 'The following problems have been identified:\n';
        var msg = '';

        for (var fname in er) {
            ert = er[fname];
            el = $('inp_'+fname);
            s1 = '          '+ l[fname].replace(/ \*/, '') + ': ';

            switch (ert) {
                case 'notselected':
                    s1 += 'must be selected';
                    break;
                case 'cc_number':
                    s1 += 'must contain 16 digits [0-9]';
                    break;
                case 'cc_cvv2':
                    s1 += 'must contain 3 or 4 digits [0-9]';
                    break;
                case 'notconfirmed':
                    s1 += 'must be equal to '+l.email.replace(/ \*/, '');
                    break;
                case 'empty':
                default:
                    if (fname != 'terms_agree')
                        s1 += 'must be not empty';
                    else
                        s1 += ert;
                    break;
            }//switch

            // set up color restore function
            var color = this.origBorderColor;
            if(el) {
                el.onfocus = function(){this.style.borderColor = color;};
                // hightlight with red color
                el.style.borderColor = 'red';
            }

            s1 += '\n';
            msg += s1;
        }//for

        if (msg.length) {
            msg = s2 + msg;
        }

        return msg;

        //
        // internal validation functions
        //
        function isCVV(x) {
           return x.search(/^[0-9]{3,4}$/ig) != -1;
        }
        function isCN(x) {
           return x.search(/^[0-9]{16}$/ig) != -1;
        }
        function isEmpty(x) {
            if (typeof(x)=='undefined' || (x=='') || (x==''&&!isNaN(x)) || (/^\s*$/.test(x))) {
                return true;
            } else {
                return false;
            }
        }
    },
    //validateForm function end

    getLabels: function(parentEl) {
        var i, max_i, label, id, name, title;
        var data = {};

        var list = parentEl.getElementsByTagName('LABEL');

        for (i = 1, max_i = list.length; i < max_i; i++) {
            var label = list[i];
            if (label.getAttribute('htmlFor')){
                var id = label.getAttribute('htmlFor');
            }else{
                var id = label.getAttribute('for');
            }
            var title = label.getAttribute('title');
            var name = id.replace(/inp_/, '');
            data[name] = title ? title: label.innerHTML;
        }

        return data;
    },

    getFields: function(parentEl, tagNames, allowedElNames) {
        var k, i, list, tagName, el, elName, elValue;
        var radioBoxesValues = {};
        tagNames = tagNames || ['input', 'textarea', 'select'];

        var data = {};

        for (k in tagNames) {
            tagName = tagNames[k].toLowerCase();
            // avoid applying to all tagnames
            if (tagName == '*')
                continue;

            list = parentEl.getElementsByTagName(tagName);

            for (i = 0, max_i = list.length; i < max_i; i++) {
                el = list[i];
                elName = el.name;

                // if we have restriction to certain field name(s),
                // and current element name is not mentioned in allowedElNames
                // then skip that element from processing
                if (allowedElNames != undefined && allowedElNames[elName] == undefined)
                    continue;

                // all checkboxes will provide 0 value if NOT CHECKED, OR value of checkboxes' VALUE attr with CHECKED state
                // all radio boxes will provide value only if one of them is CHECKED, otherwise radio box will provide 0 value
                // input, textarea, select will normally provide current value
                if (tagName == 'input' && el.type == 'checkbox') {
                    elValue = el.checked ? el.value : 0;
                } else if (tagName == 'input' && el.type == 'radio') {
                    // if value of radio group is not yet defined, set default value of radio group to 0
                    if (radioBoxesValues[elName] == undefined) {
                        radioBoxesValues[elName] = 0;
                    }
                    // because we can have, for example, 2 radio boxes ('abc' and 'def'),
                    // where first radio is checked and second radio is unchecked, we have to
                    // make sure that we will not override actual value of radio group
                    // simple check of radio box 'checked' attribute will do the deal
                    if (el.checked) {
                        radioBoxesValues[elName] = el.value;
                    }
                } else {
                    elValue = el.value;
                }

                // put value to array for all types of fields, except radio groups; radio groups value to be copied out of the loops
                if (!(tagName == 'input' && el.type == 'radio')) {
                    data[elName] = elValue;
                }
            }//for i
        }//for k

        // copy values of radio groups from radioBoxesValues to data
        for (var rbName in radioBoxesValues) {
            data[rbName] = radioBoxesValues[rbName];
        }

        return data;
    },



    // save/load customer info
    onClickExistingCustomer: function() {
        if(!$("inp_existing_customer")) return;
        var fl = $("inp_existing_customer").checked;
        $("row_customer1").style.display = fl ? "" : "none";
        $("row_customer2").style.display = fl ? "" : "none";
        $("msg_cutomer_error").style.display = "none";
    },


/*
        var code = $('discount_code').value;
        var is_tax_payer = $('inp_is_tax_payer') ? $('inp_is_tax_payer').value : 0;
        var p = {
            dialog: 'ecommerce',
            act: 'cart_add_discount',
            code: code,
            is_tax_payer: is_tax_payer
        };
        core.transport.send('/controller.php', p, this.onResp_AddDiscount.bind(this), 'POST');
    },

    onResp_AddDiscount: function(r) {
        if (this.isInvalidResponse(r, 'cart_add_discount')) return;
        if (!r.data || !r.data.cart)
            return;
        if (r.data.status == 0) {
            desktop.modal_dialog.alert(r.data.text);
            return;
        }

        this.cart = r.data.cart;
        this.updateContent_DefaultViewEx(this.cart);
    },
    */

    onClickGetCustomerInfo: function() {
        $("msg_cutomer_error").style.display = "none";
        var email = $("inp_customer_email").value.trim();
        var pwd = $("inp_customer_pwd").value.trim();
        if(email == "" || pwd == "") return;
        $("btn_get_customer_info").disabled = true;
        var p = {
            dialog: "ecommerce",
            act: "cart_add_customer",
            email: email, 
            pwd: pwd
        };
        core.transport.send('/controller.php', p, this.onCustomerInfoResponce.bind(this));
    },


    onCustomerInfoResponce: function(r) {
        this.customer_id = false;
        $("btn_get_customer_info").disabled = false;
        if(this.isInvalidResponse(r, "cart_add_customer")) return;
        if(!r.data.customer) {
            $("msg_cutomer_error").style.display = "block";
            return;
        }
        for(var k in r.data.customer) {
            if(k == "id") continue;
            var el = $("inp_" + k);
            if(el) {
                el.value = r.data.customer[k];
            }
        }
        $("inp_email_confirm").value = $("inp_email").value;
        $("inp_country").value = r.data.customer["country_id"];
        this.customer_id = r.data.customer.id;
        this.onSelCountry();
        this.cart = r.data.cart;
        this.updateContent_DefaultViewEx(this.cart);
    }

};
core.apps.layout_ecommerce_checkout.extendPrototype(core.components.html_component);