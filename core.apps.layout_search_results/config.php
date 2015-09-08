<?

    $config["js_apps"]["core.apps.layout_search_results"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("layout_search_results.js"),
                "styles" => array("styles.css")
            ),



            USERTYPE_CONTRIBUTOR => array(
                "code" => array("layout_search_results.js"),
                "styles" => array("styles.css")
            ),


            USERTYPE_GUEST => array(
                "code" => array("layout_search_results.js"),
                "styles" => array("styles.css")
            )
        )

    )


?>