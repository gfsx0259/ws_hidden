core.apps.layout_user = function(args) {


    this.displayTpl(args.parentElement, "layout_user_forms");


    switch(REQUEST_GET["mode"]) {
        case "login":
            this.title = "User login";
            this.showElement("login_form");
            if(core.data.layout_user_account_status == "login_error") {
                this.showElement("l_error");
            }
            break;

        case "register":
            this.title = "New user";
            this.showElement("register_form");
            this.loadRegCaptcha();
            if(core.data.site_info.users_reg_msg) {
                this.$["reg_msg"].innerHTML = core.data.site_info.users_reg_msg;
                this.showElement("sec_reg_reason");
            } else {
                this.hideElement("sec_reg_reason");
            }
            break;

        case "reg_confirm":
            this.title = "Account status";
            this.showElement("msg_" + core.data.layout_user_account_status);
            break;

        case "reset_pwd":
            this.title = "Reset password";
            if(core.data.layout_user_account_status) {
                this.showElement("msg_" + core.data.layout_user_account_status);
            } else {
                this.showElement("reset_pwd_form");
            }
            break;


        default:
            this.title = "Empty page";
            this.hideElement("content");
            break;
    }

}


core.apps.layout_user.prototype = {


    // Login

    onLoginClick: function() {
        var p = {
            dialog: "site_users",
            act: "login",
            email: this.$["inp_l_email"].value.trim(),
            pwd: this.$["inp_l_pwd"].value.trim(),
            remember_me: this.$["inp_l_remember_me"].checked ? 1 : 0
        }

        if(p.email == "" || p.pwd == "") return;
        this.hideElement("l_error");
        this.$["btn_l_submit"].disabled = true;
        core.transport.send("/controller.php", p, this.onLoginResponce.bind(this));
    },

    onLoginResponce: function(r) {
        if(r == "success") {
            desktop.loadURL("/");
        } else {
            this.$["btn_l_submit"].disabled = false;
            this.showElement("l_error");
        }
    },



    // Register
    loadRegCaptcha: function() {
        this.$["reg_captcha_img"].src = "/controller.php?dialog=site_users&act=reg_captcha&_=" + Math.random();
    },


    onRegisterClick: function(e) {
        var p = {
            dialog: "site_users",
            act: "register",
            email: this.$["inp_r_email"].value.trim(),
            captcha_code: this.$["inp_r_captcha_code"].value.trim()
        }

        if(p.email == "") {
            this.showRegFormError("Incorrect email");
            return;
        } 
        var pwd = this.$["inp_r_pwd"].value.trim();
        var pwd2 = this.$["inp_r_pwd2"].value.trim();

        if(pwd == "") {
            this.showRegFormError("You should define password");
            return;
        } else if(pwd != pwd2) {
            this.showRegFormError("Incorrect confirm password value ");
            return;
        } else if(core.data.site_info.users_reg_confirmation == 0 && p.captcha_code.length != 4) {
            this.showRegFormError("Incorrect captcha code");
            return;
        }

        p.pwd = pwd;
        p.reg_reason = this.$["inp_r_reg_reason"].value;

        this.hideElement("l_error");
        this.$["btn_r_submit"].disabled = true;
        core.transport.send("/controller.php", p, this.onRegisterResponce.bind(this));
    },



    onRegisterResponce: function(r) {
        switch(r["status"]) {
            case "captcha_error":
                this.showRegFormError("Incorrect captcha code");
                this.$["inp_r_captcha_code"].value = "";
                this.loadRegCaptcha();
                break;

            case "empty_reason":
                this.showRegFormError("Error. Please enter a reason you want to register for this site.");
                break;

            case "email_used":
                this.showRegFormError("Email already used");
                break;

            case "success":
                if(r.msg == "registered") {
                    desktop.loadURL("/");
                }
                this.hideElement("register_form");
                this.showElements(["register_info", "msg_reg_" + r.msg]);
                break;

            default:
                this.showRegFormError("Server error");
        }
    },


    showRegFormError: function(v) {
        if(v) {
            this.$["r_error"].innerHTML = v;
            this.showElement("r_error");
        } else {
            this.hideElement("r_error");
        }
    },



    // reset pwd
    onResetPwdClick: function(e) {
        var email = this.$["inp_rp_email"].value.trim();
        if(email == "") return;
        this.$["btn_rp_submit"].disabled = true;
        var p = {
            dialog: "site_users",
            act: "reset_pwd",
            email: email
        }
        core.transport.send("/controller.php", p, this.onResetPwdResponce.bind(this));        
    },


    onResetPwdResponce: function(v) {
        if(v == "ok") {
            this.hideElement("reset_pwd_form");
            this.showElement("reset_pwd_info");
        }
    }


};

core.apps.layout_user.extendPrototype(core.components.html_component);