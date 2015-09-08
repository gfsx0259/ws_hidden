<?

    $config["js_apps"]["core.apps.layout_sitemap"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("layout_sitemap.js")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("layout_sitemap.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("layout_sitemap.js")
            )
        )

    )


?>