<?

    $config["js_apps"]["core.apps.layout_no_page"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("layout_no_page.js")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("layout_no_page.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("layout_no_page.js")
            )
        )

    )


?>