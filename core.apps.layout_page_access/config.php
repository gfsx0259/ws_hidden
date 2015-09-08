<?

    $config["js_apps"]["core.apps.layout_page_access"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("layout_page_access.js")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("layout_page_access.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("layout_page_access.js")
            )
        )

    )


?>