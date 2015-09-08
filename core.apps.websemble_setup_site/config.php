<?

    $config["js_apps"]["core.apps.websemble_setup_site"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "websemble_setup_site.js",
                    "websemble_setup_site.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "websemble_setup_site.js"
                 )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "websemble_setup_site.js"
                )
            )
        )

    )


?>