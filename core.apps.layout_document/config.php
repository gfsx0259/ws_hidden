<?

    $config["js_apps"]["core.apps.layout_document"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "layout_document.js",
                    "layout_document.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "layout_document.js"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "layout_document.js"
                )
            )
        )

    )


?>