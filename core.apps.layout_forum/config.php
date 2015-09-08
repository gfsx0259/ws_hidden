<?

    $config["js_apps"]["core.apps.layout_forum"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "layout_forum.js",
                    "layout_forum.admin.js"
                ),
                "styles" => array(
                    "style.css"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "layout_forum.js"
                ),
                "styles" => array(
                    "style.css"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "layout_forum.js"
                ),
                "styles" => array(
                    "style.css"
                )
            )
        )

    )


?>