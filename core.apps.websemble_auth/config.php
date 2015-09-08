<?

    $config["js_apps"]["core.apps.websemble_auth"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "websemble_auth.js"
                ),
                "templates" => array(
                    "template.tpl"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "websemble_auth.js"
                ),
                "templates" => array(
                    "template.tpl"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "websemble_auth.js"
                ),
                "templates" => array(
                    "template.tpl"
                )
            )
        )

    )


?>