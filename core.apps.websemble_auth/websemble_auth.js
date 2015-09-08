core.apps.websemble_auth = function(args) {

    this.defaultProfile = {
        title: ""
    }

//    this.theme_style_key = "site_auth";
}


core.apps.websemble_auth.prototype = {

    
    hint_values: {
        login: "Email",
        pwd: "Password"
    },

    
    onOpen: function() {
        this.setTitle(this.profile["title"]);


        if(core.browser.ie && core.browser.ie_version < 7) {
            this.$["site_auth"].innerHTML = "You cannot login because you are using IE" + core.browser.ie_version;

        } else {
            this.displayTpl(this.$["content"], "websemble_auth");

            this.$["auth_form"].action = "http://" + core.data.home_domain + "/?dialog=auth&action=login";
            this.$["auth_form"].onsubmit = this.onAuthFormSubmit.bindAsEventListener(this);


            desktop.onLogoutResponce = function() {
                var f = function() { desktop.loadURL("/"); }
                desktop.buildModel(document.body,
                    { tag: "iframe", 
                      style: { border: 0, width: "1px", height: "1px" },
                      onload: f,
                      src: "http://" + core.data.home_domain + "/?dialog=auth&action=logout&no_content" }
                );
            }

            if(core.data.site_user) {
                this.showElement("auth_logged");
                if(this.$["auth_logged_user"]) {
                    this.$["auth_logged_user"].innerHTML = core.data.site_user.email;
                }
            } else {
                this.showElement("auth_not_logged");
            }
        }
    },


    onAuthFormSubmit: function(e) {
        if(this.is_site_user_logged) return true;
        var p = {
            dialog: "site_users",
            act: "login",
            email: this.$["auth_form"].email.value,
            pwd: this.$["auth_form"].pwd.value
        }
        core.transport.send("/controller.php", p, this.onSiteUserLoginResponse.bind(this) );
        core.browser.event.kill(e);
        return false;
    },


    onSiteUserLoginResponse: function(r) {
        if(r == "success") {
            this.is_site_user_logged = 1;
            this.$["auth_form"].submit();
        } else {
            this.$["box_reset_pwd"].style.display = "";
        }
    },



    onLogoutClick: function() {
        desktop.onAuthLogoutClick();
    },


    onAdminPanelClick: function() {
        desktop.loadURL("http://" + core.data.home_domain + "/?dialog=user_sites");
    },


    onFacebookLoginClick: function() {
        desktop.loadURL("http://" + core.data.home_domain + "/?dialog=auth_facebook&action=start");
    },


    onPwdResetClick: function() {
        desktop.loadURL("http://" + core.data.home_domain + "/?dialog=auth&page=query_reset_pwd");
    }


}
core.apps.websemble_auth.extendPrototype(core.components.html_component);
core.apps.websemble_auth.extendPrototype(core.components.desktop_app);