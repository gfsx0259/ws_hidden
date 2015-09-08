<tpl name="websemble_auth">
    <div class="site_auth">
        <div id="auth_logged" style="display: none" class="user_info">
            <div>You are logged as <span id="auth_logged_user"></span></div>
            <a events="onclick=onLogoutClick">Logout</a> | <a events="onclick=onAdminPanelClick">Admin panel</a>
        </div>

        <div id="auth_not_logged" style="display: none" class="auth_form">
            <form id="auth_form" method="post">
               <input type="text" name="email" class="login"/>
               <input type="password" name="pwd" class="pwd"/>
               <input type="submit" class="submit" value=" Go "/>
            </form>
            <div>
                <a events="onclick=onFacebookLoginClick">Use Facebook account</a>
                <span id="box_reset_pwd" style="display: none"> | <a events="onclick=onPwdResetClick">Restore password</a></span>
            </div>
        </div>
    </div>
</tpl>