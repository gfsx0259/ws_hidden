core.apps.websemble_signup = function (args) {

    this.defaultProfile = {
        title: "Create, host & manage for free",
        app_style: "",
        top_text: "<h4>Start creating NOW!</h4>",
        bottom_text: "<a href=\'/\'>You can upgrade at any time</a>"
    }

}

core.apps.websemble_signup.prototype = {

    default_values: {
        email: "email"
    },

    errors: ["email", "email_used", "recaptcha"],


    buildContent: function (el) {
        if (core.browser.ie && core.browser.ie_version < 7) {
            this.$["content"].innerHTML = "You cannot signup because you are using IE" + core.browser.ie_version;
            return;
        }
        this.displayTpl(el, "websemble_signup");

        for (var i in this.default_values) {
            this.$["inp_" + i].value = this.default_values[i];
        }

        this.updateInputs();
    },

    onOpen: function () {
        this.setTitle(this.profile["title"]);
        this.refresh();
    },


    // form
    updateInputs: function () {
        for (var i in this.default_values) {
            var el = this.$["inp_" + i];
            var v = el.value.trim();
            if (v == "") {
                el.className = "empty";
                el.value = this.default_values[i];
            } else if (v == this.default_values[i]) {
                el.className = "empty";
                el.value = v;
            } else {
                el.className = "";
                el.value = v;
            }
        }
    },


    onInputFocus: function (e) {
        e = core.browser.event.fix(e);
        var el = e.target;
        if (el.value == this.default_values[el.name]) {
            el.value = "";
        }
        el.className = "";

        if (el.name == 'email' && $('captcha_cont').innerHTML == '') {
            Recaptcha.create("6LeZ5_oSAAAAAOISaiajYOdSooc04eAmH6bg33iS",
                "captcha_cont", {
                    theme: "white"
                }
            );
        }
    },


    onInputBlur: function (e) {
        this.updateInputs();
    },

    processInputs: function () {
        var errors = {};
        var fl = false;
        var values = {};
        for (var i in this.default_values) {
            var v = this.$["inp_" + i].value;
            if (v == this.default_values[i]) {
                errors[i] = 1;
                fl = true;
            } else if (i == "email" && !core.common.isEmail(v)) {
                errors[i] = 1;
                fl = true;
            } else {
                values[i] = v;
            }
        }
        if ($('recaptcha_response_field') && core.common.isEmpty($('recaptcha_response_field').value)) {
            errors.recaptcha = 1;
            fl = true;
        }
        if (fl) {
            this.showErrors(errors);
            return false;
        } else {
            this.showErrors(null);
            return values;
        }
    },


    showErrors: function (errors) {
        if (!errors) errors = {};
        for (var i = 0; i < this.errors.length; i++) {
            var key = this.errors[i];
            if (errors[key]) {
                this.showElement("msg_" + key);
            } else {
                this.hideElement("msg_" + key);
            }
        }
    },


    onSubmitClick: function () {
        if (core.usertype >= USERTYPE_ADMIN) {
            desktop.modal_dialog.alert("You are logged as admin, logout before signup.");
            return;
        }
        this.values = this.processInputs();
        if (this.values) {
            this.values.recaptcha_challenge_field = $('recaptcha_challenge_field').value;
            this.values.recaptcha_response_field = $('recaptcha_response_field').value;

            this.showErrors(null);
            this.hideElement("btn_submit_box");
            this.showElement("msg_loading");
            this.values.dialog = "create_account";
            core.transport.send("/controller.php", this.values, this.onServerResponce.bind(this), "POST");
        }
    },


    onServerResponce: function (r) {
        if (!r) {
            desktop.modal_dialog.alert("Server error");
            return;
        }

        if (r.status == "ok") {
            var p = {
                redirect_url: "/?dialog=new_site_wizard",
                dialog: "auth",
                action: "login",
                email: this.values.email,
                pwd: r.key
            }
            desktop.loadURL("http://" + core.data.home_domain + "/?" + core.transport.getEncodedData(p));
            return;
        }

        if (r.status == "error") {
            this.showElement("btn_submit_box");
            this.hideElement("msg_loading");

            for (var i = 0; i < this.errors.length; i++) {
                var key = this.errors[i];
                if (r.error_keys[key] && key == 'recaptcha') {
                    Recaptcha.reload();
                }
            }

            this.showErrors(r.error_keys);
        }
    },


    refresh: function () {
        this.$["bottom_text"].innerHTML = this.profile["bottom_text"];
        this.$["top_text"].innerHTML = this.profile["top_text"];
    },


    onFacebookClick: function () {
        desktop.loadURL("http://" + core.data.home_domain + "/?dialog=auth_facebook&action=start&show_new_site_wizard=1");
    }


}
core.apps.websemble_signup.extendPrototype(core.components.html_component);
core.apps.websemble_signup.extendPrototype(core.components.desktop_app);