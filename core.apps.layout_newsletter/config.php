<?

    $config["js_apps"]["core.apps.layout_newsletter"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("layout_newsletter.js")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("layout_newsletter.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("layout_newsletter.js")
            )
        )

    )


?>