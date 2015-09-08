<?

    $config["js_apps"]["core.apps.layout_user"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("layout_user.js"),
                "templates" => array("templates/layout_user_forms.xml"),
                "styles" => array("styles.css")
            ),



            USERTYPE_CONTRIBUTOR => array(
                "code" => array("layout_user.js"),
                "templates" => array("templates/layout_user_forms.xml"),
                "styles" => array("styles.css")
            ),


            USERTYPE_GUEST => array(
                "code" => array("layout_user.js"),
                "templates" => array("templates/layout_user_forms.xml"),
                "styles" => array("styles.css")
            )
        )

    )


?>