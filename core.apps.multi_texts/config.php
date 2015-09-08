<?

    $config["js_apps"]["core.apps.multi_texts"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "multi_texts.js",
                    "multi_texts.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("multi_texts.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("multi_texts.js")
            )
        )

    )


?>