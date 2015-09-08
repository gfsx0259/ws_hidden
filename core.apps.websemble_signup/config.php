<?

    $config["js_apps"]["core.apps.websemble_signup"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "templates" => array(
                    "templates/websemble_signup.xml"
                ),
                "code" => array(
                    "websemble_signup.js",
                    "websemble_signup.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "templates" => array(
                    "templates/websemble_signup.xml"
                ),
                "code" => array(
                    "websemble_signup.js"
                )
            ),



            USERTYPE_GUEST => array(
                "templates" => array(
                    "templates/websemble_signup.xml"
                ),
                "code" => array(
                    "websemble_signup.js"
                )
            )
        )

    )


?>